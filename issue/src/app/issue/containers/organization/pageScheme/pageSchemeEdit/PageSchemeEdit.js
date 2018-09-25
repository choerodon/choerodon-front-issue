import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import {
  Table, Button, Modal, Form, message, Tooltip, Icon, Input, Checkbox, Select, Popconfirm,
} from 'choerodon-ui';
import _ from 'lodash';
import { injectIntl, FormattedMessage } from 'react-intl';
import {
  Content, Header, Page, Permission, stores,
} from 'choerodon-front-boot';
import '../../../main.scss';
import './PageSchemeEdit.scss';
import PageStore from '../../../../stores/organization/page';
import Tips from '../../../../components/Tips';
// import CustomFieldsCreate from '../customFieldsCreate';

const { AppState } = stores;
const FormItem = Form.Item;
const { Sidebar } = Modal;
const { TextArea } = Input;
const { Option } = Select;

const prefixCls = 'cloopm-pageScheme';
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
class PageSchemeEdit extends Component {
  constructor(props) {
    super(props);
    const { id } = this.props.match.params;
    this.state = {
      id,
      visible: false,
      field: false,
      // origin: [],
      // target: [],
      pages: [],
      pageScheme: {},
      editIndex: false,
      pageList: [],
      typeList: [],
    };
  }

  componentDidMount() {
    this.loadPageScheme();
  }

  getColumn = () => ([{
    title: <FormattedMessage id="pageScheme.create.related.name" />,
    dataIndex: 'pageName',
    key: 'pageName',
    filters: [],
  }, {
    title: <FormattedMessage id="pageScheme.create.related.type" />,
    dataIndex: 'type',
    key: 'type',
    filters: [],
    render: (text, recourd) => <FormattedMessage id={`pageScheme.create.${text || 'default'}`} />,
  }, {
    align: 'right',
    key: 'action',
    render: (test, record) => (
      <div>
        <Tooltip
          placement="bottom"
          title={<FormattedMessage id="edit" />}
        >
          <Button size="small" shape="circle" onClick={this.showEdit.bind(this, record.pageId)}>
            <i className="icon icon-mode_edit" />
          </Button>
        </Tooltip>
        {!record.default ?
          <Tooltip
            placement="bottom"
            title={<FormattedMessage id="delete" />}
          >
            <Popconfirm title={<FormattedMessage id="pageScheme.related.deleteTip" />} onConfirm={() => this.handleDelete(record.pageId)}>
              <Button size="small" shape="circle">
                <i className="icon icon-delete" />
              </Button>
            </Popconfirm>
          </Tooltip> : <div className="cloopm-del-space" />
        }
      </div>
    ),
  }]);

