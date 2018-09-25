import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import {
  Table, Button, Modal, Form, message, Tooltip, Icon, Input, Checkbox, Select, Popconfirm,
} from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import {
  Content, Header, Page, Permission, stores,
} from 'choerodon-front-boot';
import _ from 'lodash';
import '../../../main.scss';
import './PageSchemeCreate.scss';
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
class PageSchemeCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      visible: false,
      field: false,
      // origin: [],
      // target: [],
      pages: [],
    };
  }

  componentDidMount() {
    this.loadPage();
    // this.loadFieldConfiguration();
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
      pages, pageList, typeList, editIndex, relatedData,
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

  loadPage = () => {
    // const { PageStore } = this.props;
    const orgId = AppState.currentMenuType.organizationId;
    PageStore.loadPage(orgId, undefined, { page: 0, pageSize: 20 }).then((data) => {
      if (data && data.failed) {
        Choerodon.prompt(data.message);
      } else {
        const list = data.content || [];
        const relatedData = list.slice(0, 1);
        relatedData[0] = {
          default: true,
          organizationId: orgId,
          type: 'default',
          pageId: relatedData[0].id,
          pageName: relatedData[0].name,
        };
        this.setState({
          pages: list,
          relatedData,
        });
      }
    });
  }

  loadFieldConfiguration = () => {
    const { PageSchemeStore } = this.props;
    const {
      sorter, tableParam, page, pageSize,
    } = this.state;
    const orgId = AppState.currentMenuType.organizationId;
    PageSchemeStore.loadFieldConfiguration(
      orgId, page ? page - 1 : undefined, pageSize, sorter, tableParam,
    );
  };

  refresh = () => {
    this.loadFieldConfiguration();
  };

  getSideBarData = (id) => {
    const { pages, relatedData, editIndex } = this.state;
    const pageList = _.differenceWith(pages || [], relatedData,
      (item, related) => {
        if (id) {
          return item.id === related.pageId && relatedData[editIndex].pageId !== related.pageId;
        } else {
          return item.id === related.pageId;
        }
      });
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
      pageList,
      typeList,
      show: true,
    });
  }

  showCreate = () => {
    const { PageSchemeStore } = this.props;
    // this.getSideBarData();
    this.setState({
      relatedType: 'add',
      editIndex: false,
    }, () => this.getSideBarData());
  };

  showEdit = (id) => {
    const { PageSchemeStore } = this.props;
    const { relatedData = [] } = this.state;
    // this.getSideBarData();
    const index = _.findIndex(relatedData, item => item.pageId === id);
    this.setState({
      editIndex: index,
      relatedType: 'edit',
    }, () => this.getSideBarData(id));
  };

  // showAssociate = (id) => {
  //   const { PageSchemeStore } = this.props;
  //   this.setState({ id });
  // };

  hideSidebar = () => {
    const { PageSchemeStore } = this.props;
    this.setState({
      id: false,
      show: false,
    });
    this.loadFieldConfiguration();
  };


  // closeRemove = () => {
  //   this.setState({
  //     visible: false, id: false, field: false,
  //   });
  // };

  handleCancel = () => {
    const { PageSchemeStore, intl, history } = this.props;
    const { name, id, organizationId } = AppState.currentMenuType;
    history.push(`/cloopm/screen-schemes?type=organization&id=${id}&name=${encodeURIComponent(name)}&organizationId=${organizationId}`);
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

  handleSubmit = () => {
    const { PageSchemeStore, form } = this.props;
    const { relatedData = [] } = this.state;
    const orgId = AppState.currentMenuType.organizationId;

    form.validateFieldsAndScroll((err, data) => {
      if (!err) {
        const postData = data;
        postData.organizationId = orgId;
        this.setState({
          submitting: true,
        });
        postData.pageSchemeLineDTOS = relatedData;
        PageSchemeStore.createPageScheme(orgId, postData)
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

  handleDelete = (id) => {
    // const { PageSchemeStore, intl } = this.props;
    const { relatedData = [] } = this.state;
    _.remove(relatedData, item => item.pageId === id);
    this.setState({ relatedData });
  };

  render() {
    const { PageSchemeStore, intl, form } = this.props;
    const { getFieldDecorator } = form;
    const {
      id, submitting, visible, field, origin, target, relatedType, pages, relatedData,
      currentType, currentPage,
    } = this.state;
    const menu = AppState.currentMenuType;
    const {
      type, id: projectId, organizationId: orgId, name,
    } = menu;

    return (
      <Page className="cloopm-region">
        <Header
          title={<FormattedMessage id="pageScheme.create.title" />}
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
              {getFieldDecorator('description')(
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
        {/* <Modal
          visible={visible}
          title={<FormattedMessage id="pageScheme.create.action.delete" />}
          closable={false}
          footer={[
            <Button key="back" onClick={this.closeRemove}><FormattedMessage id="cancel" /></Button>,
            <Button key="submit" type="danger" onClick={this.handleDelete} loading={submitting}>
              <FormattedMessage id="delete" />
            </Button>,
          ]}
        >
          <p className="cloopm-customFields-tip">
            <FormattedMessage id="customFields.delete" />
            <span className="cloopm-customFields-bold">{field.name}</span>
          </p>
          <p className="cloopm-customFields-tip">
            <FormattedMessage
              id="customFields.delete.inUse"
              values={{
                num: 12,
              }}
            />
          </p>
          <p className="cloopm-customFields-tip">
            <FormattedMessage id="pageScheme.create.delete.inUseTip" />
          </p>
        </Modal> */}
      </Page>
    );
  }
}

export default Form.create({})(withRouter(injectIntl(PageSchemeCreate)));
