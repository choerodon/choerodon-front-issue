import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import {
  Table, Button, Modal, Form, message, Tooltip, Icon, Input, Checkbox,
} from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import {
  Content, Header, Page, Permission, stores,
} from 'choerodon-front-boot';
import _ from 'lodash';
import Tips from '../../../../components/Tips';

import '../../../main.scss';
import './FieldConfigurationEdit.scss';
// import CustomFieldsCreate from '../customFieldsCreate';

const { AppState } = stores;
const FormItem = Form.Item;
const Sidebar = Modal.Sidebar;
const TextArea = Input.TextArea;

const prefixCls = 'cloopm-fieldConfiguration';
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 100 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 26 },
  },
};


@observer
class FieldConfigurationEdit extends Component {
  constructor(props) {
    super(props);
    const { id } = this.props.match.params;
    this.state = {
      id,
      visible: false,
      field: false,
      data: {},
      fieldConfigurationLine: [],
    };
  }

  componentDidMount() {
    this.loadFieldConfiguration();
  }

  getColumn = () => ([{
    title: <FormattedMessage id="fieldConfiguration.eidt.name" />,
    dataIndex: 'fieldName',
    key: 'fieldName',
    filters: [],
  }, {
    title: <FormattedMessage id="fieldConfiguration.edit.des" />,
    dataIndex: 'fieldDescription',
    key: 'fieldDescription',
    filters: [],
    className: 'cloopm-table-ellipsis',
  }, {
    title: <FormattedMessage id="fieldConfiguration.edit.page" />,
    dataIndex: 'pageDTOList',
    key: 'pageDTOList',
    filters: [],
    render: (text, recourd) => {
      const ele = [];
      if (text && text.length) {
        text.map(item => ele.push(<div>{item.name}</div>));
      }
      return <React.Fragment>{ele}</React.Fragment>;
    },
  }, {
    title: <FormattedMessage id="fieldConfiguration.edit.display" />,
    dataIndex: 'isDisplay',
    key: 'isDisplay',
    filters: [
      {
        text: '是',
        value: '1',
      },
      {
        text: '否',
        value: '0',
      },
    ],
    render: (text, record) => <Checkbox defaultChecked={text !== '0'} onChange={value => this.handleCheckChange(value, record.id, 'isDisplay')} />,
  }, {
    title: <FormattedMessage id="fieldConfiguration.edit.required" />,
    dataIndex: 'isRequired',
    key: 'isRequired',
    filters: [
      {
        text: '是',
        value: '1',
      },
      {
        text: '否',
        value: '0',
      },
    ],
    render: (text, record) => <Checkbox defaultChecked={text !== '0'} onChange={value => this.handleCheckChange(value, record.id, 'isRequired')} />,
  }]);

  loadFieldConfiguration = () => {
    const { FieldConfigurationStore } = this.props;
    const { id } = this.state;
    const orgId = AppState.currentMenuType.organizationId;
    FieldConfigurationStore.loadFieldConfigurationById(orgId, id).then((data) => {
      if (data) {
        this.setState({
          data,
          fieldConfigurationLine: data.fieldConfigLineDTOList,
        });
      }
    });
  };

  handleCheckChange = (e, lineId, type) => {
    const { FieldConfigurationStore } = this.props;
    const orgId = AppState.currentMenuType.organizationId;
    const list = FieldConfigurationStore.getFieldConfigurationLine;
    const index = _.findIndex(list, item => item.id === lineId);
    const data = list[index];
    if (e.target.checked) {
      data[type] = '1';
    } else {
      data[type] = '0';
    }
    FieldConfigurationStore.updateLineByConfigId(orgId, data.id, data).then((res) => {
      if (res) {
        list[index] = res;
        FieldConfigurationStore.setFieldConfigurationLine(list);
      } else {
        this.refresh();
      }
    });
  }

  refresh = () => {
    this.loadFieldConfiguration();
  };

  handleTableChange = (pagination, filters, sorter, param) => {
    const { FieldConfigurationStore } = this.props;
    let fieldConfigurationLine = FieldConfigurationStore.getFieldConfigurationLine;
    if (fieldConfigurationLine.length) {
      if (filters) {
        Object.keys(filters).forEach((key) => {
          if (filters[key].length) {
            fieldConfigurationLine = fieldConfigurationLine
              .filter(item => item[key]
                && item[key].indexOf(filters[key][0]) !== -1);
          }
        });
      }
      if (param.length) {
        param.forEach((value) => {
          fieldConfigurationLine = fieldConfigurationLine
            .filter(item => (item.fieldName && item.fieldName.indexOf(value) !== -1)
              || (item.fieldDescription && item.fieldDescription.indexOf(value) !== -1));
        });
      }
    }
    this.setState({
      fieldConfigurationLine,
    });
  };

  render() {
    const { FieldConfigurationStore, intl } = this.props;
    const {
      data, fieldConfigurationLine,
    } = this.state;
    const menu = AppState.currentMenuType;
    const {
      type, id: projectId, organizationId: orgId, name,
    } = menu;

    return (
      <Page className="cloopm-region">
        <Header
          title={<FormattedMessage id="fieldConfiguration.edit.title" />}
          backPath={`/issue/field-configurations?type=${type}&id=${projectId}&name=${encodeURIComponent(name)}&organizationId=${orgId}`}
        >
          <Button onClick={this.refresh}>
            <i className="icon-refresh icon" />
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content>
          <div className={`${prefixCls}-name`}>
            {data.name}
          </div>
          <div className={`${prefixCls}-des`}>
            {data.description}
          </div>
          <div className={`${prefixCls}-tip`}>
            <Tips tips={[intl.formatMessage({ id: 'fieldConfiguration.edit.tip1' })]} />
          </div>
          <Table
            dataSource={fieldConfigurationLine}
            columns={this.getColumn()}
            loading={FieldConfigurationStore.getIsLoading}
            rowKey={record => record.id}
            pagination={false}
            onChange={this.handleTableChange}
            filterBarPlaceholder={intl.formatMessage({ id: 'filter' })}
            className="cloopm-table"
          />
        </Content>
      </Page>
    );
  }
}

export default Form.create({})(withRouter(injectIntl(FieldConfigurationEdit)));
