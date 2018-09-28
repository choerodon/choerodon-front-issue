import React, { Component } from 'react';
import { Icon } from 'choerodon-ui';

import './TypeIcon.scss';

const TYPE_MAP = {
  story: {
    icon: 'turned_in',
    bgColor: '#00bfa5',
    name: '故事',
  },
  bug: {
    icon: 'bug_report',
    bgColor: '#f44336',
    name: '故障',
  },
  task: {
    icon: 'assignment',
    bgColor: '#4d90fe',
    name: '工作',
  },
  epic: {
    icon: 'priority',
    bgColor: '#743be7',
    name: '史诗',
  },
  sub_task: {
    icon: 'relation',
    bgColor: '#4d90fe',
    name: '子任务',
  },
  issue_test: {
    icon: 'test',
    bgColor: '#ff7043',
    name: '测试',
  },
};

class TypeIcon extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(nextProps, nextState) {
    if (nextProps.typeCode === this.props.typeCode 
        || (nextProps.icon === this.props.icon 
            && nextProps.name === this.props.name 
            && nextProps.bgColor === this.props.bgColor
        )
    ) {
      return false;
    }
    return true;
  }

  render() {
    const {
      typeCode, icon, name, showName, bgColor, style,
    } = this.props;
    const currentType = TYPE_MAP[typeCode];
    return (
            <div 
                className="typeIcon"
                style={style}
            >
                   {
                       currentType ? (
                            <React.Fragment>
                                <div className="typeIcon-icon">
                                    <Icon 
                                        style={{ background: `${currentType.bgColor}` }}
                                        type={currentType.icon} 
                                    />
                                </div>
                                {
                                    showName ? (
                                        <div className="typeIcon-name">
                                            {currentType.name}
                                        </div>
                                    ) : '' 
                                }
                            </React.Fragment>
                       ) : (
                        <React.Fragment>
                            <div className="typeIcon-icon">
                                <Icon 
                                    style={{ background: `${bgColor}` }}
                                    type={icon} 
                                />
                            </div>
                            {
                                showName ? (
                                    <div className="typeIcon-name">
                                        {name}
                                    </div>
                                ) : '' 
                            }
                        </React.Fragment>
                       )
                   }
            
            </div>
    );
  }
}

export default TypeIcon;
