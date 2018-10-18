import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import {
  Button,
  Icon,
  Form,
  Table,
  Modal,
  Select,
  Popover,
  Spin,
} from 'choerodon-ui';
import { Page, Header, Content, stores } from 'choerodon-front-boot';
import { FormattedMessage, injectIntl } from 'react-intl';
import Graph from '../../../../components/Graph';
import './EditStateMachineScheme.scss';
import '../../../main.scss';
import StateMachineStore from '../../../../stores/organization/stateMachine';

const Sidebar = Modal.Sidebar;
const FormItem = Form.Item;
const Option = Select.Option;
const { AppState } = stores;
const prefixCls = 'issue-stateMachineScheme';
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
class EditStateMachineScheme extends Component {
  constructor(props) {
    super(props);
    const schemeId = this.props.match.params.id;

    this.state = {
      stateMachine: '',
      deleteId: 0,
      schemeId,
      deleteItemName: '',
    };
  }

  componentDidMount() {
    const { organizationId } = AppState.currentMenuType;
    const { StateMachineSchemeStore } = this.props;
    const { stateMachine, schemeId } = this.state;

    StateMachineSchemeStore.loadStateMachine(
      organizationId,
      schemeId,
    );
    StateMachineSchemeStore.loadAllStateMachine(organizationId)
      .then(() => {
        this.loadGraphData();
      });
    // StateMachineSchemeStore.loadGraphData(organizationId, stateMachine);
  }

  loadAllData = () => {
    const { organizationId } = AppState.currentMenuType;
    const { schemeId } = this.state;
    const { StateMachineSchemeStore } = this.props;

    StateMachineSchemeStore.loadStateMachine(organizationId, schemeId);
  };

  handleAddStateMachine = () => {
    const { StateMachineSchemeStore, form } = this.props;
    const allStateMachine = StateMachineSchemeStore.getAllStateMachine;
    StateMachineSchemeStore.setIsAddVisible(true);
    StateMachineSchemeStore.setSelectedIssueTypeId([]);

    if (allStateMachine && allStateMachine.length) {
      this.setState({
        stateMachine: allStateMachine[0].id,
      });
    }
    form.setFieldsValue({
      stateMachine: allStateMachine.length !== 0 && allStateMachine[0].id,
    });
  };

  handleCancleAddStateMachine = () => {
    const { StateMachineSchemeStore } = this.props;
    StateMachineSchemeStore.setIsAddVisible(false);
  };

  handleNextStep = () => {
    const { StateMachineSchemeStore } = this.props;
    const { schemeId } = this.state;
    StateMachineSchemeStore.setIsConnectVisible(true);
    const { organizationId } = AppState.currentMenuType;
    StateMachineSchemeStore.loadAllIssueType(organizationId, schemeId);
    StateMachineSchemeStore.setSelectedIssueTypeId([]);
  };

  handlePreStep = () => {
    const { StateMachineSchemeStore } = this.props;
    StateMachineSchemeStore.setIsConnectVisible(false);
  };

  handleCloseConnectStateMachine = () => {
    const { StateMachineSchemeStore } = this.props;
    StateMachineSchemeStore.setIsAddVisible(false);
    StateMachineSchemeStore.setIsConnectVisible(false);
  };

  handleFinishConnectStateMachine = () => {
    const { StateMachineSchemeStore } = this.props;
    StateMachineSchemeStore.setIsAddVisible(false);
    StateMachineSchemeStore.setIsConnectVisible(false);
    StateMachineSchemeStore.setSelectedIssueTypeId(StateMachineSchemeStore.getSelectedIssueTypeId);
  };

  setGraphData = (res) => {
    const { StateMachineSchemeStore } = this.props;
    StateMachineSchemeStore.setNodeData(res.nodeDTOs);
    StateMachineSchemeStore.setTransferData(res.transformDTOs);
  }

