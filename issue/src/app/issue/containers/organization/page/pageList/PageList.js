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
import Tips from '../../../../components/Tips';
import '../../../main.scss';
import './PageList.scss';

const { AppState } = stores;
const FormItem = Form.Item;
const { Sidebar } = Modal;
const { TextArea } = Input;

const prefixCls = 'cloopm-page';
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
class PageList extends Component {
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
    title: <FormattedMessage id="page.name" />,
    dataIndex: 'name',
    key: 'name',
    filters: [],
  }, {
    title: <FormattedMessage id="page.scheme" />,
    dataIndex: 'pageSchemeDTOS',
    key: 'pageSchemeDTOS',
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
    title: <FormattedMessage id="page.stateMachine" />,
    dataIndex: 'stateMachine',
    key: 'stateMachine',
    filters: [],
    className: 'cloopm-table-ellipsis',
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
          </Tooltip> : <div className="cloopm-del-space" />
        }
      </div>
    ),
  }]);

  getCreateForm = () => {
    const { form, intl } = this.props;
    const { getFieldDecorator } = form;
    return (<div className="cloopm-region">
      <Form layout="vertical" className="cloopm-sidebar-form">
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
          className="cloopm-sidebar-form"
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
    const { PageStore } = this.props;
    const orgId = AppState.currentMenuType.organizationId;
    const {
      page, pageSize, sorter, tableParam,
    } = this.state;
    PageStore.loadPage(orgId, sorter, { page, pageSize, ...tableParam }).then((data) => {
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
    history.push(`/cloopm/screen-schemes/edit/${schemeId}?type=organization&id=${id}&name=${encodeURIComponent(name)}&organizationId=${organizationId}`);
  }

  showCreate = () => {
    const { PageStore, intl, history } = this.props;
    const { name, id, organizationId } = AppState.currentMenuType;
    history.push(`/cloopm/screens/create?type=organization&id=${id}&name=${encodeURIComponent(name)}&organizationId=${organizationId}`);
  };

  showEdit = (fieldConfigId) => {
    const { PageStore, intl, history } = this.props;
    const { name, id, organizationId } = AppState.currentMenuType;
    history.push(`/cloopm/screens/edit/${fieldConfigId}?type=organization&id=${id}&name=${encodeURIComponent(name)}&organizationId=${organizationId}`);
  }

  openRemove = (record) => {
    const { PageStore } = this.props;
    const orgId = AppState.currentMenuType.organizationId;
    this.setState({ visible: true, field: record });
  };

  closeRemove = () => {
    this.setState({
      visible: false, field: false,
    });
  };

  handleDelete = () => {
    const { PageStore, intl } = this.props;
    const { field } = this.state;
    const orgId = AppState.currentMenuType.organizationId;
    PageStore.deletePage(orgId, field.id)
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
    const { PageStore, intl } = this.props;
    const {
      submitting, visible, field, page, pageSize, total,
    } = this.state;
    const pageInfo = {
      defaultCurrent: page,
      defaultPageSize: pageSize,
      total,
    };

    return (
      <Page className="cloopm-region">
        <Header title={<FormattedMessage id="page.title" />}>
          <Button onClick={() => this.showCreate('create')}>
            <i className="icon-add icon" />
            <FormattedMessage id="page.create" />
          </Button>
          <Button onClick={this.refresh}>
            <i className="icon-refresh icon" />
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content>
          <div className={`${prefixCls}-tip`}>

            <div><FormattedMessage id="page.tip1" /></div>
            <div><FormattedMessage id="page.tip2" /></div>
            <ul>
              <li>
                <Tips tips={[
                  intl.formatMessage({
                    id: 'page.tip3',
                    values: {
                      create: <FormattedMessage id="create" />,
                      edit: <FormattedMessage id="edit" />,
                    },
                  })]}
                />
              </li>
              <li>
                <Tips tips={[
                  intl.formatMessage({
                    id: 'page.tip4',
                    values: {
                      transfer: <FormattedMessage id="page.tip.transfer" />,
                      stateMachine: <FormattedMessage id="page.tip.stateMachine" />,
                    },
                  })]}
                />

              </li>
            </ul>
          </div>
          <Table
            dataSource={PageStore.getPages}
            columns={this.getColumn()}
            loading={PageStore.getIsLoading}
            rowKey={record => record.id}
            pagination={pageInfo}
            onChange={this.handleTableChange}
            filterBarPlaceholder={intl.formatMessage({ id: 'filter' })}
            className="cloopm-table"
          />
        </Content>
        <Modal
          visible={visible}
          title={<FormattedMessage id="page.action.delete" />}
          closable={false}
          footer={[
            <Button key="back" onClick={this.closeRemove}><FormattedMessage id="cancel" /></Button>,
            <Button key="submit" type="danger" onClick={this.handleDelete} loading={submitting}>
              <FormattedMessage id="delete" />
            </Button>,
          ]}
        >
          <p className={`${prefixCls}-del-content`}>
            <FormattedMessage id="page.action.delete" />
            <span>:</span>
            <span className={`${prefixCls}-del-content-name`}>{field.name}</span>
          </p>
          <p className={`${prefixCls}-del-tip`}>
            <FormattedMessage id="page.delete.inUseTip" />
          </p>
        </Modal>
      </Page>
    );
  }
}

export default Form.create({})(withRouter(injectIntl(PageList)));
