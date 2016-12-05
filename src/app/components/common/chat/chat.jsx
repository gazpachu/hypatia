import React, { Component, PropTypes } from 'react';
import { setLoading } from '../../../actions/actions';
import { DEMO_EMAIL, DEMO_CHAT_WARNING } from '../../../constants/constants';
import classNames from 'classnames';
import {connect} from 'react-redux';
import 'whatwg-fetch';
import { rtm, channels, chat } from 'slack';
import { load as emojiLoader, parse as emojiParser } from 'gh-emoji';
import { slackGroups } from '../../../constants/slack';
import $ from 'jquery';
import moment from 'moment';
import User from './user';
import Icon from '../lib/icon/icon'; 

const defaultProps = {
	
};

const propTypes = {
	isDesktop: PropTypes.bool
};

class Chat extends Component {
    
	constructor(props) {
		super(props);
		
		this.state = {
			failed: false,
			users: [],
			channels: [],
			currentChannel: {},
			currentGroup: slackGroups[0],
			messages: [],
			postMyMessage: ''
		};
		
		// Set class variables
		this.bot = null;
		this.refreshTime = 5000;
		this.activeChannelInterval = null;
		this.messageFormatter = {
		  	emoji: false // default
		};
		
		this.loadMessages = this.loadMessages.bind(this);
		this.formatMessage = this.formatMessage.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.changeCurrentGroup = this.changeCurrentGroup.bind(this);
	}
	
	componentDidMount() {
		// Initiate Emoji Library
		emojiLoader().then(() => { this.messageFormatter = { emoji: true }; })
			.catch((err) => this.debugLog(`Cant initiate emoji library ${err}`));
		
		// Connect bot
//		this.connectBot(this).then((data) => {
//			this.debugLog('got data', data);
//			this.setState({ users: data.users, channels: data.channels, currentChannel: data.currentChannel });
//			this.loadMessages();
//		})
//		.catch((err) => {
//			this.debugLog('could not intialize slack bot', err);
//			this.setState({ failed: true });
//		});
		
		// We've got authorization from the user. Request a token
		if (this.props.location.query.code && this.props.location.query.state === 'hypatia-slack') {
			console.log(this.props.location.query.code);
			fetch('https://slack.com/api/oauth.access', { 
				method: 'POST', 
				credentials: true,
				params: { 
					client_id: slackGroups[0].client_id,
					client_secret: slackGroups[0].client_secret,
					code: this.props.location.query.code
				} 
			}).then(function(response, data) { 
				console.log(response.body); 
			});
		}
	}
	
	componentWillUnmount() {
		this.resetInterval();
		this.bot.close();
	}
	
	componentWillReceiveProps(newProps) {
		if (newProps.class !== this.props.class) {

			if (newProps.class === 'open') {
				this.loadGroup();
			}
			else {
				this.resetInterval();
			}
		}
	}
	
	resetInterval() {
		if (this.activeChannelInterval) {
			clearInterval(this.activeChannelInterval);
			this.activeChannelInterval = null;
		}
	}
	
	loadGroup() {
		if (this.bot) {
			this.bot.close();
			this.resetInterval();
		}
		
		// Create Slack Bot
    	this.bot = rtm.client();
		
		this.connectBot(this).then((data) => {
			this.debugLog('got data', data);
			this.setState({ users: data.users, channels: data.channels, currentChannel: data.currentChannel }, function() {
				this.loadMessages();
			});
		})
		.catch((err) => {
			this.debugLog('could not intialize slack bot', err);
			this.setState({ failed: true });
		});
	}
	