  loadGraphData = (item) => {
    const { StateMachineSchemeStore } = this.props;
    const { organizationId } = AppState.currentMenuType;
    const stateMachine = item || StateMachineSchemeStore.getAllStateMachine.slice()[0];
    if (stateMachine.status === 'state_machine_create') {
      StateMachineStore.loadStateMachineDraftById(organizationId, stateMachine.id)
        .then((data) => {
          StateMachineSchemeStore.setGraphLoading(false);
          this.setGraphData(data);
        });
    } else {
      StateMachineStore.loadStateMachineDeployById(organizationId, stateMachine.id)
        .then((data) => {
          StateMachineSchemeStore.setGraphLoading(false);
          this.setGraphData(data);
        });
    }
  }

  handleSelectChange = (value) => {
    const { StateMachineSchemeStore } = this.props;

    const allStateMachine = StateMachineSchemeStore.getAllStateMachine;
    const { stateMachine } = this.state;
    const item = allStateMachine[value];
    this.setState({
      stateMachine: item.id,
    });
    this.loadGraphData(item);
  };

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const schemeDTOs = [];
    const { StateMachineSchemeStore } = this.props;
    if (selectedRows && selectedRows.length) {
      selectedRows.map((selectedRow) => {
        const row = {};
        row.issueTypeId = selectedRow.id;
        schemeDTOs.push(row);
        return true;
      });
    }
    StateMachineSchemeStore.setSchemeDTOs(schemeDTOs);
  };

  handleFinish = () => {
    const { organizationId } = AppState.currentMenuType;
    const { schemeId, stateMachine } = this.state;
    const { StateMachineSchemeStore } = this.props;

    const stateMachineId = stateMachine;
    const schemeDTOs = StateMachineSchemeStore.getSchemeDTOs;

    StateMachineSchemeStore.setSelectedIssueTypeId(schemeDTOs);
    StateMachineSchemeStore.saveStateMachine(
      organizationId,
      schemeId,
      stateMachineId,
      schemeDTOs,
    ).then(() => {
      this.handleFinishConnectStateMachine();
    });
  };

  handleDelete = (deleteId, deleteItemName) => {
    const { StateMachineSchemeStore } = this.props;
    this.setState({
      deleteId,
      deleteItemName,
    });
    StateMachineSchemeStore.setIsMachineDeleteVisible(true);
  };

  confirmDelete = (stateMachineId) => {
    const { schemeId } = this.state;
    const { StateMachineSchemeStore } = this.props;
    const { organizationId } = AppState.currentMenuType;
    StateMachineSchemeStore.deleteStateMachine(organizationId, schemeId, stateMachineId);
    StateMachineSchemeStore.setIsMachineDeleteVisible(false);
  };

  cancelDelete = (e) => {
    const { StateMachineSchemeStore } = this.props;
    StateMachineSchemeStore.setIsMachineDeleteVisible(false);
  };

  handleEditStateMachine = (stateMachineId) => {
    const issueTypeId = [];
    const { organizationId } = AppState.currentMenuType;
    const { schemeId } = this.state;
    const { StateMachineSchemeStore } = this.props;

    StateMachineSchemeStore.loadAllIssueType(organizationId, schemeId)
      .then(() => {
        StateMachineSchemeStore.getAllIssueType
          .map((issueType) => {
            if (issueType.stateMachineSchemeConfigDTO && issueType.stateMachineSchemeConfigDTO.stateMachineId === stateMachineId) {
              issueTypeId.push(issueType.id);
            }
            return true;
          });
        StateMachineSchemeStore.setSelectedIssueTypeId(issueTypeId);
        StateMachineSchemeStore.setIsAddVisible(false);
        StateMachineSchemeStore.setIsConnectVisible(true);
      });
  };

  renderAddStateMachineForm = () => {
    const { StateMachineSchemeStore, form, intl } = this.props;
    const { getFieldDecorator } = form;
    const allStateMachine = StateMachineSchemeStore.getAllStateMachine;

    return (
      <Fragment>
        <Form>
          <FormItem {...formItemLayout} className="issue-sidebar-form">
            {getFieldDecorator('stateMachine', {
              initialValue: 0,
            })(
              <Select
                label={intl.formatMessage({
                  id: 'stateMachineScheme.stateMachine',
                })}
                onChange={val => this.handleSelectChange(val)}
              >
                {allStateMachine &&
                  allStateMachine.map((stateMachineItem, index) => (
                    <Option
                      key={stateMachineItem.id}
                      value={index}
                    >
                      {stateMachineItem.name}
                    </Option>
                  ))}
              </Select>,
            )}
          </FormItem>
        </Form>
        <Spin spinning={StateMachineSchemeStore.graphLoading}>
          <Graph
            renderChanged
            data={
              StateMachineSchemeStore.getNodeData && {
                vertex: StateMachineSchemeStore.getNodeData,
                edge: StateMachineSchemeStore.getTransferData,
              }
            }
          />
        </Spin>
      </Fragment>
    );
  }

  renderConnectStateMachineForm = () => {
    const { intl } = this.props;
    const { StateMachineSchemeStore } = this.props;
    const allIssueType = StateMachineSchemeStore.getAllIssueType;
    const columns = [
      {
        title: intl.formatMessage({
          id: 'stateMachineScheme.connectIssueType',
        }),
        key: 'connectIssueType',
        render: record => (
          <Fragment>
            <Icon type={record.icon} className="issue-scheme-icon" />
            {record.name}
          </Fragment>
        ),
      },
      {
        title: intl.formatMessage({
          id: 'stateMachineScheme.connectedStateMachine'
        }),
        key: 'connectedStateMachine',
        render: (text, record) => record.stateMachineSchemeConfigDTO && record.stateMachineSchemeConfigDTO.stateMachineName,
      },
      {
        title: '',
        align: 'right',
        key: 'warning',
        render: (text, record) => record.stateMachineSchemeConfigDTO && (
          <Popover
            content={
              <FormattedMessage id="stateMachineScheme.conflictInfo" />
            }
            placement="topLeft"
            overlayClassName="conflct-info"
            arrowPointAtCenter
          >
            <Icon type="warning" style={{ color: '#FADB14' }} />
          </Popover>
        ),
      },
    ];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.handleRowSelectChange(selectedRowKeys, selectedRows);
      },
      getCheckboxProps: record => ({
        defaultChecked: StateMachineSchemeStore.getSelectedIssueTypeId.length !== 0 && StateMachineSchemeStore.getSelectedIssueTypeId.includes(record.id),
      }),
    };
    return (
      <Form>
        <FormItem {...formItemLayout}>
          <Table
            dataSource={allIssueType}
            columns={columns}
            rowKey={record => record.id}
            rowSelection={rowSelection}
            filterBar={false}
            className="issue-table"
            rowClassName={`${prefixCls}-table-col`}
          />
        </FormItem>
      </Form>
    );
  }

  getColumns = () => [
    {
      title: <FormattedMessage id="stateMachineScheme.stateMachine" />,
      // dataIndex: "stateMachine",
      key: 'stateMachine',
      className: 'issue-table-ellipsis',
      render: record => (
        record.stateMachineDTO.length !== 0 && (
          <Fragment>{record.stateMachineDTO.name}</Fragment>
        )
      ),
    },
    {
      title: <FormattedMessage id="stateMachineScheme.issueType" />,
      key: 'issueType',
      align: 'left',
      render: record => (
        <div>
          {record.issueTypeDTOs.length !== 0 && record.issueTypeDTOs
            .map(type => (
              <div key={type.id}>
                <Icon type={type.icon} className="issue-scheme-icon" />
                &nbsp;
                {type.name}
              </div>
            ))}
        </div>
      ),
    },
    {
      align: 'right',
      title: '',
      key: 'operation',
      render: record => (
        <Fragment>
          <Button
            shape="circle"
            size="small"
            onClick={this.handleEditStateMachine.bind(
              this,
              record.stateMachineDTO.id,
            )}
          >
            <Icon type="mode_edit" />
          </Button>
          <Button
            shape="circle"
            size="small"
            onClick={this.handleDelete.bind(
              this,
              record.stateMachineDTO.id,
              record.stateMachineDTO.name,
            )}
          >
            <Icon type="delete" />
          </Button>
        </Fragment>
      ),
    },
  ];

  render() {
    const menu = AppState.currentMenuType;
    const { type, id: projectId, organizationId: orgId, name } = menu;
    const { intl, StateMachineSchemeStore } = this.props;
    const {
      getStateMachine,
      getIsLoading,
      getStateMachineLoading,
      getIsAddVisible,
      getIsConnectVisible,
    } = StateMachineSchemeStore;

    return (
      <Page>
        <Header
          title={<FormattedMessage id="stateMachineScheme.edit" />}
          backPath={`/issue/state-machine-schemes?type=${type}&id=${projectId}&name=${encodeURIComponent(name)}&organizationId=${orgId}`}
        >
          <Button onClick={this.loadAllData} funcType="flat">
            <i className="icon-refresh icon" />
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content
          title={<FormattedMessage id="stateMachineScheme.manage" />}
          description={
            <p>{intl.formatMessage({ id: 'stateMachineScheme.manageDes' })}</p>
          }
        >
          <Button
            type="primary"
            onClick={this.handleAddStateMachine}
            funcType="raised"
            style={{ marginBottom: 11 }}
          >
            <FormattedMessage id="stateMachineScheme.add" />
          </Button>
          <Table
            loading={getStateMachineLoading}
            columns={this.getColumns()}
            dataSource={getStateMachine}
            rowKey={record => record.id
            }
            className="issue-table"
            rowClassName={`${prefixCls}-table-col`}
          />
          <Modal
            title={<FormattedMessage id="stateMachineScheme.delete" />}
            visible={
              this.props.StateMachineSchemeStore.getIsMachineDeleteVisible
            }
            onOk={this.confirmDelete.bind(this, this.state.deleteId)}
            onCancel={this.cancelDelete}
            center
          >
            <p>
              {
                <Fragment>
                  {intl.formatMessage({
                    id: "stateMachineScheme.deleteDesBefore"
                  })}
                  <strong>{this.state.deleteItemName}</strong>
                  {intl.formatMessage({
                    id: "stateMachineScheme.deleteDesAfter"
                  })}
                </Fragment>
              }
            </p>
          </Modal>
          {getIsAddVisible && (
            <Sidebar
              title={<FormattedMessage id="stateMachineScheme.add" />}
              visible={getIsAddVisible}
              onCancel={this.handleCancleAddStateMachine}
              okText={<FormattedMessage id="stateMachineScheme.next" />}
              onOk={this.handleNextStep}
            >
              {this.renderAddStateMachineForm()}
            </Sidebar>
          )}
          {getIsConnectVisible && (
            <Sidebar
              title={<FormattedMessage id="stateMachineScheme.connect" />}
              visible={getIsConnectVisible}
              footer={
                <Fragment>
                  {this.props.StateMachineSchemeStore.getSelectedIssueTypeId &&
                    this.props.StateMachineSchemeStore.getSelectedIssueTypeId
                      .length === 0 && (
                      <Button
                        key="pre"
                        type="primary"
                        onClick={this.handlePreStep}
                      >
                        {<FormattedMessage id="stateMachineScheme.pre" />}
                      </Button>
                    )}

                  <Button
                    key="finish"
                    type="primary"
                    funcType="raised"
                    onClick={this.handleFinish}
                  >
                    {<FormattedMessage id="stateMachineScheme.finish" />}
                  </Button>

                  <Button
                    key="cancel"
                    funcType="raised"
                    onClick={this.handleCloseConnectStateMachine}
                  >
                    {<FormattedMessage id="stateMachineScheme.cancel" />}
                  </Button>
                </Fragment>
              }
            >
              {this.renderConnectStateMachineForm()}
            </Sidebar>
          )}
        </Content>
      </Page>
    );
  }
}

export default Form.create({})(withRouter(injectIntl(EditStateMachineScheme)));
