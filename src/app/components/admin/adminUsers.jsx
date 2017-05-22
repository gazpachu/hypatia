import React, { Component } from 'react';

const defaultProps = {};

const propTypes = {};

class AdminUsers extends Component {

  constructor(props) {
    super(props);

    this.state = {
      info: this.props.user
        ? this.props.user.info
        : {}
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    event.persist();
    const newInfo = Object.assign({}, this.state.info, {
      [event.target.name]: event.target.value
    });
    this.setState({
      info: newInfo
    }, () => {
      this.props.updateItem(newInfo, 'info');
    });
  }

  render() {
    return (
      <div>
        <input type="text" className="input-field" placeholder="First names" name="firstName" value={this.state.info.firstName} onChange={this.handleChange} />
        <input type="text" className="input-field" placeholder="Last name" name="lastName1" value={this.state.info.lastName1} onChange={this.handleChange} />
        <input type="text" className="input-field" placeholder="2nd last name (optional)" name="lastName2" value={this.state.info.lastName2} onChange={this.handleChange} />
        <input type="text" className="input-field" placeholder="Email" name="email" value={this.state.info.email} onChange={this.handleChange} />
        <input type="text" className="input-field" placeholder="Address" name="address" value={this.state.info.address} onChange={this.handleChange} />
        <input type="text" className="input-field" placeholder="Address continuation" name="address2" value={this.state.info.address2} onChange={this.handleChange} />
        <input type="text" className="input-field" placeholder="Post code" name="postcode" value={this.state.info.postcode} onChange={this.handleChange} />
        <input type="text" className="input-field" placeholder="City" name="city" value={this.state.info.city} onChange={this.handleChange} />
        <input type="text" className="input-field" placeholder="State/Province" name="province" value={this.state.info.province} onChange={this.handleChange} />
        <input type="text" className="input-field" placeholder="country" name="country" value={this.state.info.country} onChange={this.handleChange} />
        <input type="text" className="input-field" placeholder="Language" name="language" value={this.state.info.language} onChange={this.handleChange} />
      </div>
    );
  }
}

AdminUsers.propTypes = propTypes;
AdminUsers.defaultProps = defaultProps;

export default AdminUsers;
