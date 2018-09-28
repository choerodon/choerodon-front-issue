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
import './FieldConfigSchemeList.scss';

const { AppState } = stores;
const FormItem = Form.Item;

const prefixCls = 'issue-fieldConfigScheme';
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
class FieldConfigSchemeList extends Component {
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
    this.loadFieldConfigScheme();
  }

  getColumn = () => ([{
    title: <FormattedMessage id="fieldConfigScheme.name" />,
    dataIndex: 'name',
    key: 'name',
    filters: [],
  }, {
    title: <FormattedMessage id="fieldConfigScheme.project" />,
    dataIndex: 'project',
    key: 'project',
    filters: [],
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

  loadFieldConfigScheme = () => {
    const { FieldConfigSchemeStore } = this.props;
    const orgId = AppState.currentMenuType.organizationId;
    const {
      page, pageSize, sorter, tableParam,
    } = this.state;
    FieldConfigSchemeStore.loadFieldConfigScheme(orgId, sorter, { page, pageSize, ...tableParam }).then((data) => {
      this.setState({
        total: data.totalElements,
      });
    });
  };

  refresh = () => {
    this.loadFieldConfigScheme();
  };

  showCreate = () => {
    const { history } = this.props;
    const { name, id, organizationId } = AppState.currentMenuType;
    history.push(`/issue/field-configuration-schemes/create?type=organization&id=${id}&name=${encodeURIComponent(name)}&organizationId=${organizationId}`);
  };

  showEdit = (fieldConfigId) => {
    const { history } = this.props;
    const { name, id, organizationId } = AppState.currentMenuType;
    history.push(`/issue/field-configuration-schemes/edit/${fieldConfigId}?type=organization&id=${id}&name=${encodeURIComponent(name)}&organizationId=${organizationId}`);
  }

  openRemove = (record) => {
    const { FieldConfigSchemeStore } = this.props;
    const orgId = AppState.currentMenuType.organizationId;
    this.setState({ visible: true, field: record });
  };

  closeRemove = () => {
    this.setState({
      visible: false, field: false,
    });
  };

  handleDelete = () => {
    const { FieldConfigSchemeStore, intl } = this.props;
    const { field } = this.state;
    const orgId = AppState.currentMenuType.organizationId;

    FieldConfigSchemeStore.deleteFieldConfiguration(orgId, field.id)
      .then((data) => {
        if (data) {
          message.success(intl.formatMessage({ id: 'deleteSuccess' }));
        } else {
          message.error(intl.formatMessage({ id: 'deleteFailed' }));
        }
        this.closeRemove();
        this.loadFieldConfigScheme();
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
      page: pagination.current - 1,
      pageSize: pagination.pageSize,
    }, () => this.loadFieldConfigScheme());
  };

  render() {
    const { FieldConfigSchemeStore, intl } = this.props;
    const {
      submitting, visible, field, page, pageSize, total,
    } = this.state;
    const pageInfo = {
      defaultCurrent: page,
      defaultPageSize: pageSize,
      total,
    };

    return (
      <Page className="issue-region">
        <Header title={<FormattedMessage id="fieldConfigScheme.title" />}>
          <Button onClick={() => this.showCreate('create')}>
            <i className="icon-add icon" />
            <FormattedMessage id="fieldConfigScheme.create" />
          </Button>
          <Button onClick={this.refresh}>
            <i className="icon-refresh icon" />
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content>
          <div className={`${prefixCls}-tip`}>
            <div><FormattedMessage id="fieldConfigScheme.tip1" /></div>
          </div>
          <Table
            dataSource={FieldConfigSchemeStore.getFieldConfigSchemes}
            columns={this.getColumn()}
            loading={FieldConfigSchemeStore.getIsLoading}
            rowKey={record => record.id}
            pagination={pageInfo}
            onChange={this.handleTableChange}
            filterBarPlaceholder={intl.formatMessage({ id: 'filter' })}
            className="issue-table"
          />
        </Content>
        <Modal
          visible={visible}
          title={<FormattedMessage id="fieldConfigScheme.action.delete" />}
          closable={false}
          footer={[
            <Button key="back" onClick={this.closeRemove}><FormattedMessage id="cancel" /></Button>,
            <Button key="submit" type="danger" onClick={this.handleDelete} loading={submitting}>
              <FormattedMessage id="delete" />
            </Button>,
          ]}
        >
          <p className={`${prefixCls}-del-content`}>
            <FormattedMessage id="fieldConfigScheme.action.delete" />
            <span>:</span>
            <span className={`${prefixCls}-del-content-name`}>{field.name}</span>
          </p>
          <p className={`${prefixCls}-del-tip`}>
            <FormattedMessage id="fieldConfigScheme.delete.inUseTip" />
          </p>
        </Modal>
      </Page>
    );
  }
}

export default Form.create({})(withRouter(injectIntl(FieldConfigSchemeList)));
