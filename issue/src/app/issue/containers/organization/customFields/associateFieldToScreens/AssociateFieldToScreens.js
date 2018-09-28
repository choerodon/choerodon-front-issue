import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import {
  Form, Button, Table, message,
} from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import {
  Content, Header, Page, Permission, stores,
} from 'choerodon-front-boot';
import '../../../main.scss';
import './AssociateFieldToScreens.scss';

const { AppState } = stores;

@observer
class AssociateFieldToScreens extends Component {
  constructor(props) {
    super(props);
    const { id } = this.props.match.params;
    this.state = {
      selectedRowKeys: [],
      id,
    };
  }

  componentDidMount() {
    this.loadScreens();
  }

  loadScreens = () => {
    const { CustomFieldsStore } = this.props;
    const { id } = this.state;
    const orgId = AppState.currentMenuType.organizationId;
    CustomFieldsStore.loadScreens(orgId);
    CustomFieldsStore.loadAssociateScreens(orgId, id).then((data) => {
      this.setState({ selectedRowKeys: data });
    });
  };

  getColumn = () => ([{
    title: <FormattedMessage id="customFields.screen.name" />,
    dataIndex: 'name',
    key: 'name',
    filters: [],
  }]);

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  associateFieldToScreens = () => {
    const { id, selectedRowKeys } = this.state;
    const { CustomFieldsStore, intl } = this.props;
    const orgId = AppState.currentMenuType.organizationId;
    CustomFieldsStore.associateScreens(orgId, id, selectedRowKeys).then((data) => {
      message.success(intl.formatMessage({ id: 'customFields.associate.success' }));
    });
    this.cancelAssociate();
  };

  cancelAssociate = () => {
    const { history } = this.props;
    const {
      name, id, organizationId, type,
    } = AppState.currentMenuType;
    history.push(`/issue/custom-fields?type=${type}&id=${id}&name=${encodeURIComponent(name)}&organizationId=${organizationId}`);
  };

  handleTableChange =(pagination, filters, sorter, param) => {
    const { CustomFieldsStore } = this.props;
    const orgId = AppState.currentMenuType.organizationId;
    let searchParam = {};
    if (Object.keys(filters).length) {
      searchParam = filters;
    }
    const postData = {
      ...searchParam,
      param: param.toString(),
    };
    CustomFieldsStore.loadScreens(orgId, postData);
  };

  render() {
    const { intl, CustomFieldsStore } = this.props;
    const {
      type, id, organizationId, name,
    } = AppState.currentMenuType;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <Page>
        <Header
          title={<FormattedMessage id="customFields.associate" />}
          backPath={`/issue/custom-fields?type=${type}&id=${id}&name=${encodeURIComponent(name)}&organizationId=${organizationId}`}
        />
        <Content>
          <p className="issue-associate-tip">
            <FormattedMessage id="customFields.associate.tip" />
          </p>
          <Table
            rowSelection={rowSelection}
            dataSource={CustomFieldsStore.getScreens}
            columns={this.getColumn()}
            loading={CustomFieldsStore.getIsLoading}
            rowKey={record => record.id}
            filterBarPlaceholder={intl.formatMessage({ id: 'filter' })}
            pagination={false}
            className="issue-table issue-associate-table"
            onChange={this.handleTableChange}
          />
          <Button
            type="primary"
            funcType="raised"
            onClick={this.associateFieldToScreens}
            className="issue-associate-btn"
          >
            <FormattedMessage id="save" />
          </Button>
          <Button
            funcType="raised"
            onClick={this.cancelAssociate}
          >
            <FormattedMessage id="cancel" />
          </Button>
        </Content>
      </Page>
    );
  }
}

export default withRouter(injectIntl(AssociateFieldToScreens));
