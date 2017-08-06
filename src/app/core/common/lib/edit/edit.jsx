import React from 'react';
import { Link } from 'react-router';
import Icon from '../icon/icon';
import EditIcon from '../../../../../../static/svg/edit.svg';
import NewIcon from '../../../../../../static/svg/new.svg';

const linksStyle = {
  display: 'block',
  margin: '10px 0'
};

const iconStyle = {
  marginRight: '5px'
};

export default function Edit({ editLink, newLink }) {
  return (
    <div style={linksStyle}>
      <Icon glyph={EditIcon} style={iconStyle} />
      <Link to={editLink}>Edit</Link>
      <Icon glyph={NewIcon} style={iconStyle} />
      <Link to={newLink}>New</Link>
    </div>
  );
}
