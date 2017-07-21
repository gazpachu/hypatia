import React, { Component } from 'react';
import Helpers from '../helpers';
import Icon from '../lib/icon/icon';
import Logo from '../../../../../static/svg/logo.svg';

class Footer extends Component {

  componentDidMount() {
    Helpers.getAppVersion('.app-version');
  }

  render() {
    return (
      <section className="footer">
        <span>Nekomy Platform <span className="app-version" />
          <Icon glyph={Logo} />
          2016 - 2017. Licensed under GPLv2. More info at <a href="http://nekomy.github.io/nekomy-platform/">nekomy.github.io/nekomy-platform</a>
        </span>
      </section>
    );
  }
}

export default Footer;
