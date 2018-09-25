import { Content, Header, Page, stores } from 'choerodon-front-boot';
import { Button, Card, Form, Icon, Input, message, Modal, Spin, Table, Tooltip, Checkbox, Divider, Select } from 'choerodon-ui';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import './DeletePriorityModal.scss';
import '../../../main.scss';

const FormItem = Form.Item;
const { Sidebar } = Modal;
const { confirm } = Modal;
const { TextArea } = Input;
const { Option } = Select;

const { AppState } = stores;

@Form.create({})
@injectIntl
@observer
class DeletePriorityModal extends Component {

  handleOk = async () => {
    const { PriorityStore } = this.props;
    const {
      deletingPriorityRelatedEventsCount,
      deletingPriority,
    } = PriorityStore;
    const orgId = AppState.currentMenuType.organizationId;

    if (!deletingPriorityRelatedEventsCount) {
      try {
        await PriorityStore.deletePriorityById(orgId, deletingPriority.id);
        message.success('删除成功');
        PriorityStore.loadPriorityList(orgId);
      } catch (err) {
        message.error('删除失败');
      } finally {
        PriorityStore.setOnDeletingPriority(false);
      }
    } else {
      // 提交新的优先级选择
      const { form } = this.props;
      const { getFieldValue } = form;
      const newPriority = getFieldValue('priority');

      try {
        await PriorityStore.deleteAndChooseNewPriority(deletingPriority.id, newPriority.id);
        message.success('删除成功');
      } catch (err) {
        message.error('删除并替换新的优先级失败');
      } finally {
        PriorityStore.setOnDeletingPriority(false);
      }
    }
  }

  handleCancel = () => {
    const { PriorityStore } = this.props;
    const { deletingPriorityRelatedEventsCount } = PriorityStore;
    PriorityStore.setOnDeletingPriority(false);
  }

  render() {
    const { PriorityStore, intl, form } = this.props;
    const {
      onDeletingPriority,
      allPriority,
      deletingPriority,
      deletingPriorityRelatedEventsCount,
    } = PriorityStore;
    const { getFieldDecorator } = form;

    let deleteModalMessage = null;
    if (!deletingPriorityRelatedEventsCount) {
      deleteModalMessage = (
        <div>
          <div className="priority-name">
            <FormattedMessage id="priority.delete.title" />：{deletingPriority.name}
          </div>
          <div className="notice"><FormattedMessage id="priority.delete.unused.notice" /></div>
        </div>
      );
    } else {
      deleteModalMessage = (
        <div>
          <div>
            <FormattedMessage id="priority.delete.title" />：{deletingPriority.name}
          </div>
          <div>
            <Icon type="error" />
            当前有
            <span>{deletingPriorityRelatedEventsCount}</span>
            个事件单正在使用此优先级。
          </div>
          <div><FormattedMessage id="priority.delete.used.notice" /></div>
          <Form>
            <FormItem>
              {
                getFieldDecorator(
                  'priority',
                  {
                    rules: [
                      {
                        required: true,
                        message: intl.formatMessage({ id: 'required' }),
                      },
                    ],
                  },
                )(
                  <Select
                    label={<FormattedMessage id="priority.title" />}
                    placeholder={intl.formatMessage({ id: 'priority.delete.chooseNewPriority.placeholder' })}
                    onChange={this.handleSelectChange}
                  >
                    {
                      allPriority.map(
                        item => <Option value={item.id}>{item.name}</Option>,
                      )
                    }
                  </Select>,
                )
              }
            </FormItem>
          </Form>
        </div>       
      );
    }

    return (
      <Modal
        visible={onDeletingPriority}
        title={intl.formatMessage({ id: 'priority.delete.title' })}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        {
          deleteModalMessage
        }
      </Modal>
    );
  }
}

export default DeletePriorityModal;
