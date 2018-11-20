import React, { Component } from 'react';
import './StatusTag.scss';

const STATUS = {
  todo: '#ffb100',
  doing: '#4d90fe',
  done: '#00bfa5',
};

class StatusTag extends Component {
  render() {
    const {
      data,
      style,
    } = this.props;
    return (
      <div
        className="c7n-statusTag"
        style={{
          background: (data && STATUS[data.type]) || 'transparent',
          ...style,
        }}
      >
        { (data && data.name) || '' }
      </div>
    );
  }
}
export default StatusTag;
