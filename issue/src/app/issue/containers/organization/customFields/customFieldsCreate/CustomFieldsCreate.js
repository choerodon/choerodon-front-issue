import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import {
  Modal, Form, Select, Input, message,
} from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import {
  Content, Header, Page, Permission, stores,
} from 'choerodon-front-boot';
import '../../../main.scss';
import './CustomFieldsCreate.scss';
import * as images from '../../../../assets/images';

const { AppState } = stores;
const { Sidebar } = Modal;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
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
class CustomFieldsCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
    };
  }

  componentDidMount() {
  }

  handleClose = (id) => {
    const { form, onClose } = this.props;
    form.resetFields();
    onClose(id);
  };

  handleSubmit = () => {
    const {
      store, intl, form,
    } = this.props;
    const orgId = AppState.currentMenuType.organizationId;
    form.validateFieldsAndScroll((err, data) => {
      if (!err) {
        const postData = data;
        postData.organizationId = orgId;
        postData.objectVersionNumber = 0;
        this.setState({
          submitting: true,
        });
        store.createCustomField(orgId, postData)
          .then((field) => {
            message.success(intl.formatMessage({ id: 'createSuccess' }));
            this.setState({
              submitting: false,
            });
            this.handleClose(field.id);
          }).catch(() => {
            message.error(intl.formatMessage({ id: 'createFailed' }));
            this.setState({
              submitting: false,
            });
          });
      }
    });
  };

  checkName = (rule, value, callback) => {
    const { store, intl } = this.props;
    const orgId = AppState.currentMenuType.organizationId;
    if (!value) {
      callback();
    } else {
      store.checkName(orgId, value)
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

  render() {
    const { getFieldDecorator } = this.props.form;

    const {
      visible, intl, store, id,
    } = this.props;
    const { submitting } = this.state;
    const types = store.getCustomFieldTypes;

    return (
      <Sidebar
        title={id ? <FormattedMessage id="edit" /> : <FormattedMessage id="customFields.create" />}
        visible={visible}
        onOk={this.handleSubmit}
        onCancel={() => this.handleClose(false)}
        okText={id ? <FormattedMessage id="save" /> : <FormattedMessage id="create" />}
        cancelText={<FormattedMessage id="cancel" />}
        confirmLoading={submitting}
      >
        <div className="issue-region">
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
              {getFieldDecorator('description')(
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
                rules: [{
                  required: true,
                  message: intl.formatMessage({ id: 'required' }),
                }],
              })(
                <Select
                  style={{ width: 520 }}
                  label={<FormattedMessage id="customFields.type" />}
                  dropdownMatchSelectWidth
                  size="default"
                  optionLabelProp="name"
                >
                  {types.map(code => (
                    <Option
                      value={code}
                      key={code}
                      name={intl.formatMessage({ id: `customFields.${code}` })}
                    >
                      <img src={images[code]} alt="" className="issue-field-img" />
                      <span>
                        <FormattedMessage id={`customFields.${code}`} />
                      </span>
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Form>
        </div>
      </Sidebar>
    );
  }
}

export default Form.create({})(withRouter(injectIntl(CustomFieldsCreate)));
