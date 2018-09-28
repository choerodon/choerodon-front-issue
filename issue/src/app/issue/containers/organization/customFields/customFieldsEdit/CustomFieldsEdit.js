import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import {
  Form, Button, Input, Divider, Select, TimePicker, Spin,
  DatePicker, InputNumber, Cascader, Checkbox, message,
} from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import {
  Content, Header, Page, Permission, stores,
} from 'choerodon-front-boot';
import moment from 'moment';
import { randomString } from '../../../../common/utils';
import '../../../main.scss';
import './CustomFieldsEdit.scss';
import DragList from '../../../../components/DragList';
import TreeList from '../../../../components/TreeList';

const { AppState } = stores;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const singleList = ['radio', 'single'];
const multipleList = ['checkbox', 'multiple'];
const dateList = ['time', 'datetime'];
const textList = ['input', 'text', 'url'];
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

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
class CustomFieldsEdit extends Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    this.state = {
      id: match.params.id,
      fieldOptions: [],
      defaultValue: '',
      isCheck: false,
      dateDisable: false,
      spinning: true,
    };
  }

  componentDidMount() {
    this.loadFieldById();
  }

  loadFieldById = () => {
    const loopDefault = (data, keyList) => {
      if (data) {
        const defaultDatas = data.filter(item => item.isDefault === '1');
        if (defaultDatas.length) {
          const defaultData = defaultDatas[0];
          keyList.push(String(defaultData.id));
          if (defaultData.children && defaultData.children.length) {
            loopDefault(defaultData.children, keyList);
          }
        }
      }
      return keyList;
    };
    const { CustomFieldsStore } = this.props;
    const { id } = this.state;
    const orgId = AppState.currentMenuType.organizationId;
    CustomFieldsStore.loadCustomFieldById(orgId, id).then((data) => {
      if (data) {
        if (singleList.indexOf(data.type) !== -1) {
          // 单选
          const defaultOption = data.fieldOptions ? data.fieldOptions.filter(f => f.isDefault === '1').map(f => f.id) : [];
          this.setState({
            fieldOptions: data.fieldOptions || [],
            defaultValue: defaultOption.length ? defaultOption[0] : [],
          });
        } else if (multipleList.indexOf(data.type) !== -1) {
          // 多选
          const defaultValue = data.fieldOptions ? data.fieldOptions.filter(f => f.isDefault === '1').map(f => String(f.id)) : [];
          this.setState({
            fieldOptions: data.fieldOptions || [],
            defaultValue,
          });
        } else if (data.type === 'cascade') {
          // 级联
          const defaultValue = loopDefault(data.fieldOptions, []);
          this.setState({
            fieldOptions: data.fieldOptions || [],
            defaultValue,
          });
        } else if (dateList.indexOf(data.type) !== -1) {
          // 时间日期
          let defaultValue = data.defaultValue && moment(data.defaultValue);
          if (data.extraConfig === '1') {
            defaultValue = moment();
          }
          this.setState({
            isCheck: data.extraConfig === '1',
            defaultValue,
            dateDisable: data.extraConfig === '1',
          });
        } else if (data.type === 'number') {
          // 数字
          const defaultValue = data.defaultValue && Number(data.defaultValue);
          this.setState({
            isCheck: data.extraConfig === '1',
            defaultValue,
          });
        } else if (textList.indexOf(data.type) !== -1) {
          // 文本
          this.setState({
            defaultValue: data.defaultValue,
          });
        } else if (data.type === 'label') {
          // 标签
          const defaultValue = data.defaultValue && data.defaultValue.split(',');
          this.setState({
            defaultValue,
          });
        }
        this.setState({
          spinning: false,
        });
      }
    });
  };

  saveEdit = () => {
    const loopDefault = (data, keyList) => {
      if (data) {
        return data.map((item) => {
          if (keyList.indexOf(String(item.id)) !== -1
            || keyList.indexOf(String(item.tempKey)) !== -1) {
            return { ...item, isDefault: '1', children: loopDefault(item.children, keyList) };
          } else {
            return { ...item, isDefault: '0', children: loopDefault(item.children, keyList) };
          }
        });
      }
      return [];
    };
    const {
      CustomFieldsStore, intl, form,
    } = this.props;
    const { fieldOptions, id } = this.state;
    const orgId = AppState.currentMenuType.organizationId;
    form.validateFieldsAndScroll((err, data) => {
      if (!err) {
        this.setState({
          submitting: true,
        });
        const field = CustomFieldsStore.getField;
        const postData = {
          ...field,
          type: field.type,
          defaultValue: String(data.defaultValue),
          extraConfig: data.check ? '1' : '0',
        };
        if (singleList.indexOf(field.type) !== -1) {
          postData.fieldOptions = fieldOptions.map((o) => {
            if (o.tempKey === data.defaultValue || o.id === data.defaultValue) {
              return { ...o, isDefault: '1' };
            } else {
              return { ...o, isDefault: '0' };
            }
          });
        } else if (multipleList.indexOf(field.type) !== -1) {
          postData.fieldOptions = fieldOptions.map((o) => {
            if (data.defaultValue.indexOf(String(o.tempKey)) !== -1
              || data.defaultValue.indexOf(String(o.id)) !== -1) {
              return { ...o, isDefault: '1' };
            } else {
              return { ...o, isDefault: '0' };
            }
          });
        } else if (field.type === 'cascade') {
          postData.fieldOptions = loopDefault(fieldOptions, data.defaultValue);
        } else if (dateList.indexOf(field.type) !== -1) {
          postData.defaultValue = data.defaultValue && data.defaultValue.format(dateFormat);
        } else if (field.type === 'label') {
          postData.defaultValue = data.defaultValue ? data.defaultValue.join(',') : '';
        }
        CustomFieldsStore.updateCustomField(orgId, id, postData)
          .then((e) => {
            if (e.failed) {
              message.error(intl.formatMessage({ id: e.code }));
              this.setState({
                submitting: false,
              });
            } else {
              message.success(intl.formatMessage({ id: 'editSuccess' }));
              this.setState({
                submitting: false,
              });
              this.cancelEdit();
            }
          }).catch((e) => {
            message.error(intl.formatMessage({ id: 'editFailed' }));
            this.setState({
              submitting: false,
            });
          });
      }
    });
  };

  cancelEdit = () => {
    const { history, CustomFieldsStore } = this.props;
    CustomFieldsStore.setField({});
    const {
      name, id, organizationId, type,
    } = AppState.currentMenuType;
    history.push(`/issue/custom-fields?type=${type}&id=${id}&name=${encodeURIComponent(name)}&organizationId=${organizationId}`);
  };

  onTreeChange = (fieldOptions) => {
    this.setState({
      fieldOptions,
    });
  };

  onTreeCreate = (value) => {
    const { fieldOptions, id } = this.state;
    this.setState({
      fieldOptions: [
        ...fieldOptions,
        {
          fieldId: id,
          isEnable: '1',
          value,
          tempKey: randomString(5),
          children: [],
        },
      ],
    });
  };

  onTreeDelete = (tempKey) => {
    const { form, CustomFieldsStore } = this.props;
    const field = CustomFieldsStore.getField;
    const defaultValue = form.getFieldValue('defaultValue');
    if (multipleList.indexOf(field.type) !== -1) {
      const newValue = defaultValue.filter(v => v !== String(tempKey));
      form.setFieldsValue({ defaultValue: newValue });
    } else if (singleList.indexOf(field.type) !== -1) {
      if (defaultValue === tempKey) {
        form.setFieldsValue({ defaultValue: '' });
      }
    } else if (field.type === 'cascade') {
      if (defaultValue.indexOf(String(tempKey)) !== -1) {
        form.setFieldsValue({ defaultValue: '' });
      }
    }
  };

  handleCheck = (e) => {
    this.setState({
      isCheck: e.target.checked,
      dateDisable: e.target.checked,
    });
  };

  checkName = (rule, value, callback) => {
    const { CustomFieldsStore, intl, id } = this.props;
    const orgId = AppState.currentMenuType.organizationId;
    const name = CustomFieldsStore.getField ? CustomFieldsStore.getField.name : false;
    if ((name && value === name) || !value) {
      callback();
    } else {
      CustomFieldsStore.checkName(orgId, value, id)
        .then((data) => {
          if (data) {
            callback();
          } else {
            callback(intl.formatMessage({ id: 'customFields.name.check.exist' }));
          }
        }).catch((error) => {
          callback();
        });
    }
  };

  loop = (options) => {
    const enableOptions = options.filter(item => item.isEnable === '1');
    return enableOptions.map((item) => {
      if (item.children && item.children.length) {
        return {
          ...item,
          value: item.tempKey || String(item.id),
          label: item.value,
          children: this.loop(item.children),
        };
      } else {
        return {
          ...item,
          value: item.tempKey || String(item.id),
          label: item.value,
        };
      }
    });
  };

  render() {
    const { form, intl, CustomFieldsStore } = this.props;
    const { getFieldDecorator } = form;
    const menu = AppState.currentMenuType;
    const {
      type, id, organizationId, name,
    } = menu;
    const field = CustomFieldsStore.getField;
    const {
      fieldOptions, submitting, defaultValue, isCheck, dateDisable, spinning,
    } = this.state;

    return (
      <Page>
        <Header
          title={<FormattedMessage id="customFields.edit" />}
          backPath={`/issue/custom-fields?type=${type}&id=${id}&name=${encodeURIComponent(name)}&organizationId=${organizationId}`}
        />
        <Spin spinning={spinning}>
          <Content>
            <Form layout="vertical" onSubmit={this.handleOk} className="c7n-sidebar-form">
              <FormItem
                {...formItemLayout}
                className="issue-sidebar-form"
              >
                {getFieldDecorator('name', {
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: intl.formatMessage({ id: 'required' }),
                  }, {
                    validator: this.checkName,
                  }],
                  initialValue: field.name,
                })(
                  <Input
                    maxLength={15}
                    label={<FormattedMessage id="customFields.name" />}
                  />,
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                className="issue-sidebar-form"
              >
                {getFieldDecorator('description', {
                  initialValue: field.description,
                })(
                  <TextArea
                    maxLength={45}
                    label={<FormattedMessage id="customFields.des" />}
                  />,
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                className="issue-sidebar-form"
              >
                {getFieldDecorator('type', {
                  initialValue: intl.formatMessage({ id: `customFields.${field.type}` }),
                })(
                  <Input
                    disabled
                    label={<FormattedMessage id="customFields.type" />}
                  />,
                )}
              </FormItem>
              {
                singleList.indexOf(field.type) !== -1
                  ? (
                    <Fragment>
                      <FormItem
                        {...formItemLayout}
                        className="issue-sidebar-form"
                      >
                        {getFieldDecorator('defaultValue', {
                          initialValue: defaultValue || [],
                        })(
                          <Select
                            label={<FormattedMessage id="customFields.default" />}
                            dropdownMatchSelectWidth
                            notFoundContent={intl.formatMessage({ id: 'customFields.value.null' })}
                            allowClear
                          >
                            {fieldOptions && fieldOptions.length > 0
                            && fieldOptions.map((item) => {
                              if (item.isEnable === '1') {
                                return (
                                  <Option
                                    value={item.tempKey || item.id}
                                    key={item.tempKey || item.id}
                                  >
                                    {item.value}
                                  </Option>
                                );
                              }
                              return [];
                            })}
                          </Select>,
                        )}
                      </FormItem>
                      <DragList
                        title={intl.formatMessage({ id: `customFields.${field.type}` })}
                        data={fieldOptions}
                        tips={intl.formatMessage({ id: 'customFields.dragList.tips' })}
                        onChange={this.onTreeChange}
                        onCreate={this.onTreeCreate}
                        onDelete={this.onTreeDelete}
                        onInvalid={this.onTreeDelete}
                      />
                    </Fragment>
                  ) : ''
              }
              {
                multipleList.indexOf(field.type) !== -1
                  ? (
                    <Fragment>
                      <FormItem
                        {...formItemLayout}
                        className="issue-sidebar-form"
                      >
                        {getFieldDecorator('defaultValue', {
                          initialValue: defaultValue || [],
                        })(
                          <Select
                            label={<FormattedMessage id="customFields.default" />}
                            dropdownMatchSelectWidth
                            mode="multiple"
                            notFoundContent={intl.formatMessage({ id: 'customFields.value.null' })}
                          >
                            {fieldOptions && fieldOptions.length > 0
                            && fieldOptions.map((item) => {
                              if (item.isEnable === '1') {
                                return (
                                  <Option
                                    value={item.tempKey || String(item.id)}
                                    key={item.tempKey || String(item.id)}
                                  >
                                    {item.value}
                                  </Option>
                                );
                              }
                              return [];
                            })}
                          </Select>,
                        )}
                      </FormItem>
                      <DragList
                        title={intl.formatMessage({ id: `customFields.${field.type}` })}
                        data={fieldOptions}
                        tips={intl.formatMessage({ id: 'customFields.dragList.tips' })}
                        onChange={this.onTreeChange}
                        onCreate={this.onTreeCreate}
                        onDelete={this.onTreeDelete}
                        onInvalid={this.onTreeDelete}
                      />
                    </Fragment>
                  ) : ''
              }
              {
                field.type === 'cascade'
                  ? (
                    <Fragment>
                      <FormItem
                        {...formItemLayout}
                        className="issue-sidebar-form"
                      >
                        {getFieldDecorator('defaultValue', {
                          initialValue: defaultValue || [],
                        })(
                          <Cascader
                            label={<FormattedMessage id="customFields.default" />}
                            options={this.loop(fieldOptions)}
                            placeholder={<FormattedMessage id="customFields.placeholder" />}
                            notFoundContent={intl.formatMessage({ id: 'customFields.value.null' })}
                            allowClear
                          />,
                        )}
                      </FormItem>
                      <TreeList
                        title={intl.formatMessage({ id: `customFields.${field.type}` })}
                        data={fieldOptions}
                        tips={intl.formatMessage({ id: 'customFields.dragList.tips' })}
                        onChange={this.onTreeChange}
                        onCreate={this.onTreeCreate}
                        onDelete={this.onTreeDelete}
                        onInvalid={this.onTreeDelete}
                      />
                    </Fragment>
                  ) : ''
              }
              {
                field.type === 'time'
                  ? (
                    <Fragment>
                      <FormItem
                        {...formItemLayout}
                        className="issue-sidebar-form"
                      >
                        {getFieldDecorator('defaultValue', {
                          initialValue: defaultValue || null,
                        })(
                          <TimePicker
                            label={<FormattedMessage id="customFields.default" />}
                            defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                            style={{ width: 520 }}
                            disabled={dateDisable}
                            allowEmpty
                          />,
                        )}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        className="issue-sidebar-form"
                      >
                        {getFieldDecorator('check', {
                          valuePropName: 'checked',
                          initialValue: isCheck || false,
                        })(
                          <Checkbox onChange={this.handleCheck}>
                            <FormattedMessage id="customFields.useCurrentTime" />
                          </Checkbox>,
                        )}
                      </FormItem>
                    </Fragment>
                  ) : ''
              }
              {
                field.type === 'datetime'
                  ? (
                    <Fragment>
                      <FormItem
                        {...formItemLayout}
                        className="issue-sidebar-form"
                      >
                        {getFieldDecorator('defaultValue', {
                          initialValue: defaultValue || null,
                        })(
                          <DatePicker
                            label={<FormattedMessage id="customFields.default" />}
                            format="YYYY-MM-DD HH:mm:ss"
                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                            style={{ width: 520 }}
                            disabled={dateDisable}
                            allowClear
                          />,
                        )}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        className="issue-sidebar-form"
                      >
                        {getFieldDecorator('check', {
                          valuePropName: 'checked',
                          initialValue: isCheck || false,
                        })(
                          <Checkbox onChange={this.handleCheck}>
                            <FormattedMessage id="customFields.useCurrentDate" />
                          </Checkbox>,
                        )}
                      </FormItem>
                    </Fragment>
                  ) : ''
              }
              {
                field.type === 'number'
                  ? (
                    <Fragment>
                      <FormItem
                        {...formItemLayout}
                        className="issue-sidebar-form"
                      >
                        {getFieldDecorator('check', {
                          valuePropName: 'checked',
                          initialValue: isCheck || false,
                        })(
                          <Checkbox onChange={this.handleCheck}>
                            <FormattedMessage id="customFields.decimal" />
                          </Checkbox>,
                        )}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        className="issue-sidebar-form"
                      >
                        {getFieldDecorator('defaultValue', {
                          initialValue: defaultValue || 0,
                        })(
                          <InputNumber
                            step={isCheck ? 0.1 : 1}
                            label={<FormattedMessage id="customFields.default" />}
                          />,
                        )}
                      </FormItem>
                    </Fragment>
                  ) : ''
              }
              {
                field.type === 'input'
                  ? (
                    <FormItem
                      {...formItemLayout}
                      className="issue-sidebar-form"
                    >
                      {getFieldDecorator('defaultValue', {
                        initialValue: defaultValue || '',
                      })(
                        <Input
                          label={<FormattedMessage id="customFields.default" />}
                        />,
                      )}
                    </FormItem>
                  ) : ''
              }
              {
                field.type === 'text'
                  ? (
                    <FormItem
                      {...formItemLayout}
                      className="issue-sidebar-form"
                    >
                      {getFieldDecorator('defaultValue', {
                        initialValue: defaultValue || '',
                      })(
                        <TextArea
                          label={<FormattedMessage id="customFields.default" />}
                        />,
                      )}
                    </FormItem>
                  ) : ''
              }
              {
                field.type === 'url'
                  ? (
                    <FormItem
                      {...formItemLayout}
                      className="issue-sidebar-form"
                    >
                      {getFieldDecorator('defaultValue', {
                        rules: [{
                          type: 'url',
                          message: intl.formatMessage({ id: 'customFields.urlError' }),
                        }],
                        initialValue: defaultValue || '',
                      })(
                        <Input
                          label={<FormattedMessage id="customFields.default" />}
                        />,
                      )}
                    </FormItem>
                  ) : ''
              }
              {
                field.type === 'label'
                  ? (
                    <FormItem
                      {...formItemLayout}
                      className="issue-sidebar-form"
                    >
                      {getFieldDecorator('defaultValue', {
                        initialValue: defaultValue || [],
                      })(
                        <Select
                          label={<FormattedMessage id="customFields.default" />}
                          mode="tags"
                        />,
                      )}
                    </FormItem>
                  ) : ''
              }
            </Form>
            <Divider />
            <Button
              type="primary"
              funcType="raised"
              onClick={this.saveEdit}
              className="issue-save-btn"
              loading={submitting}
            >
              <FormattedMessage id="save" />
            </Button>
            <Button
              funcType="raised"
              onClick={this.cancelEdit}
            >
              <FormattedMessage id="cancel" />
            </Button>
          </Content>
        </Spin>
      </Page>
    );
  }
}

export default Form.create({})(withRouter(injectIntl(CustomFieldsEdit)));
