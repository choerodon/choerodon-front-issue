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
import TransferDrag from '../../../../components/TransferDrag';
import '../../../main.scss';
import './PageCreate.scss';
// import CustomFieldsCreate from '../customFieldsCreate';

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
class PageCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field: false,
      origin: [],
      target: [],
      dragValidator: true,
    };
  }

  componentDidMount() {
    this.loadFieldList();
  }

  getColumn = () => ([{
    title: <FormattedMessage id="page.create.name" />,
    dataIndex: 'name',
    key: 'name',
    filters: [],
  }, {
    title: <FormattedMessage id="page.create.des" />,
    dataIndex: 'description',
    key: 'description',
    filters: [],
    className: 'issue-table-ellipsis',
  }, {
    title: <FormattedMessage id="page.create.page" />,
    dataIndex: 'page',
    key: 'page',
    filters: [],
    render: (text, recourd) => text && text.length && text.map(item => item.name),
  }, {
    title: <FormattedMessage id="page.create.display" />,
    dataIndex: 'display',
    key: 'display',
    filters: [],
    render: (text, record) => <Checkbox />,
  }, {
    title: <FormattedMessage id="page.create.required" />,
    dataIndex: 'required',
    key: 'required',
    filters: [],
    render: (text, record) => <Checkbox />,
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
                label={<FormattedMessage id="page.name" />}
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
                label={<FormattedMessage id="page.des" />}
              />,
            )}
          </FormItem>
        </Form>
      </div>);
  }

  loadFieldList = () => {
    const { PageStore } = this.props;
    const orgId = AppState.currentMenuType.organizationId;
    PageStore.loadFieldList(orgId).then((data) => {
      if (data && data.failed) {
        Choerodon.prompt(data.message);
      } else {
        this.setState({ origin: data });
      }
    });
  }

  loadFieldConfiguration = () => {
    const { PageStore } = this.props;
    const {
      sorter, tableParam, page, pageSize,
    } = this.state;
    const orgId = AppState.currentMenuType.organizationId;
    PageStore.loadFieldConfiguration(
      orgId, page ? page - 1 : undefined, pageSize, sorter, tableParam,
    );
  };

  handleCancel = () => {
    const { PageStore, intl, history } = this.props;
    const { name, id, organizationId } = AppState.currentMenuType;
    history.push(`/issue/screens?type=organization&id=${id}&name=${encodeURIComponent(name)}&organizationId=${organizationId}`);
  }

  handleSubmit = () => {
    const { PageStore, form } = this.props;
    const { target } = this.state;
    const orgId = AppState.currentMenuType.organizationId;

    form.validateFieldsAndScroll((err, data) => {
      if (!target.length) {
        this.setState({
          dragValidator: false,
        });
      }
      if (!err && target.length) {
        const postData = data;
        postData.organizationId = orgId;
        this.setState({
          submitting: true,
          dragValidator: true,
        });
        postData.fieldDTOs = target;
        PageStore.createPage(orgId, postData)
          .then((res) => {
            this.setState({
              submitting: false,
            });
            if (res) {
              this.handleCancel();
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

  onDragChange = (target, origin) => {
    this.setState({
      dragValidator: !!target.length,
      origin,
      target,
    });
  };

  render() {
    const { PageStore, intl, form } = this.props;
    const { getFieldDecorator } = form;
    const {
      submitting, field, origin, target, dragValidator,
    } = this.state;
    const menu = AppState.currentMenuType;
    const {
      type, id: projectId, organizationId: orgId, name,
    } = menu;

    return (
      <Page className="issue-region">
        <Header
          title={<FormattedMessage id="page.create.title" />}
          backPath={`/issue/screens?type=${type}&id=${projectId}&name=${encodeURIComponent(name)}&organizationId=${orgId}`}
        />
        <Content>
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
                  label={<FormattedMessage id="page.name" />}
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
                  label={<FormattedMessage id="page.des" />}
                />,
              )}
            </FormItem>
          </Form>
          {/* <div className={`${prefixCls}-tip`}>
            <FormattedMessage id="page.create.tip1" />
            {` ${intl.formatMessage({ id: 'page.create.tip2' })} `}
            <FormattedMessage id="page.create.tip3" />
            {` ${intl.formatMessage({ id: 'page.create.tip2' })} `}
            <FormattedMessage id="page.create.tip4" />
          </div> */}
          <TransferDrag
            targetTitle="page.create.targetTitle"
            originTitle="page.create.originTitle"
            origin={origin}
            target={target}
            validator={dragValidator}
            onDragChange={this.onDragChange}
          />
          <div className={`${prefixCls}-footer`}>
            <Button funcType="raised" type="primary" loading={submitting} onClick={this.handleSubmit}><FormattedMessage id="save" /></Button>
            <Button funcType="raised" loading={submitting} className="issue-btn-raised-cancel" onClick={this.handleCancel}><FormattedMessage id="cancel" /></Button>
          </div>
        </Content>
      </Page>
    );
  }
}

export default Form.create({})(withRouter(injectIntl(PageCreate)));
