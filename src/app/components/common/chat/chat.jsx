import React, { Component } from 'react';
import { setLoading } from '../../../actions/actions';
import { DEMO_EMAIL, DEMO_CHAT_WARNING } from '../../../constants/constants';
import { firebase, helpers } from 'redux-react-firebase';
import classNames from 'classnames';
import { history } from '../../../store';
import { connect } from 'react-redux';
import { rtm, channels, chat } from 'slack';
import { load as emojiLoader, parse as emojiParser } from 'gh-emoji';
import $ from 'jquery';
import moment from 'moment';
import User from './user';

const { isLoaded, isEmpty, dataToJS } = helpers;

@connect(
	(state) => ({
		subjects: dataToJS(state.firebase, 'subjects'),
		userID: state.mainReducer.user ? state.mainReducer.user.uid : '',
		userData: dataToJS(state.firebase, `users/${state.mainReducer.user ? state.mainReducer.user.uid : ''}`)
	})
)
@firebase(
	props => ([
		'subjects',
		`users/${props.userID}`
	])
)
class Chat extends Component {

	constructor(props) {
		super(props);

		this.state = {
			failed: false,
			users: [],
			channelList: [],
			currentChannel: {},
			currentGroup: {},
			messages: [],
			postMyMessage: '',
			signedIn: false
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
	}

	componentWillReceiveProps(newProps) {
		if (!isEmpty(newProps.userData) && !isEmpty(newProps.subjects)) {
			if (newProps.userData.courses && newProps.userData.courses[Object.keys(newProps.userData.courses)[0]] && isEmpty(this.state.currentGroup)) {
				const firstCourse = newProps.userData.courses[Object.keys(newProps.userData.courses)[0]];
				let firstSubject = null;
				Object.keys(firstCourse).map((subject, i) => {
					if (i === 0) firstSubject = subject;
					return false;
				});
				this.setState({ currentGroup: newProps.subjects[firstSubject] }, () => {
					// Check in the callback for an authorization from the user and then request a token
					if (this.props.location.query.code && this.props.location.query.state === 'hypatia-slack') {
						$.ajax({
							crossOrigin: true,
							url: 'https://slack.com/api/oauth.access',
							data: {
								client_id: this.state.currentGroup.slackClientId,
								client_secret: this.state.currentGroup.slackClientSecret,
								code: this.props.location.query.code
							},
							success: (data) => {
								history.push('/');
								sessionStorage.setItem(`access_token_${this.state.currentGroup.slackClientId}`, data.access_token);
								this.loadGroup();
							}
						});
					} else if (sessionStorage.getItem(`access_token_${this.state.currentGroup.slackClientId}`)) {
						this.loadGroup();
					}
				});
			}
		}

		// if (newProps.class !== this.props.class) {
		// 	if (newProps.class === 'open') {
		// 		this.loadGroup();
		// 	} else {
		// 		this.resetInterval();
		// 	}
		// }
	}

	componentWillUnmount() {
		this.resetInterval();
		if (this.bot) this.bot.close();
	}

	getGroup(id) {
		let subject = null;

		Object.keys(this.props.userData.courses).map((key) => {
			const course = this.props.userData.courses[key];
			return Object.keys(course).map((item) => {
				if (id === item) subject = this.props.subjects[item];
				return false;
			});
		});
		return subject;
	}

	getChannel(id) {
		const newId = id || this.state.currentChannel.id;
		let thisChannel = { name: '' };

		this.state.channelList.map((channel) => {
			if (channel.id === newId) thisChannel = channel;
			return false;
		});
		return thisChannel;
	}

	getUser(id) {
		let thisUser = null;
		this.state.users.map((user) => {
			if (user.id === id) thisUser = user;
			return false;
		});
		return thisUser;
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
			this.setState({ signedIn: true, self, users: data.users, channelList: data.channels, currentChannel: data.currentChannel }, () => {
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

					const self = payload.self;
					const users = [];
					payload.users.map((user) => {
						if (!user.is_bot) {
							return users.push(new User(user));
						}
						return false;
					});

					const channels = [];
					let currentChannel = null;
					payload.channels.map((channel) => {
						if (channel.name === 'general') currentChannel = channel;
						channels.push(channel);
						return false;
					});

					return resolve({ self, channels, users, currentChannel });
				});

				this.bot.im_created((payload) => {
					console.log(payload);
				});

				this.bot.user_typing((msg) => {
					console.log('several people are coding', msg);
				});

				// tell the bot to listen
				this.bot.listen({ token: sessionStorage.getItem(`access_token_${this.state.currentGroup.slackClientId}`) || this.state.currentGroup.apiToken });
			} catch (err) {
				return reject(err);
			}
			return false;
		});
	}

	changeCurrentGroup(groupId) {
		$('.group').removeClass('active');
		$(this.refs[groupId]).addClass('active');
		this.setState({ currentGroup: this.getGroup(groupId) }, () => {
			this.loadGroup(groupId);
		});
	}

	changeCurrentChannel(channelId) {
		$('.channel').removeClass('active');
		$(this.refs[channelId]).addClass('active');
		this.setState({ currentChannel: this.getChannel(channelId) });
		this.loadMessages(channelId);
	}

	resetInterval() {
		if (this.activeChannelInterval) {
			clearInterval(this.activeChannelInterval);
			this.activeChannelInterval = null;
		}
	}

	loadMessages(channelId) {
		this.resetInterval();

		// define loadMessages function
		const getMessagesFromSlack = () => {
			// const messagesLength = that.state.messages.length;
			channels.history({
				token: sessionStorage.getItem(`access_token_${this.state.currentGroup.slackClientId}`) || this.state.currentGroup.apiToken,
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
					return this.setState({ messages: data.messages }, () => {
						// if div is already scrolled to bottom, scroll down again just incase a new message has arrived
						$('.messages').scrollTop($('.messages').height());
					});
				}

				return false;
			});
		};

		getMessagesFromSlack();

		// Set the function to be called at regular intervals
		// get the history of channel at regular intevals
		this.activeChannelInterval = setInterval(getMessagesFromSlack, this.refreshTime);
	}

	formatMessage(message, i) {
		let messageText = message.text;
		const thisUser = this.getUser(message.user) || { real_name: message.username, image: '' };
		const sameUser = (i > 1 && ((!message.username && this.state.messages[i - 1].user === message.user) ||
			(message.username && (this.state.messages[i - 1].username === message.username))));

		if (this.messageFormatter.emoji && this.hasEmoji(messageText)) {
			messageText = emojiParser(messageText);
		}

		if (this.isSystemMessage(message)) {
			messageText = messageText.replace('<', '').replace('>', '').substring(messageText.indexOf('|'), messageText.length);
		}

		const timestamp = message.ts.substring(0, message.ts.indexOf('.'));

		return (<li key={i} className="message clearfix">
			<div className="user-image">
				{(!sameUser) ? <img src={thisUser.image} alt={thisUser.real_name} width="35" height="35" /> : ''}
			</div>
			<div className="content">
				{(!sameUser) ? <span className="user-name">{thisUser.real_name}</span> : ''}
				{(!sameUser) ? <span className="timestamp">{moment.unix(timestamp).format('D MMM HH:MM')}</span> : ''}
				<div className="text" dangerouslySetInnerHTML={{ __html: messageText }}></div>
			</div>
		</li>);
	}

	postMessage(text) {
		if (text !== '' && this.state.signedIn) {
			return chat.postMessage({
				token: sessionStorage.getItem(`access_token_${this.state.currentGroup.slackClientId}`) || this.state.currentGroup.apiToken,
				channel: this.state.currentChannel.id,
				text,
				username: this.props.user.displayName,
				as_user: true
			}, (err, data) => {
				if (err) {
					this.debugLog('failed to post', data, 'err:', err);
					return;
				}

				this.debugLog('Successfully posted message', text, 'response:', data);
				this.setState({ postMyMessage: '', sendingLoader: false }, () => {
					// Adjust scroll height
					setTimeout(() => {
						const chatMessages = this.refs.reactSlakChatMessages;
						chatMessages.scrollTop = chatMessages.scrollHeight;
					}, this.refreshTime);
				});

				this.forceUpdate();
			});
		}
		return false;
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
		return false;
	}

	handleChange(e) {
		this.setState({ postMyMessage: e.target.value });
		return;
	}

	render() {
		const demoUser = (this.props.user && this.props.user.email === DEMO_EMAIL) ? DEMO_CHAT_WARNING : '';
		let slackGroups = null;
		const connected = sessionStorage.getItem(`access_token_${this.state.currentGroup.slackClientId}`);

		if (isLoaded(this.props.subjects) && isLoaded(this.props.userData) &&
		!isEmpty(this.props.subjects) && !isEmpty(this.props.userData)) {
			if (this.props.userData.courses) {
				slackGroups = Object.keys(this.props.userData.courses).map((key) => {
					const course = this.props.userData.courses[key];
					return Object.keys(course).map((item, i) => {
						const subject = this.props.subjects[item];
						return <li key={item} ref={item} className={classNames('group', { active: (i === 0) })} onClick={() => this.changeCurrentGroup(item)}>{subject.code}</li>;
					});
				});
			}
		}

		return (
			<section className={`chat-panel ${this.props.class}`}>
				<ul className="groups">
					{slackGroups}
				</ul>
				<div className="sidebar">
					<h3 className="sidebar-heading">Channels ({this.state.channelList.length})</h3>
					<ul className="channels">
						{this.state.channelList.map((channel) => <li key={channel.id} ref={channel.id} className={classNames('channel', { active: (channel.name === 'general') })} onClick={() => this.changeCurrentChannel(channel.id)}># {channel.name}</li>)}
					</ul>
					<h3 className="sidebar-heading">Users ({this.state.users.length})</h3>
					<ul className="users">
						{this.state.users.map((user) => <li key={user.id} ref={user.id} className={`user ${user.presence}`}>• {user.real_name}</li>)}
					</ul>
				</div>

				<div className="messages-wrapper">
					<h2 className="channel-title"><span className="group-title">{this.state.currentGroup.name}</span>#{this.state.currentChannel.name}</h2>
					{connected ?
						<ul className="messages">
							{this.state.messages.map((message, i) => this.formatMessage(message, i))}
						</ul> : null}
					{connected ? <input
						type="text"
						className="new-message"
						placeholder={`Message #${this.state.currentChannel.name} ${demoUser}`}
						value={this.state.postMyMessage}
						onKeyPress={(e) => { if (e.key === 'Enter') this.postMessage(this.state.postMyMessage); }}
						onChange={(e) => this.handleChange(e)}
					/>
					: <div className="slack-info-wrapper">
						<a className="slack-button" href={`https://slack.com/oauth/authorize?scope=client&client_id=${this.state.currentGroup.slackClientId}&state=hypatia-slack`}>
							<img
								alt="Connect with Slack"
								height="40"
								width="139"
								src="https://platform.slack-edge.com/img/add_to_slack.png"
								srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
							/>
						</a>
						<p className="slack-info">To access this chat group, you teacher has to invite you and you need to login with Slack</p>
					</div>}
				</div>
			</section>
		);
	}
}

const mapDispatchToProps = {
	setLoading
};

const mapStateToProps = ({ mainReducer: { isDesktop, user, userData } }) => ({ isDesktop, user, userData });

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
