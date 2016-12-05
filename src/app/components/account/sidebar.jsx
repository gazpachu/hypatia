import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

export default function Sidebar(props) {
	return <ul className="sidebar">
				<li className={classNames('sidebar-item', {active: (props.active === 'account')})}><Link to="/account">Account</Link></li>
				<li className={classNames('sidebar-item', {active: (props.active === 'settings')})}><Link to="/account/settings">Settings</Link></li>
				<li className={classNames('sidebar-item', {active: (props.active === 'notifications')})}><Link to="/account/notifications">Notifications</Link></li>
				<li className={classNames('sidebar-item', {active: (props.active === 'record')})}><Link to="/account/record">Record</Link></li>
				<li className={classNames('sidebar-item', {active: (props.active === 'proceedings')})}><Link to="/#">Proceedings</Link></li>
				<li className={classNames('sidebar-item', {active: (props.active === 'exams')})}><Link to="/#">Exams</Link></li>
				<li className={classNames('sidebar-item', {active: (props.active === 'enrollment')})}><Link to="/#">Enrollment</Link></li>
			</ul>
}