import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import {
  Table, Button, Modal, Form, message, Tooltip, Icon,
} from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import {
  Content, Header, Page, Permission, stores,
} from 'choerodon-front-boot';
import '../../../main.scss';
import './CustomFieldsList.scss';
import CustomFieldsCreate from '../customFieldsCreate';

const { AppState } = stores;

@observer
class CustomFieldsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      visible: false,
      field: false,
    };
  }

  componentDidMount() {
    this.loadCustomFields();
  }

  getColumn = () => ([{
    title: <FormattedMessage id="customFields.name" />,
    dataIndex: 'name',
    key: 'name',
    filters: [],
  }, {
    title: <FormattedMessage id="customFields.des" />,
    dataIndex: 'description',
    key: 'description',
    filters: [],
    className: 'cloopm-table-ellipsis',
  }, {
    title: <FormattedMessage id="customFields.type" />,
    dataIndex: 'typeName',
    key: 'typeName',
    filters: [],
    render: (test, record) => (
      <FormattedMessage id={`customFields.${record.type}`} />
    ),
  }, {
    align: 'right',
    key: 'action',
    render: (test, record) => (
      <div>
        <Tooltip
          placement="bottom"
          title={<FormattedMessage id="customFields.associate" />}
        >
          <Button size="small" shape="circle" onClick={this.showAssociate.bind(this, record.id)}>
            <i className="icon icon-note_add" />
          </Button>
        </Tooltip>
        <Tooltip
          placement="bottom"
          title={<FormattedMessage id="edit" />}
        >
          <Button size="small" shape="circle" onClick={this.showEdit.bind(this, record.id)}>
            <i className="icon icon-mode_edit" />
          </Button>
        </Tooltip>
        <Tooltip
          placement="bottom"
          title={<FormattedMessage id="delete" />}
        >
          <Button size="small" shape="circle" onClick={this.openRemove.bind(this, record)}>
            <i className="icon icon-delete" />
          </Button>
        </Tooltip>
      </div>
    ),
  }]);

  loadCustomFields = () => {
    const { CustomFieldsStore } = this.props;
    const {
      sorter, tableParam, page, pageSize,
    } = this.state;
    const orgId = AppState.currentMenuType.organizationId;
    CustomFieldsStore.loadCustomFields(
      orgId, page ? page - 1 : undefined, pageSize, sorter, tableParam,
    );
  };

  refresh = () => {
    this.loadCustomFields();
  };

  showCreate = () => {
    const { CustomFieldsStore } = this.props;
    CustomFieldsStore.setCreateFieldShow('create');
  };

  showEdit = (fieldId) => {
    const { history } = this.props;
    const { name, id, organizationId } = AppState.currentMenuType;
    history.push(`/cloopm/custom-fields/edit/${fieldId}?type=organization&id=${id}&name=${encodeURIComponent(name)}&organizationId=${organizationId}`);
  };

  showAssociate = (fieldId) => {
    const { history } = this.props;
    const { name, id, organizationId } = AppState.currentMenuType;
    history.push(`/cloopm/custom-fields/associate/${fieldId}?type=organization&id=${id}&name=${encodeURIComponent(name)}&organizationId=${organizationId}`);
  };

  hideSidebar = (id) => {
    const { CustomFieldsStore } = this.props;
    CustomFieldsStore.setCreateFieldShow(false);
    if (id) {
      this.showAssociate(id);
    }
  };

  openRemove = (record) => {
    // const { CustomFieldsStore } = this.props;
    // const orgId = AppState.currentMenuType.organizationId;
    // CustomFieldsStore.checkDelete(orgId, record.id)
    //   .then((data) => {
    //     if (data) {
    //       if (data.canDelete) {
    //         this.setState({ visible: true, field: record, id: record.id });
    //       } else {
    //         this.setState({ visible: true, field: record });
    //       }
    //     }
    //   });
    this.setState({ visible: true, field: record, id: record.id });
  };

  closeRemove = () => {
    this.setState({
      visible: false, id: false, field: false,
    });
  };

  handleDelete = () => {
    const { CustomFieldsStore, intl } = this.props;
    const { id } = this.state;
    const orgId = AppState.currentMenuType.organizationId;
    CustomFieldsStore.deleteCustomField(orgId, id)
      .then((data) => {
        if (data) {
          message.success(intl.formatMessage({ id: 'deleteSuccess' }));
        } else {
          message.error(intl.formatMessage({ id: 'deleteFailed' }));
        }
        this.closeRemove();
        this.loadCustomFields();
      }).catch((error) => {
        message.error(intl.formatMessage({ id: 'deleteFailed' }));
        this.closeRemove();
      });
  };

  handleTableChange =(pagination, filters, sorter, param) => {
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
    }, () => this.loadCustomFields());
  };

  render() {
    const { CustomFieldsStore, intl } = this.props;
    const {
      submitting, visible, field,
    } = this.state;

    return (
      <Page className="cloopm-region">
        <Header title={<FormattedMessage id="customFields.title" />}>
          <Button onClick={() => this.showCreate('create')}>
            <i className="icon-add icon" />
            <FormattedMessage id="customFields.create" />
          </Button>
          <Button onClick={this.refresh}>
            <i className="icon-refresh icon" />
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content>
          <p className="cloopm-customFields-list-tip">
            <FormattedMessage id="customFields.list.tip" />
          </p>
          <Table
            dataSource={CustomFieldsStore.getCustomFields}
            columns={this.getColumn()}
            loading={CustomFieldsStore.getIsLoading}
            rowKey={record => record.id}
            pagination={CustomFieldsStore.pageInfo}
            onChange={this.handleTableChange}
            filterBarPlaceholder={intl.formatMessage({ id: 'filter' })}
            className="cloopm-table"
          />
        </Content>
        <CustomFieldsCreate
          store={CustomFieldsStore}
          visible={!!CustomFieldsStore.getCreateFieldShow}
          onClose={this.hideSidebar}
        />
        <Modal
          visible={visible}
          title={<FormattedMessage id="customFields.action.delete" />}
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
            <Icon type="error" className="cloopm-customFields-icon cloopm-error-msg" />
            <FormattedMessage
              id="customFields.delete.inUse"
              values={{
                num: 12,
              }}
            />
          </p>
          <p className="cloopm-customFields-tip">
            <FormattedMessage id="customFields.delete.inUseTip" />
          </p>
        </Modal>
      </Page>
    );
  }
}

export default withRouter(injectIntl(CustomFieldsList));