	connectBot() {
		return new Promise((resolve, reject) => {
			try {
				// start the bot, get the initial payload
				this.bot.started((payload) => {
					this.debugLog(payload);

					const users = [];
					payload.users.map((user) => !user.is_bot ? users.push(new User(user)) : null);

					const channels = [];
					let currentChannel = null;
					payload.channels.map((channel) => {
						if (channel.name === 'general') currentChannel = channel;
						channels.push(channel);
					});
					
					return resolve({ channels, users, currentChannel });
				});
				
				this.bot.im_created((payload) => {
					console.log(payload);
				});
				
				this.bot.user_typing(function(msg) {
				  	console.log('several people are coding', msg)
				});

				// tell the bot to listen
				this.bot.listen({ token: this.state.currentGroup.apiToken });
			}
			catch (err) {
				return reject(err);
		  	}
		});
	}
	
	changeCurrentGroup(groupId) {
		$('.group').removeClass('active');
		$(this.refs[groupId]).addClass('active');
		this.setState({ currentGroup: this.getGroup(groupId) }, function() {
			this.loadGroup(groupId);
		});
	}
	
	changeCurrentChannel(channelId) {
		$('.channel').removeClass('active');
		$(this.refs[channelId]).addClass('active');
		this.setState({ currentChannel: this.getChannel(channelId)});
		this.loadMessages(channelId);
	}
	
	getGroup(id) {
		id = id || this.state.currentGroup.id;
		let thisGroup = {slug: ''};

		slackGroups.map((group) => {
			if (group.id === id) thisGroup = group;
		});
		return thisGroup;
	}
	
	getChannel(id) {
		id = id || this.state.currentChannel.id;
		let thisChannel = {name: ''};

		this.state.channels.map((channel) => {
			if (channel.id === id) thisChannel = channel;
		});
		return thisChannel;
	}
	
	getUser(id) {
		let thisUser = null;
		this.state.users.map((user) => {
			if (user.id === id) thisUser = user;
		});
		return thisUser;
	}
	
	loadMessages(channelId) {
		const that = this;
		
		channelId = channelId || this.state.currentChannel.id;
		this.resetInterval();
		
		// define loadMessages function
		const getMessagesFromSlack = () => {
			const messagesLength = that.state.messages.length;
			channels.history({
				token: this.state.currentGroup.apiToken,
				channel: channelId || this.state.currentChannel.id
			}, (err, data) => {
				if (err) {
					this.debugLog(`There was an error loading messages for ${channelId}. ${err}`);
					return this.setState({ failed: true });
				}
				
				// loaded channel history
				this.debugLog('got data', data);
				
				// Scroll down only if the stored messages and received messages are not the same
				// reverse() mutates the array
				if (!this.arraysIdentical(this.state.messages, data.messages.reverse())) {
					// Got new messages
					return this.setState({ messages: data.messages}, () => {
						// if div is already scrolled to bottom, scroll down again just incase a new message has arrived
						$('.messages').scrollTop($('.messages').height());
					});
				}
				
				return;
			});
		};
		
		getMessagesFromSlack();
		
		// Set the function to be called at regular intervals
		// get the history of channel at regular intevals
		this.activeChannelInterval = setInterval(getMessagesFromSlack, this.refreshTime);
	}
	
	formatMessage(message, i) {
		let messageText = message.text,
			thisUser = this.getUser(message.user) || {name: '', image: ''},
			sameUser = (i>1 && this.state.messages[i-1].user === message.user) ? true : false;

		if (this.messageFormatter.emoji && this.hasEmoji(messageText)) {
			messageText = emojiParser(messageText);
		}
		
		if (this.isSystemMessage(message)) {
			messageText = messageText.replace('<','').replace('>','').substring(messageText.indexOf('|'), messageText.length);
		}
		
		const timestamp = message.ts.substring(0, message.ts.indexOf('.'));
		
		return <li key={i} className="message clearfix">
			<div className="user-image">
				{(!sameUser) ? <img src={thisUser.image} alt={thisUser.name} width="35" height="35" /> : ''}
			</div>
			<div className="content">
				{(!sameUser) ? <span className="user-name">{thisUser.name}</span> : ''}
				{(!sameUser) ? <span className="timestamp">{moment.unix(timestamp).format('D MMM HH:MM')}</span> : ''}
				<div className="text" dangerouslySetInnerHTML={{__html: messageText}}></div>
			</div>
		</li>;
	}
	
