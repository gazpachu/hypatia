import React, { Component, PropTypes } from 'react';
import { setLoading } from '../../../actions/actions';
import classNames from 'classnames';
import {connect} from 'react-redux';
import { rtm, channels, chat } from 'slack';
import { load as emojiLoader, parse as emojiParser } from 'gh-emoji';
import $ from 'jquery';
import moment from 'moment';
import User from './user';
import Icon from '../lib/icon/icon'; 

const defaultProps = {
	apiToken: 'xoxb-109360821427-CsCZVGK9c6BBFlIlIw3plGXq'
};

const propTypes = {
	isDesktop: PropTypes.bool,
	apiToken: PropTypes.string.isRequired
};

class Chat extends Component {
    
	constructor(props) {
		super(props);
		
		// Create Slack Bot
    	this.bot = rtm.client();
		
		this.state = {
			failed: false,
			onlineUsers: [],
			channels: [],
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
		this.refreshTime = 2000;
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
			this.setState({ onlineUsers: data.onlineUsers, channels: data.channels });
		})
		.catch((err) => {
			this.debugLog('could not intialize slack bot', err);
			this.setState({ failed: true });
		});
	}
	
	componentDidMount() {
		
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

					// Create new User object for each online user found
					// Add to our list only if the user is valid
					const onlineUsers = [];

					// extract and resolve return the users
					payload.users.map((user) => !user.is_bot ? onlineUsers.push(new User(user)) : null);

					const channels = [];
					payload.channels.map((channel) => {
						channels.push(channel);
					});
					return resolve({ channels, onlineUsers });
				});

				// tell the bot to listen
				this.bot.listen({ token: this.props.apiToken });
			}
			catch (err) {
				return reject(err);
		  	}
		});
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
						{this.state.onlineUsers.map((user, i) => <li key={i} className="user">• {user.name}</li>)}
					</ul>
				</div>
				
				<div className="messages-wrapper">
					<h2 className="channel-title">MATHS #general</h2>
					<div className="messages"></div>
					<input type="text" className="message" />
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