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
import './FieldConfigSchemeEdit.scss';
import PageStore from '../../../../stores/organization/page';
import IssueTypeSchemeStore from '../../../../stores/organization/issueTypeScheme';

const { AppState } = stores;
const FormItem = Form.Item;
const { Sidebar } = Modal;
const { TextArea } = Input;
const { Option } = Select;

const prefixCls = 'cloopm-fieldConfigScheme';
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
class FieldConfigSchemeEdit extends Component {
  constructor(props) {
    super(props);
    const { id } = this.props.match.params;
    this.state = {
      id,
      fieldConfig: [],
      issueType: [],
      relatedData: [],
    };
  }

  componentDidMount() {
    this.loadFieldConfigScheme();
    this.loadFieldConfig();
    this.loadIssueType();
  }

  getColumn = () => ([{
    title: <FormattedMessage id="fieldConfigScheme.create.related.issueType" />,
    dataIndex: 'issueTypeName',
    key: 'issueTypeName',
    filters: [],
    render: (test, record) => (
      <span>
        <Icon type={record.issueTypeIcon} className="cloopm-fieldConfigScheme-icon" />
        {record.issueTypeName}
      </span>
    ),
  }, {
    title: <FormattedMessage id="fieldConfigScheme.create.related.fieldConfig" />,
    dataIndex: 'fieldConfigName',
    key: 'fieldConfigName',
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
          <Button size="small" shape="circle" onClick={this.showEdit.bind(this, record.issueTypeId)}>
            <i className="icon icon-mode_edit" />
          </Button>
        </Tooltip>
        {!record.default ?
          <Tooltip
            placement="bottom"
            title={<FormattedMessage id="delete" />}
          >
            <Popconfirm title={<FormattedMessage id="pageScheme.related.deleteTip" />} onConfirm={() => this.handleDelete(record.issueTypeId)}>
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
    const { form, intl } = this.props;
    const { getFieldDecorator } = form;
    const {
      relatedData, editIndex, issueTypeList, fieldConfig,
    } = this.state;
    return (
      <div className="cloopm-region">
        <Form layout="vertical" className="cloopm-sidebar-form">
          <FormItem
            {...formItemLayout}
            className="cloopm-sidebar-form"
          >
            {getFieldDecorator('issueTypeId', {
              rules: [{
                required: true,
                message: intl.formatMessage({ id: 'required' }),
              }],
              initialValue: editIndex !== false && editIndex >= 0 ? { key: relatedData[editIndex].issueTypeId, label: relatedData[editIndex].issueTypeName } : { key: '' },
            })(
              <Select
                style={{ width: 520 }}
                label={<FormattedMessage id="fieldConfigScheme.create.related.issueType" />}
                dropdownMatchSelectWidth
                size="default"
                labelInValue
              >
                {issueTypeList && issueTypeList.length && issueTypeList.map(code => (
                  <Option
                    value={code.id}
                    key={code.id}
                  >
                    <Icon type={code.icon} className="cloopm-fieldConfigScheme-icon" />
                    {code.name}
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            className="cloopm-sidebar-form"
          >
            {getFieldDecorator('fieldConfigId', {
              rules: [{
                required: true,
                message: intl.formatMessage({ id: 'required' }),
              }],
              initialValue: editIndex !== false && editIndex >= 0 ? { key: relatedData[editIndex].fieldConfigId, label: relatedData[editIndex].fieldConfigName } : { key: '' },
            })(
              <Select
                style={{ width: 520 }}
                label={<FormattedMessage id="fieldConfigScheme.create.related.fieldConfig" />}
                dropdownMatchSelectWidth
                size="default"
                optionLabelProp="name"
                disabled={relatedData[editIndex] && relatedData[editIndex].type === 'default'}
                labelInValue
              >
                {fieldConfig && fieldConfig.length && fieldConfig
                  .map(code => (
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
        </Form>
      </div>);
  }

  loadFieldConfigScheme = () => {
    const { FieldConfigSchemeStore } = this.props;
    const orgId = AppState.currentMenuType.organizationId;
    const { id } = this.state;

    FieldConfigSchemeStore.loadFieldConfigSchemeById(orgId, id).then((data) => {
      this.setState({
        fieldConfigScheme: data,
        relatedData: data.fieldConfigSchemeLineDTOList && data.fieldConfigSchemeLineDTOList.slice(),
      });
    });
  }

  loadFieldConfig = () => {
    const { FieldConfigSchemeStore } = this.props;
    const orgId = AppState.currentMenuType.organizationId;
    FieldConfigSchemeStore.loadFieldConfiguration(orgId).then((data) => {
      if (data) {
        this.setState({
          fieldConfig: data,
        });
      }
    });
  }

  loadIssueType = () => {
    const orgId = AppState.currentMenuType.organizationId;
    IssueTypeSchemeStore.loadIssueTypes(orgId).then((data) => {
      if (data) {
        this.setState({
          issueType: data,
        });
      }
    });
  }

  getSideBarData = (id) => {
    const { issueType, relatedData, editIndex } = this.state;
    const issueTypeList = _.differenceWith(issueType || [], relatedData,
      (item, related) => {
        if (id) {
          return item.id === related.issueTypeId && relatedData[editIndex].issueTypeId !== related.issueTypeId;
        } else {
          return item.id === related.issueTypeId;
        }
      });
    this.setState({
      issueTypeList,
      show: true,
    });
  }

  showCreate = () => {
    this.setState({
      relatedType: 'add',
      editIndex: false,
    }, () => this.getSideBarData());
  };

  showEdit = (id) => {
    const { relatedData = [] } = this.state;
    const index = _.findIndex(relatedData, item => item.issueTypeId === id);
    this.setState({
      editIndex: index,
      relatedType: 'edit',
    }, () => this.getSideBarData(id));
  };

  hideSidebar = () => {
    this.setState({
      id: false,
      show: false,
    });
  };

  handleCancel = () => {
    const { history } = this.props;
    const { name, id, organizationId } = AppState.currentMenuType;
    history.push(`/cloopm/field-configuration-schemes?type=organization&id=${id}&name=${encodeURIComponent(name)}&organizationId=${organizationId}`);
  }

  handleSubmit = () => {
    const { FieldConfigSchemeStore, form } = this.props;
    const { relatedData = [], id, fieldConfigScheme } = this.state;
    const orgId = AppState.currentMenuType.organizationId;

    form.validateFieldsAndScroll((err, data) => {
      if (!err) {
        const postData = Object.assign(fieldConfigScheme, {
          ...data,
          fieldConfigSchemeLineDTOList: relatedData,
        });
        this.setState({
          submitting: true,
        });
        FieldConfigSchemeStore.updateFieldConfigSchemeById(orgId, id, postData)
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
    const { form } = this.props;
    const { relatedData = [], relatedType, editIndex } = this.state;
    const orgId = AppState.currentMenuType.organizationId;
    form.validateFields(['issueTypeId', 'fieldConfigId'], {}, (err, value, modify) => {
      if (!err) {
        const data = {
          issueTypeName: value.issueTypeId.label,
          issueTypeIcon: value.issueTypeId.icon,
          issueTypeId: value.issueTypeId.key,
          fieldConfigId: value.fieldConfigId.key,
          fieldConfigName: value.fieldConfigId.label,
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
    _.remove(relatedData, item => item.issueTypeId === id);
    this.setState({ relatedData });
  };

  render() {
    const { intl, form } = this.props;
    const { getFieldDecorator } = form;
    const {
      submitting, relatedType, fieldConfigScheme, relatedData,
    } = this.state;
    const menu = AppState.currentMenuType;
    const {
      type, id: projectId, organizationId: orgId, name,
    } = menu;

    return (
      <Page className="cloopm-region">
        <Header
          title={<FormattedMessage id="fieldConfigScheme.edit.title" />}
          backPath={`/cloopm/field-configuration-schemes?type=${type}&id=${projectId}&name=${encodeURIComponent(name)}&organizationId=${orgId}`}
        />
        <Content>
          <div className={`${prefixCls}-tip`}>
            <FormattedMessage id="fieldConfigScheme.create.tip1" />

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
                initialValue: fieldConfigScheme ? fieldConfigScheme.name : '',
              })(
                <Input
                  style={{ width: 520 }}
                  label={<FormattedMessage id="fieldConfigScheme.name" />}
                  size="default"
                />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              className="cloopm-sidebar-form"
            >
              {getFieldDecorator('description', {
                initialValue: fieldConfigScheme ? fieldConfigScheme.description : '',
              })(
                <TextArea
                  style={{ width: 520 }}
                  label={<FormattedMessage id="fieldConfigScheme.des" />}
                />,
              )}
            </FormItem>
          </Form>
          <div className={`${prefixCls}-related-wrapper`}>
            <div className={`${prefixCls}-related-content-wrapper`}>
              <div className={`${prefixCls}-related-title`}>
                <FormattedMessage id="fieldConfigScheme.create.related.title" />
                <Button className={`${prefixCls}-related-action`} type="primary" funcType="flat" icon="add" onClick={this.showCreate}><FormattedMessage id="add" /></Button>
              </div>
              <div className={`${prefixCls}-related-content`}>
                <Table
                  filterBar={false}
                  columns={this.getColumn()}
                  dataSource={relatedData}
                  pagination={false}
                  rowKey={record => record.issueTypeId}
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
          title={<FormattedMessage id={`fieldConfigScheme.create.related.${relatedType}`} />}
          visible={this.state.show}
          onOk={this.handleRelatedSubmit}
          okText={<FormattedMessage id={this.state.relatedType === 'add' ? 'add' : 'save'} />}
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

export default Form.create({})(withRouter(injectIntl(FieldConfigSchemeEdit)));
