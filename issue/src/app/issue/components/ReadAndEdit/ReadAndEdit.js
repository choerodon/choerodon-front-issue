import React, { Component } from 'react';
import { Select, Icon } from 'choerodon-ui';
import './ReadAndEdit.scss';

const { Option } = Select;

class ReadAndEdit extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      type: 'read',
      origin: '',
    };
  }

  componentWillMount() {
    this.saveShow();
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleEnter, false);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleEnter, false);
  }

  onBlur() {
    this.setState({ type: 'read' });
  }

  handleEnter = (e) => {
    // if (this.props.handleEnter && e.keyCode === 13) {
    //   e.stopPropagation();
    //   this.setState({ type: 'read' });
    //   this.props.onOk();
    // }
  };

  saveShow() {
    this.setState({
      origin: this.props.origin,
    });
  }

  render() {
    return (
      <div
        role="none"
        className={`rae ${this.props.current !== this.props.thisType ? 'issue-readAndEdit -c7n-readAndEdit' : 'issue-readAndEdit'}`}
        style={{
          ...this.props.style,
          position: 'relative',
          width: this.props.line ? '100%' : 'auto',
        }}
      >
        {
          this.props.current !== this.props.thisType && (
            <div
              role="none"
              onClick={() => {
                this.setState({
                  type: 'edit',
                  origin: this.props.origin,
                });
                if (this.props.onInit) {
                  this.props.onInit();
                }
                if (this.props.callback) {
                  this.props.callback(this.props.thisType);
                }
              }}
            >
              <span
                className="edit"
                style={{
                  display: 'none',
                  lineHeight: '20px',
                  alignItems: 'center',
                }}
              >
                <Icon type="mode_edit" />
              </span>
              {this.props.readModeContent}
            </div>
          )
        }
        {
          (this.props.current === this.props.thisType) && (
            <section>
              {this.props.children}
            </section>
          )
        }
        {
          (this.props.current === this.props.thisType) && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                }}
              >
                <span
                  className="edit-edit"
                  style={{
                    display: 'block-inline',
                    marginRight: '4px',
                    width: 20,
                    height: 20,
                    lineHeight: '16px',
                  }}
                  role="none"
                  onClick={(e) => {
                    e.stopPropagation();
                    this.setState({ type: 'read' });
                    this.props.onOk();
                    this.props.callback(undefined);
                  }
                  }
                >
                  <Icon style={{ fontSize: '14px' }} type="check" />
                </span>
                <span
                  className="close"
                  style={{
                    display: 'block-inline',
                    width: 20,
                    height: 20,
                    lineHeight: '16px',
                  }}
                  role="none"
                  onClick={(e) => {
                    e.stopPropagation();
                    this.props.onCancel(this.state.origin);
                    this.setState({
                      type: 'read',
                      origin: this.props.origin,
                    });
                    this.props.callback(undefined);
                  }
                  }
                >
                  <Icon style={{ fontSize: '14px' }} type="close" />
                </span>
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

export default ReadAndEdit;
