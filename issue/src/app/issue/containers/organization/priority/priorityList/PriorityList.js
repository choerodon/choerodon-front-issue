import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import {
  Table, Button, Modal, Form, Select, Input, Tooltip, Icon, Divider, message,
} from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import {
  Content, Header, Page, Permission, stores, axios,
} from 'choerodon-front-boot';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import PriorityCreate from '../priorityCreate';
import PriorityEdit from '../priorityEdit';
import DeletePriorityModal from '../deletePriorityModal';
import BodyRow from './bodyRow';

import '../../../main.scss';
import './PriorityList.scss';

const { AppState } = stores;

const ColorBlock = ({ color }) => (
  <div
    className="color-block"
    style={{
      backgroundColor: color,
    }}
  />
);

@DragDropContext(HTML5Backend)
@injectIntl
@observer
class PriorityList extends Component {
  components = {
    body: {
      row: BodyRow,
    },
  };

  componentDidMount() {
    this.refresh();
  }

  moveRow = (dragIndex, hoverIndex) => {
    const orgId = AppState.currentMenuType.organizationId;

    const { PriorityStore } = this.props;
    const { getPriorityList } = PriorityStore;
    const dragRow = getPriorityList[dragIndex];

    const priorityListAfterDrag = update(getPriorityList, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
    });

    PriorityStore.setPriorityList(priorityListAfterDrag);
    // 更新顺序
    PriorityStore.reOrder(orgId);
  };

  refresh = () => {
    const orgId = AppState.currentMenuType.organizationId;
    this.loadPriorityList(orgId);
  };

  getColumns = () => [
    {
      title: <FormattedMessage id="priority.name" />,
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        if (record.default) {
          return `${text} ${this.props.intl.formatMessage({ id: 'priority.default' })}`;
        } else {
          return text;
        }
      },
    },
    {
      title: <FormattedMessage id="priority.des" />,
      dataIndex: 'description',
      key: 'des',
    },
    {
      title: <FormattedMessage id="priority.color" />,
      dataIndex: 'colour',
      key: 'color',
      render: (text, record) => (
        <ColorBlock color={text} />
      ),
    },
    {
      title: '',
      className: 'operations',
      render: (text, record) => (
        <div>
          <Tooltip placement="top" title={<FormattedMessage id="edit" />}>
            <Button
              shape="circle"
              size="small"
              onClick={this.handleEdit.bind(this, record.id)}
            >
              <Icon type="mode_edit" />
            </Button>
          </Tooltip>
          {/* <Tooltip placement="top" title={<FormattedMessage id="delete" />}> */}
            {/* <Button */}
              {/* shape="circle" */}
              {/* size="small" */}
              {/* onClick={this.handleDelete.bind(this, record.id)} */}
            {/* > */}
              {/* <Icon type="delete" /> */}
            {/* </Button> */}
          {/* </Tooltip> */}
        </div>
      ),
    },
  ];

  handleEdit = (priorityId) => {
    const { PriorityStore } = this.props;
    PriorityStore.setEditingPriorityId(priorityId);
    this.showSideBar('edit');
  };

  handleDelete = async (priorityId) => {
    const { PriorityStore } = this.props;
    try {
      // await PriorityStore.checkDeletingPriorityRelatedEventsCount();
      PriorityStore.setOnDeletingPriority(true);
      PriorityStore.setDeletingPriorityId(priorityId);
    } catch (err) {
      message.error('删除校验失败');
    }
  };

  showSideBar = (operation) => {
    const { PriorityStore } = this.props;
    switch (operation) {
      case 'create':
        PriorityStore.setOnCreatingPriority(true);
        break;
      case 'edit':
        PriorityStore.setOnEditingPriority(true);
        break;
      default:
        break;
    }
  };

  async loadPriorityList(orgId) {
    const { PriorityStore } = this.props;
    try {
      await PriorityStore.loadPriorityList(orgId);
    } catch (err) {
      message.error('加载失败');
    }
  }

  render() {
    const { PriorityStore, intl } = this.props;
    const {
      getPriorityList,
      onLoadingList,
      onDeletingPriority,
      onEditingPriority,
      onCreatingPriority,
    } = PriorityStore;

    return (
      <Page>
        <Header title={<FormattedMessage id="priority.title" />}>
          {/* <Button onClick={() => this.showSideBar('create')}> */}
            {/* <Icon type="add" /> */}
            {/* <FormattedMessage id="priority.create" /> */}
          {/* </Button> */}
          <Button onClick={this.refresh}>
            <Icon type="refresh" />
            <FormattedMessage id="refresh" />
          </Button>
        </Header>

        <Content>
          <p className="tips">
            <FormattedMessage id="priority.list.tip" />
          </p>
          <Table
            filterBarPlaceholder={intl.formatMessage({ id: 'filter' })}
            columns={this.getColumns()}
            dataSource={getPriorityList}
            rowKey={record => record.id}
            loading={onLoadingList}
            pagination={false}
            components={this.components}
            onRow={(record, index) => ({
              index,
              moveRow: this.moveRow,
            })}
          />

          {
            onCreatingPriority ? <PriorityCreate PriorityStore={PriorityStore} /> : null
          }
          {
            onEditingPriority ? <PriorityEdit PriorityStore={PriorityStore} /> : null
          }
          {
            onDeletingPriority ? <DeletePriorityModal PriorityStore={PriorityStore} /> : null
          }
        </Content>
      </Page>
    );
  }
}

export default PriorityList;
