import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import {
  Table, Button, Modal, Form, message, Tooltip, Icon, Input, Checkbox,
} from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import _ from 'lodash';
import {
  Content, Header, Page, Permission, stores,
} from 'choerodon-front-boot';
import TransferDrag from '../../../../components/TransferDrag';
import '../../../main.scss';
import './PageEdit.scss';
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
class PageEdit extends Component {
  constructor(props) {
    super(props);
    const { id } = this.props.match.params;
    this.state = {
      origin: [],
      target: [],
      id,
      dragValidator: true,
    };
  }

  componentDidMount() {
    this.loadPage();
  }

  getColumn = () => ([{
    title: <FormattedMessage id="page.edit.name" />,
    dataIndex: 'name',
    key: 'name',
    filters: [],
  }, {
    title: <FormattedMessage id="page.edit.des" />,
    dataIndex: 'description',
    key: 'description',
    filters: [],
    className: 'issue-table-ellipsis',
  }, {
    title: <FormattedMessage id="page.edit.page" />,
    dataIndex: 'page',
    key: 'page',
    filters: [],
    render: (text, recourd) => text && text.length && text.map(item => item.name),
  }, {
    title: <FormattedMessage id="page.edit.display" />,
    dataIndex: 'display',
    key: 'display',
    filters: [],
    render: (text, record) => <Checkbox />,
  }, {
    title: <FormattedMessage id="page.edit.required" />,
    dataIndex: 'required',
    key: 'required',
    filters: [],
    render: (text, record) => <Checkbox />,
  }]);

  loadPage = () => {
    const { PageStore } = this.props;
    const orgId = AppState.currentMenuType.organizationId;
    const { id } = this.state;

    PageStore.loadPageById(orgId, id).then((data) => {
      this.setState({
        page: data,
        target: data.fieldDTOs && data.fieldDTOs.slice(),
      });
      this.loadFieldList(data.fieldDTOs || []);
    });
  }

  loadFieldList = (target) => {
    const { PageStore } = this.props;
    const orgId = AppState.currentMenuType.organizationId;
    PageStore.loadFieldList(orgId).then((data) => {
      if (data && data.failed) {
        Choerodon.prompt(data.message);
      } else {
        const origin = _.differenceWith(data, target, (oItem, tItem) => oItem.id === tItem.id);
        this.setState({ origin });
      }
    });
  }

  handleCancel = () => {
    const { PageStore, intl, history } = this.props;
    const { name, id, organizationId } = AppState.currentMenuType;
    history.push(`/issue/screens?type=organization&id=${id}&name=${encodeURIComponent(name)}&organizationId=${organizationId}`);
  }

  handleSubmit = () => {
    const { PageStore, form } = this.props;
    const { id, page, target } = this.state;
    const orgId = AppState.currentMenuType.organizationId;

    form.validateFieldsAndScroll((err, data) => {
      if (!err && target.length) {
        const postData = data;
        postData.organizationId = orgId;
        this.setState({
          submitting: true,
          dragValidator: true,
        });
        postData.fieldDTOs = target;

        PageStore.updatePageById(orgId, id, Object.assign(page, { ...postData }))
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
      } else if (!target.length) {
        this.setState({
          dragValidator: false,
        });
      }
    });
  }

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
      submitting, origin, target, page, dragValidator
    } = this.state;
    const menu = AppState.currentMenuType;
    const {
      type, id: projectId, organizationId: orgId, name,
    } = menu;

    return (
      <Page className="issue-region">
        <Header
          title={<FormattedMessage id="page.edit.title" />}
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
                initialValue: page ? page.name : '',
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
              {getFieldDecorator('description', {
                initialValue: page ? page.description : '',
              })(
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

export default Form.create({})(withRouter(injectIntl(PageEdit)));
