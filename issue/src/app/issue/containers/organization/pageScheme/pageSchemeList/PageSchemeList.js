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
import './PageSchemeList.scss';

const { AppState } = stores;
const FormItem = Form.Item;
const Sidebar = Modal.Sidebar;
const TextArea = Input.TextArea;

const prefixCls = 'issue-page';
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
class PageSchemeList extends Component {
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
    this.loadPage();
  }

  getColumn = () => ([{
    title: <FormattedMessage id="pageScheme.name" />,
    dataIndex: 'name',
    key: 'name',
    filters: [],
  }, {
    title: <FormattedMessage id="pageScheme.scheme" />,
    dataIndex: 'pageIssueSchemeDTOS',
    key: 'pageIssueSchemeDTOS',
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
                message: intl.formatMessage({ id: 'state.name.required' }),
              }],
            })(
              <Input
                style={{ width: 520 }}
                autoFocus
                label={<FormattedMessage id="state.name" />}
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
                label={<FormattedMessage id="state.des" />}
              />,
            )}
          </FormItem>
        </Form>
      </div>);
  }

  loadPage = () => {
    const { PageSchemeStore } = this.props;
    const orgId = AppState.currentMenuType.organizationId;
    const {
      page, pageSize, sorter, tableParam,
    } = this.state;
    PageSchemeStore.loadPagecheme(orgId, sorter, { page, pageSize, ...tableParam }).then((data) => {
      this.setState({
        total: data.totalElements,
      });
    });
  };

  refresh = () => {
    this.loadPage();
  };

  handleSchemeClick = (schemeId) => {
    const { StateMachineStore, intl, history } = this.props;
    const { name, id, organizationId } = AppState.currentMenuType;
    history.push(`/issue/issue-type-screen-schemes/edit/${schemeId}?type=organization&id=${id}&name=${encodeURIComponent(name)}&organizationId=${organizationId}`);
  }

  showCreate = () => {
    const { PageSchemeStore, intl, history } = this.props;
    const { name, id, organizationId } = AppState.currentMenuType;
    history.push(`/issue/screen-schemes/create?type=organization&id=${id}&name=${encodeURIComponent(name)}&organizationId=${organizationId}`);
  };

  showEdit = (fieldConfigId) => {
    const { PageSchemeStore, intl, history } = this.props;
    const { name, id, organizationId } = AppState.currentMenuType;
    history.push(`/issue/screen-schemes/edit/${fieldConfigId}?type=organization&id=${id}&name=${encodeURIComponent(name)}&organizationId=${organizationId}`);
  }

  showAssociate = (id) => {
    const { PageSchemeStore } = this.props;
    this.setState({ id });
    // CustomFieldsStore.setCreateTypeShow('edit');
  };

  hideSidebar = () => {
    const { PageSchemeStore } = this.props;
    this.setState({ id: false });
    PageSchemeStore.setCreateTypeShow(false);
    this.loadPage();
  };

  openRemove = (record) => {
    const { PageSchemeStore } = this.props;
    const orgId = AppState.currentMenuType.organizationId;
    this.setState({ visible: true, field: record });
  };

  closeRemove = () => {
    this.setState({
      visible: false, id: false, field: false,
    });
  };

  handleSubmit = () => {
    const { PageSchemeStore } = this.props;
    const { id, type, copyFrom, editState, page, pageSize, sorter, tableParam } = this.state;
    const orgId = AppState.currentMenuType.organizationId;

    this.props.form.validateFieldsAndScroll((err, data) => {
      if (!err) {
        const postData = data;
        postData.organizationId = orgId;
        this.setState({
          submitting: true,
        });
        PageSchemeStore.createState(orgId, postData)
          .then((res) => {
            if (res) {
              this.loadState(page, pageSize, sorter, tableParam);
              this.setState({ type: false, show: false });
            }
            this.setState({
              submitting: false,
            });
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
    const { PageSchemeStore, intl } = this.props;
    const { field } = this.state;
    const orgId = AppState.currentMenuType.organizationId;
    PageSchemeStore.deletePageScheme(orgId, field.id)
      .then((data) => {
        this.closeRemove();
        if (data) {
          message.success(intl.formatMessage({ id: 'deleteSuccess' }));
        } else {
          message.error(intl.formatMessage({ id: 'deleteFailed' }));
        }
        this.loadPage();
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
    }, () => this.loadPage());
  };

  render() {
    const { PageSchemeStore, intl } = this.props;
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
        <Header title={<FormattedMessage id="pageScheme.title" />}>
          <Button onClick={() => this.showCreate('create')}>
            <i className="icon-add icon" />
            <FormattedMessage id="pageScheme.create" />
          </Button>
          <Button onClick={this.refresh}>
            <i className="icon-refresh icon" />
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content>
          <div className={`${prefixCls}-tip`}>
            <div><FormattedMessage id="pageScheme.tip1" /></div>
            <div><FormattedMessage id="pageScheme.tip2" /></div>
          </div>
          <Table
            dataSource={PageSchemeStore.getPageSchemes}
            columns={this.getColumn()}
            loading={PageSchemeStore.getIsLoading}
            rowKey={record => record.id}
            pagination={pageInfo}
            onChange={this.handleTableChange}
            filterBarPlaceholder={intl.formatMessage({ id: 'filter' })}
            className="issue-table"
          />
        </Content>
        <Modal
          visible={visible}
          title={<FormattedMessage id="pageScheme.action.delete" />}
          closable={false}
          footer={[
            <Button key="back" onClick={this.closeRemove}><FormattedMessage id="cancel" /></Button>,
            <Button key="submit" type="danger" onClick={this.handleDelete} loading={submitting}>
              <FormattedMessage id="delete" />
            </Button>,
          ]}
        >
          <p className={`${prefixCls}-del-content`}>
            <FormattedMessage id="pageScheme.action.delete" />
            <span>:</span>
            <span className={`${prefixCls}-del-content-name`}>{field.name}</span>
          </p>
          <p className={`${prefixCls}-del-tip`}>
            <FormattedMessage id="pageScheme.delete.inUseTip" />
          </p>
        </Modal>
      </Page>
    );
  }
}

export default Form.create({})(withRouter(injectIntl(PageSchemeList)));
