import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import {
  Table, Button, Modal, Form, message, Tooltip, Icon, Input,
} from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import {
  Content, Header, Page, Permission, stores,
} from 'choerodon-front-boot';
import '../../../main.scss';
import './FieldConfigurationList.scss';
// import CustomFieldsCreate from '../customFieldsCreate';

const { AppState } = stores;
const FormItem = Form.Item;
const Sidebar = Modal.Sidebar;
const TextArea = Input.TextArea;

const prefixCls = 'issue-fieldConfiguration';
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
class FieldConfigurationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      visible: false,
      field: false,
      page: 0,
      pageSize: 10,
    };
  }

  componentDidMount() {
    this.loadFieldConfiguration();
  }

  getColumn = () => ([{
    title: <FormattedMessage id="fieldConfiguration.name" />,
    dataIndex: 'name',
    key: 'name',
    filters: [],
  }, {
    title: <FormattedMessage id="fieldConfiguration.des" />,
    dataIndex: 'description',
    key: 'description',
    filters: [],
    className: 'issue-table-ellipsis',
  }, {
    title: <FormattedMessage id="fieldConfiguration.scheme" />,
    dataIndex: 'fieldConfigSchemeDTOS',
    key: 'fieldConfigSchemeDTOS',
    render: (text, record) => {
      const map = [];
      if (text && text.length) {
        map.push(text.map(data => (
          <li key={data.id}>
            <a onClick={() => this.handleSchemeClick(data.id)} role="none">{data.name}</a>
          </li>
        )));
      } else {
        return <div>-</div>;
      }
      return <ul className={`${prefixCls}-related`}>{map}</ul>;
    },
  }, {
    align: 'right',
    key: 'action',
    render: (test, record) => (
      <div>
        <Tooltip
          placement="bottom"
          title={<FormattedMessage id="edit" />}
        >
          <Button size="small" shape="circle" onClick={this.showEdit.bind(this, record.id)}>
            <i className="icon icon-mode_edit" />
          </Button>
        </Tooltip>
        {record.canDelete ?
          <Tooltip
            placement="bottom"
            title={<FormattedMessage id="delete" />}
          >
            <Button size="small" shape="circle" onClick={this.openRemove.bind(this, record)}>
              <i className="icon icon-delete" />
            </Button>
          </Tooltip> : <div className="issue-del-space" />
        }
      </div>
    ),
  }]);

  getCreateForm = () => {
    const { form, intl } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className="issue-region">
        <Form layout="vertical" className="issue-sidebar-form">
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('name', {
              rules: [{
                required: true,
                whitespace: true,
                max: 47,
                message: intl.formatMessage({ id: 'required' }),
              }],
            })(
              <Input
                style={{ width: 520 }}
                autoFocus
                label={<FormattedMessage id="fieldConfiguration.name" />}
                size="default"
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            className="issue-sidebar-form"
          >
            {getFieldDecorator('description')(
              <TextArea
                style={{ width: 520 }}
                label={<FormattedMessage id="fieldConfiguration.des" />}
              />,
            )}
          </FormItem>
        </Form>
      </div>);
  }

  loadFieldConfiguration = () => {
    const { FieldConfigurationStore } = this.props;
    const {
      sorter, tableParam, page, pageSize,
    } = this.state;
    const orgId = AppState.currentMenuType.organizationId;
    FieldConfigurationStore.loadFieldConfiguration(orgId, sorter, { page, pageSize, ...tableParam })
      .then(data => this.setState({ total: data.totalElements }));
  };

  refresh = () => {
    this.loadFieldConfiguration();
  };

  showCreate = () => {
    const { FieldConfigurationStore } = this.props;
    this.setState({
      show: true,
    });
  };

  handleSchemeClick = (schemeId) => {
    const { StateMachineStore, intl, history } = this.props;
    const { name, id, organizationId } = AppState.currentMenuType;
    history.push(`/issue/field-configuration-schemes/edit/${schemeId}?type=organization&id=${id}&name=${encodeURIComponent(name)}&organizationId=${organizationId}`);
  }

  showEdit = (fieldConfigId) => {
    const { StateMachineStore, intl, history } = this.props;
    const { name, id, organizationId } = AppState.currentMenuType;
    history.push(`/issue/field-configurations/edit/${fieldConfigId}?type=organization&id=${id}&name=${encodeURIComponent(name)}&organizationId=${organizationId}`);
  };

  hideSidebar = () => {
    const { FieldConfigurationStore } = this.props;
    this.setState({ id: false, show: false });
    this.loadFieldConfiguration();
  };

  openRemove = (record) => {
    const { FieldConfigurationStore } = this.props;
    const orgId = AppState.currentMenuType.organizationId;
    this.setState({ visible: true, field: record, id: record.id });
  };

  closeRemove = () => {
    this.setState({
      visible: false, id: false, field: false,
    });
  };

  handleSubmit = () => {
    const { FieldConfigurationStore, form } = this.props;
    const {
      id, type, copyFrom, editState, page, pageSize, sorter, tableParam,
    } = this.state;
    const orgId = AppState.currentMenuType.organizationId;

    form.validateFieldsAndScroll((err, data) => {
      if (!err) {
        const postData = data;
        postData.organizationId = orgId;
        this.setState({
          submitting: true,
        });
        FieldConfigurationStore.createFieldConfiguration(orgId, postData)
          .then((res) => {
            this.setState({
              submitting: false,
            });
            if (res) {
              this.showEdit(res.id);
            }
          }).catch((error) => {
            Choerodon.prompt(error.response.data.message);
            this.setState({
              submitting: false,
            });
          });
      }
    });
  }

  handleDelete = () => {
    const { FieldConfigurationStore, intl } = this.props;
    const { id } = this.state;
    const orgId = AppState.currentMenuType.organizationId;
    FieldConfigurationStore.deleteFieldConfiguration(orgId, id)
      .then((data) => {
        if (data) {
          message.success(intl.formatMessage({ id: 'deleteSuccess' }));
        } else {
          message.error(intl.formatMessage({ id: 'deleteFailed' }));
        }
        this.closeRemove();
        this.loadFieldConfiguration();
      }).catch((error) => {
        message.error(intl.formatMessage({ id: 'deleteFailed' }));
        this.closeRemove();
      });
  };

  handleTableChange = (pagination, filters, sorter, param) => {
    const sort = {};
    if (sorter.column) {
      const { field, order } = sorter;
      sort[field] = order;
    }
    let searchParam = {};
    if (Object.keys(filters).length) {
      searchParam = filters;
    }
    const postData = {
      ...searchParam,
      param: param.toString(),
    };
    this.setState({
      sorter: sorter.column ? sorter : undefined,
      tableParam: postData,
      page: pagination.current,
      pageSize: pagination.pageSize,
    }, () => this.loadFieldConfiguration());
  };

  render() {
    const { FieldConfigurationStore, intl } = this.props;
    const {
      id, submitting, visible, field, page, pageSize, total,
    } = this.state;

    const pageInfo = {
      defaultCurrent: page,
      defaultPageSize: pageSize,
      total,
    };

    return (
      <Page className="issue-region">
        <Header title={<FormattedMessage id="fieldConfiguration.title" />}>
          <Button onClick={() => this.showCreate('create')}>
            <i className="icon-add icon" />
            <FormattedMessage id="fieldConfiguration.create" />
          </Button>
          <Button onClick={this.refresh}>
            <i className="icon-refresh icon" />
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content>
          <div className={`${prefixCls}-tip`}>
            <div><FormattedMessage id="fieldConfiguration.tip1" /></div>
            <div><FormattedMessage id="fieldConfiguration.tip2" /></div>
          </div>
          <Table
            dataSource={FieldConfigurationStore.getFieldConfigurations}
            columns={this.getColumn()}
            loading={FieldConfigurationStore.getIsLoading}
            rowKey={record => record.id}
            pagination={pageInfo}
            onChange={this.handleTableChange}
            filterBarPlaceholder={intl.formatMessage({ id: 'filter' })}
            className="issue-table"
          />
        </Content>
        {this.state.show && <Sidebar
          title={<FormattedMessage id="fieldConfiguration.create" />}
          visible={this.state.show}
          onOk={this.handleSubmit}
          okText={<FormattedMessage id={this.state.type === 'create' ? 'create' : 'save'} />}
          cancelText={<FormattedMessage id="cancel" />}
          confirmLoading={this.state.submitting}
          onCancel={this.hideSidebar}
        >
          {this.getCreateForm()}
        </Sidebar>}
        <Modal
          visible={visible}
          title={<FormattedMessage id="fieldConfiguration.action.delete" />}
          closable={false}
          footer={[
            <Button key="back" onClick={this.closeRemove}><FormattedMessage id="cancel" /></Button>,
            <Button key="submit" type="danger" onClick={this.handleDelete} loading={submitting}>
              <FormattedMessage id="delete" />
            </Button>,
          ]}
        >
          <p className={`${prefixCls}-del-content`}>
            <FormattedMessage id="fieldConfiguration.action.delete" />
            <span>:</span>
            <span className={`${prefixCls}-del-content-name`}>{field.name}</span>
          </p>
          <p className={`${prefixCls}-del-tip`}>
            <FormattedMessage id="fieldConfiguration.delete.inUseTip" />
          </p>
        </Modal>
      </Page>
    );
  }
}

export default Form.create({})(withRouter(injectIntl(FieldConfigurationList)));
