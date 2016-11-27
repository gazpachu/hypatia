import React, { Component, PropTypes } from 'react';
import { setLoading } from '../../../actions/actions';
import classNames from 'classnames';
import {connect} from 'react-redux';
import { rtm, channels, chat } from 'slack';
import { load as emojiLoader, parse as emojiParser } from 'gh-emoji';
import { slackConfig } from '../../../constants/slack';
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
		
		// Create Slack Bot
    	this.bot = rtm.client();
		
		this.state = {
			failed: false,
			users: [],
			channels: [],
			defaultChannelId: null,
			messages: [],
			postMyMessage: '',
			postMyFile: '',
			chatbox: {
				active: false,
				channelActiveView: false,
				chatActiveView: false
			}
		};
		
		// Set class variables
		this.refreshTime = 5000;
		this.activeChannel = [];
		this.activeChannelInterval = null;
		this.messageFormatter = {
		  	emoji: false // default
		};
		
		// Initiate Emoji Library
		emojiLoader().then(() => { this.messageFormatter = { emoji: true }; })
			.catch((err) => this.debugLog(`Cant initiate emoji library ${err}`));
		
		// Connect bot
		this.connectBot(this).then((data) => {
			this.debugLog('got data', data);
			this.setState({ users: data.users, channels: data.channels, defaultChannelId: data.defaultChannelId });
			this.loadMessages();
		})
		.catch((err) => {
			this.debugLog('could not intialize slack bot', err);
			this.setState({ failed: true });
		});
		
		this.loadMessages = this.loadMessages.bind(this);
		this.formatMessage = this.formatMessage.bind(this);
	}
	
	componentDidMount() {
		
	}
	
	componentWillUnmount() {
		if (this.activeChannelInterval) {
			clearInterval(this.activeChannelInterval);
			this.activeChannelInterval = null;
		}
	}
	
	arraysIdentical(a, b) {
		return JSON.stringify(a) === JSON.stringify(b);
	}

	isSystemMessage(message) {
		const systemMessageRegex = /<@.[^|]*[|].*>/;
		return systemMessageRegex.test(message.text) &&
		  message.text.indexOf(message.user) > -1;
	}

	hasEmoji(text) {
		const chatHasEmoji = /(:[:a-zA-Z\/_]*:)/;
		return chatHasEmoji.test(text);
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
					let defaultChannelId = null;
					payload.channels.map((channel) => {
						if (channel.name === 'general') defaultChannelId = channel.id;
						channels.push(channel);
					});
					
					return resolve({ channels, users, defaultChannelId });
				});

				// tell the bot to listen
				this.bot.listen({ token: slackConfig.apiToken });
				
				this.bot.user_typing(function(msg) {
				  	console.log('several people are coding', msg)
				});
			}
			catch (err) {
				return reject(err);
		  	}
		});
	}
	
	loadMessages(channelId) {
		const that = this;
		
		// define loadMessages function
		const getMessagesFromSlack = () => {
			const messagesLength = that.state.messages.length;
			channels.history({
				token: slackConfig.apiToken,
				channel: channelId || this.state.defaultChannelId
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
		let thisUser = {name: '', image: ''},
			sameUser = (i>1 && this.state.messages[i-1].user === message.user) ? true : false;

		this.state.users.map((user) => {
			if (user.id === message.user) thisUser = user;
		});
		
		return <li key={i} className="message clearfix">
			<div className="user-image">
				{(!sameUser) ? <img src={thisUser.image} alt={thisUser.name} width="35" height="35" /> : ''}
			</div>
			<div className="content">
				{(!sameUser) ? <span className="user-name">{thisUser.name}</span> : ''}
				{(!sameUser) ? <span className="timestamp">{moment(message.ts).format('D/M/YYYY')}</span> : ''}
				<div className="text">{message.text}</div>
			</div>
		</li>;
	}
	
	debugLog(...args) {
		if (process.env.NODE_ENV !== 'production') {
			return console.log('[Chat]', ...args);
		}
	}
	
	render() {
		return (
            <section className={`chat-panel ${this.props.class}`}>
				<ul className="groups">
					<li className="group active">MA</li>
					<li className="group">EL</li>
					<li className="group">NT</li>
					<li className="group">QP</li>
				</ul>
				<div className="sidebar">
					<h3 className="sidebar-heading">Channels</h3>
					<ul className="channels">
						{this.state.channels.map((channel, i) => <li key={i} className={classNames('channel', {active: (channel.name === 'general')})}># {channel.name}</li>)}
					</ul>
					<h3 className="sidebar-heading">Direct messages</h3>
					<ul className="users">
						{this.state.users.map((user, i) => <li key={i} id={user.id} className={`user ${user.presence}`}>• {user.name}</li>)}
					</ul>
				</div>
				
				<div className="messages-wrapper">
					<h2 className="channel-title">MATHS #general</h2>
					<ul className="messages">
						{this.state.messages.map((message, i) => this.formatMessage(message, i))}
					</ul>
					<input type="text" className="new-message" />
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

const mapStateToProps = ({ mainReducer: { isDesktop } }) => ({ isDesktop });

export default connect(mapStateToProps, mapDispatchToProps)(Chat);