	postMessage(text) {
		if (text !== '' && this.props.user.email !== DEMO_EMAIL) {
			return chat.postMessage({
				token: this.state.currentGroup.apiToken,
				channel: this.state.currentChannel.id,
				text,
				username: this.props.user.email
			}, (err, data) => {
				if (err) {
					this.debugLog('failed to post', data, 'err:', err);
					return;
				}
				
				this.debugLog('Successfully posted message', text, 'response:', data);
				this.setState({ postMyMessage: '', sendingLoader: false }, () => {
//					// Adjust scroll height
//					setTimeout(() => {
//						const chatMessages = this.refs.reactSlakChatMessages;
//						chatMessages.scrollTop = chatMessages.scrollHeight;
//					}, this.refreshTime);
				});
				
				return this.forceUpdate();
			});
		}
	}
	
	arraysIdentical(a, b) {
		return JSON.stringify(a) === JSON.stringify(b);
	}

	isSystemMessage(message) {
		const systemMessageRegex = /<@.[^|]*[|].*>/;
		return systemMessageRegex.test(message.text) && message.text.indexOf(message.user) > -1;
	}

	hasEmoji(text) {
		const chatHasEmoji = /(:[:a-zA-Z\/_]*:)/;
		return chatHasEmoji.test(text);
	}
	
	debugLog(...args) {
		if (process.env.NODE_ENV !== 'production') {
			return console.log('[Chat]', ...args);
		}
	}
	
	handleChange(e) {
 		this.setState({ postMyMessage: e.target.value });
    	return;
	}
	
	render() {
		const demoUser = (this.props.user && this.props.user.email === DEMO_EMAIL) ? DEMO_CHAT_WARNING : '';
		return (
            <section className={`chat-panel ${this.props.class}`}>
				<ul className="groups">
					{slackGroups.map((group, i) => <li key={i} ref={group.id} className={classNames('group', {active: (i === 0)})} onClick={() => this.changeCurrentGroup(group.id)}>{group.slug}</li>)}
				</ul>
				<div className="sidebar">
					<h3 className="sidebar-heading">Channels ({this.state.channels.length})</h3>
					<ul className="channels">
						{this.state.channels.map((channel, i) => <li key={channel.id} ref={channel.id} className={classNames('channel', {active: (channel.name === 'general')})} onClick={() => this.changeCurrentChannel(channel.id)}># {channel.name}</li>)}
					</ul>
					<h3 className="sidebar-heading">Direct messages ({this.state.users.length})</h3>
					<ul className="users">
						{this.state.users.map((user, i) => <li key={user.id} ref={user.id} className={`user ${user.presence}`}>• {user.real_name}</li>)}
					</ul>
				</div>
				
				<div className="messages-wrapper">
					<h2 className="channel-title"><span className="group-title">{this.state.currentGroup.name}</span>#{this.state.currentChannel.name}</h2>
					{(!this.props.location.query.code) ? <a href="https://slack.com/oauth/authorize?scope=client&client_id=109410725603.109487796098&state=hypatia-slack"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a> : ''}

					<ul className="messages">
						{this.state.messages.map((message, i) => this.formatMessage(message, i))}
					</ul>
					<input type="text" className="new-message" placeholder={`Message #${this.state.currentChannel.name} ${demoUser}`} value={this.state.postMyMessage} onKeyPress={(e) => e.key === 'Enter' ? this.postMessage(this.state.postMyMessage) : null} onChange={ (e) => this.handleChange(e) } />
				</div>
            </section>
		)
	}
}

Chat.propTypes = propTypes;
Chat.defaultProps = defaultProps;

const mapDispatchToProps = {
	setLoading
}

const mapStateToProps = ({ mainReducer: { isDesktop, user } }) => ({ isDesktop, user });

export default connect(mapStateToProps, mapDispatchToProps)(Chat);