  getCreateForm = () => {
    const { form, intl, PageSchemeStore } = this.props;
    const { getFieldDecorator } = form;
    const {
      relatedData, editIndex, pageList, typeList,
    } = this.state;
    return (
      <div className="cloopm-region">
        <Form layout="vertical" className="cloopm-sidebar-form">
          <FormItem
            {...formItemLayout}
            className="cloopm-sidebar-form"
          >
            {getFieldDecorator('pageId', {
              rules: [{
                required: true,
                message: intl.formatMessage({ id: 'required' }),
              }],
              initialValue: editIndex !== false && editIndex >= 0 ? { key: relatedData[editIndex].pageId } : { key: '' },
            })(
              <Select
                style={{ width: 520 }}
                label={<FormattedMessage id="pageScheme.create.related.page" />}
                dropdownMatchSelectWidth
                size="default"
                optionLabelProp="name"
                labelInValue
              >
                {pageList && pageList.length && pageList.map(code => (
                  <Option
                    value={code.id}
                    key={code.id}
                    name={code.name}
                  >
                    <span>
                      {code.name}
                    </span>
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            className="cloopm-sidebar-form"
          >
            {getFieldDecorator('type', {
              rules: [{
                required: true,
                message: intl.formatMessage({ id: 'required' }),
              }],
              initialValue: editIndex !== false && editIndex >= 0 ? relatedData[editIndex].type : '',
            })(
              <Select
                style={{ width: 520 }}
                label={<FormattedMessage id="pageScheme.create.related.type" />}
                dropdownMatchSelectWidth
                size="default"
                optionLabelProp="name"
                disabled={relatedData[editIndex] && relatedData[editIndex].type === 'default'}
              >
                {/* <Option key="2" value="2">222</Option> */}
                {typeList && typeList.length && typeList
                  .map(code => (
                    <Option
                      value={code}
                      key={code}
                      name={intl.formatMessage({ id: `pageScheme.create.${code}` })}
                    >
                      <span>
                        <FormattedMessage id={`pageScheme.create.${code}`} />
                      </span>
                    </Option>
                  ))}
              </Select>,
            )}
          </FormItem>
        </Form>
      </div>);
  }

  loadPageScheme = () => {
    const { PageSchemeStore } = this.props;
    const orgId = AppState.currentMenuType.organizationId;
    const { id } = this.state;

    PageSchemeStore.loadPageSchemeById(orgId, id).then((data) => {
      this.setState({
        pageScheme: data,
        relatedData: data.pageSchemeLineDTOS && data.pageSchemeLineDTOS.slice(),
      });
      this.loadPage();
    });
  }

  loadPage = () => {
    const orgId = AppState.currentMenuType.organizationId;
    PageStore.loadPage(orgId, undefined, { page: 0, pageSize: 20 }).then((data) => {
      if (data && data.failed) {
        Choerodon.prompt(data.message);
      } else {
        this.setState({ pages: data.content });
      }
    });
  }

  refresh = () => {
    this.loadPageScheme();
  };

  getSideBarData = (id) => {
    const { pages, relatedData, editIndex } = this.state;
    // const pageList = _.differenceWith(pages || [], relatedData,
    //   (item, related) => {
    //     if (id) {
    //       return item.id === related.pageId && relatedData[editIndex].pageId !== related.pageId;
    //     } else {
    //       return item.id === related.pageId;
    //     }
    //   });
    const types = ['default', 'create', 'edit'];
    const typeList = _.differenceWith(types, relatedData,
      (item, related) => {
        if (id) {
          return item === related.type && item !== related.type;
        } else {
          return item === related.type;
        }
      });
    this.setState({
      pageList: pages,
      typeList,
      show: true,
    });
  }

  showCreate = () => {
    const { PageSchemeStore } = this.props;
    this.setState({
      relatedType: 'add',
      editIndex: false,
    }, () => this.getSideBarData());
  };

  showEdit = (id) => {
    const { PageSchemeStore } = this.props;
    const { relatedData = [] } = this.state;
    const index = _.findIndex(relatedData, item => item.pageId === id);
    this.setState({
      editIndex: index,
      relatedType: 'edit',
    }, () => this.getSideBarData(id));
  };

  hideSidebar = () => {
    const { PageSchemeStore } = this.props;
    this.setState({
      id: false,
      show: false,
    });
  };

  handleCancel = () => {
    const { PageSchemeStore, intl, history } = this.props;
    const { name, id, organizationId } = AppState.currentMenuType;
    history.push(`/cloopm/screen-schemes?type=organization&id=${id}&name=${encodeURIComponent(name)}&organizationId=${organizationId}`);
  }

  handleSubmit = () => {
    const { PageSchemeStore, form } = this.props;
    const { relatedData = [], id, pageScheme } = this.state;
    const orgId = AppState.currentMenuType.organizationId;

    form.validateFieldsAndScroll((err, data) => {
      if (!err) {
        const postData = Object.assign(pageScheme, {
          ...data,
          pageSchemeLineDTOS: relatedData,
        });
        // postData.organizationId = orgId;
        this.setState({
          submitting: true,
        });
        // postData.pageSchemeLineDTOS = relatedData;
        PageSchemeStore.updatePageSchemeById(orgId, id, postData)
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

  handleRelatedSubmit = () => {
    const { PageSchemeStore, form } = this.props;
    const { relatedData = [], relatedType, editIndex } = this.state;
    const orgId = AppState.currentMenuType.organizationId;
    form.validateFields(['pageId', 'type'], {}, (err, value, modify) => {
      if (!err) {
        const data = {
          pageName: value.pageId.label,
          pageId: value.pageId.key,
          organizationId: orgId,
          type: value.type,
        };
        if (relatedType === 'add') {
          relatedData.push(data);
        } else {
          relatedData[editIndex] = Object.assign(relatedData[editIndex], data);
        }
        this.setState({
          relatedData,
          show: false,
        });
      }
    });
  }

  handleDelete = (id) => {
    const { relatedData = [] } = this.state;
    _.remove(relatedData, item => item.pageId === id);
    this.setState({ relatedData });
  };

  render() {
    const { PageSchemeStore, intl, form } = this.props;
    const { getFieldDecorator } = form;
    const {
      id, submitting, visible, field, origin, target, relatedType, pages, pageScheme, relatedData,
    } = this.state;
    const menu = AppState.currentMenuType;
    const {
      type, id: projectId, organizationId: orgId, name,
    } = menu;

    return (
      <Page className="cloopm-region">
        <Header
          title={<FormattedMessage id="pageScheme.edit.title" />}
          backPath={`/cloopm/screen-schemes?type=${type}&id=${projectId}&name=${encodeURIComponent(name)}&organizationId=${orgId}`}
        />
        <Content>
          <div className={`${prefixCls}-tip`}>
            <FormattedMessage id="pageScheme.create.tip1" />
            <Tips tips={[intl.formatMessage({ id: 'pageScheme.create.tip2' })]} />
          </div>
          <Form layout="vertical" className="cloopm-sidebar-form">
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
                initialValue: pageScheme ? pageScheme.name : '',
              })(
                <Input
                  style={{ width: 520 }}
                  label={<FormattedMessage id="pageScheme.name" />}
                  size="default"
                />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              className="cloopm-sidebar-form"
            >
              {getFieldDecorator('description', {
                initialValue: pageScheme ? pageScheme.description : '',
              })(
                <TextArea
                  style={{ width: 520 }}
                  label={<FormattedMessage id="pageScheme.des" />}
                />,
              )}
            </FormItem>
          </Form>
          <div className={`${prefixCls}-related-wrapper`}>
            <div className={`${prefixCls}-related-content-wrapper`}>
              <div className={`${prefixCls}-related-title`}>
                <FormattedMessage id="pageScheme.create.related.title" />
                <Button className={`${prefixCls}-related-action`} type="primary" funcType="flat" icon="add" onClick={this.showCreate}><FormattedMessage id="add" /></Button>
              </div>
              <div className={`${prefixCls}-related-content`}>
                <Table
                  filterBar={false}
                  columns={this.getColumn()}
                  dataSource={relatedData}
                  pagination={false}
                  rowKey={record => record.pageId}
                />
              </div>
            </div>
          </div>

          <div className={`${prefixCls}-footer`}>
            <Button funcType="raised" type="primary" loading={submitting} onClick={this.handleSubmit}><FormattedMessage id="save" /></Button>
            <Button funcType="raised" loading={submitting} className="cloopm-btn-raised-cancel" onClick={this.handleCancel}><FormattedMessage id="cancel" /></Button>
          </div>
        </Content>

        {this.state.show && <Sidebar
          title={<FormattedMessage id={`pageScheme.create.related.${relatedType}`} />}
          visible={this.state.show}
          onOk={this.handleRelatedSubmit}
          okText={<FormattedMessage id={this.state.type === 'create' ? 'create' : 'save'} />}
          cancelText={<FormattedMessage id="cancel" />}
          confirmLoading={this.state.submitting}
          onCancel={this.hideSidebar}
        >
          {this.getCreateForm()}
        </Sidebar>}
      </Page>
    );
  }
}

export default Form.create({})(withRouter(injectIntl(PageSchemeEdit)));
