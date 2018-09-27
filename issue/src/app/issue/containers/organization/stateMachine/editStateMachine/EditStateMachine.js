import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Table, Button, Modal, Form, Select, Input, Tooltip, Tabs, Checkbox, Popconfirm, Spin } from 'choerodon-ui';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Content, Header, Page, Permission, stores } from 'choerodon-front-boot';
import _ from 'lodash';
import Graph from '../../../../components/Graph';
import StateStore from '../../../../stores/organization/state';
import '../../../main.scss';
import './EditStateMachine.scss';

const prefixCls = 'cloopm-state-machine';
const { AppState } = stores;

const Sidebar = Modal.Sidebar;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

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
class EditStateMachine extends Component {
  constructor(props) {
    const menu = AppState.currentMenuType;
    super(props);
    const { id } = this.props.match.params;
    this.state = {
      page: 0,
      pageSize: 10,
      id,
      projectId: menu.id,
      organizationId: menu.organizationId,
      openRemove: false,
      show: false,
      submitting: false,
      stateMachineData: {},
      stateList: [],
      source: false,
      target: false,
      enable: true,
      loading: false,
    };
    this.graph = null;
  }

  componentDidMount() {
    this.loadStateMachine();
  }

  getColumn = () => {
    const { transferData, nodeData } = this.state;
    return (
      [{
        title: <FormattedMessage id="stateMachine.state" />,
        dataIndex: 'stateDTO',
        key: 'stateDTO',
        width: 300,
        render: text => text && (
          <div className={`${prefixCls}-text-node`}>{text.name}</div>
        ),
      }, {
        title: <FormattedMessage id="stateMachine.transfer" />,
        dataIndex: 'id',
        key: 'id',
        render: (id) => {
          const { nodeTransfer = {} } = this.state;
          return (
            <React.Fragment>
              {transferData && transferData.map(item => item.startNodeId === id && (
                <div className={`${prefixCls}-text-transfer-item`} key={item.id}>
                  {`${item.name}  >>>`} {
                    nodeData && nodeData.map(node => node.id === item.endNodeId && (
                      <div className={`${prefixCls}-text-node`} key={`${item.id}-${node.id}`}>
                        {node.stateDTO && node.stateDTO.name}
                      </div>
                    ))
                  }
                </div>
              ))}
            </React.Fragment>
          );
        },
      }, {
        align: 'right',
        width: 104,
        key: 'action',
        render: (test, record) => (
          <div>
            <Tooltip placement="top" title={<FormattedMessage id="stateMachine.transfer.add" />}>
              <Button shape="circle" size={'small'} onClick={this.textTransferAdd.bind(this, record.id)}>
                <span className="icon icon-add" />
              </Button>
            </Tooltip>
            <Tooltip placement="top" title={<FormattedMessage id="delete" />}>
              <Button shape="circle" size={'small'} onClick={this.textTransferDel.bind(this, record.id)}>
                <span className="icon icon-delete" />
              </Button>
            </Tooltip>
            <Permission service={['devops-service.application.update']} >
              <Tooltip placement="bottom" title={<div>{!record.synchro ? <FormattedMessage id="app.synch" /> : <React.Fragment>{record.active ? <FormattedMessage id="edit" /> : <FormattedMessage id="app.start" />}</React.Fragment>}</div>}>
                <span />
              </Tooltip>
            </Permission>
          </div>
        ),
      }]
    );
  }

  getFormContent = () => {
    const {
      type,
      state,
      stateData,
      stateList,
      stateMachineData,
      singleData,
      nodeData,
      source,
      target,
      selectedCell,
    } = this.state;
    const { form, intl } = this.props;
    const { getFieldDecorator } = form;
    if (type === 'state') {
      return (
        <div className="cloopm-region">
          <Form layout="vertical" className="cloopm-sidebar-form">
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator('state', {
                rules: [{
                  required: true,
                  message: intl.formatMessage({ id: 'required' }),
                }],
              })(
                <Select
                  style={{ width: 520 }}
                  label={<FormattedMessage id="state.title" />}
                  dropdownMatchSelectWidth
                  size="default"
                  labelInValue
                >
                  {stateList && stateList.length > 0 && stateList.map(s => (
                    <Option
                      value={s.id}
                      key={s.toString()}
                    >
                      <span id={s.id} name={s.name} style={{ display: 'inline-block', width: '100%' }}>{s.name}</span>
                    </Option>
                  ))}
                </Select>,

              )}
            </FormItem>
            <span onClick={this.handleCreateState} role="none" className={`${prefixCls}-state-create`}>添加新状态</span>
          </Form>
        </div>
      );
    } else {
      return (
        <div className="cloopm-region">
          <Form layout="vertical" className="cloopm-sidebar-form">
            <React.Fragment>
              <FormItem
                {...formItemLayout}
              >
                {getFieldDecorator('startNodeId', {
                  rules: [{
                    required: true,
                    message: intl.formatMessage({ id: 'required' }),
                  }],
                  initialValue: source ? source.stateId.toString() : '',
                })(
                  <Select
                    style={{ width: 520 }}
                    label={<FormattedMessage id="stateMachine.transfer.source" />}
                    dropdownMatchSelectWidth
                    size="default"
                    disabled={source !== false}
                  >
                    {nodeData &&
                      nodeData.length > 0 &&
                      nodeData.map(dto => dto.stateDTO && (
                        <Option
                          value={dto.stateDTO.id.toString()}
                          key={dto.stateDTO.toString()}
                        >
                          <span id={dto.id} name={dto.stateDTO.name} style={{ display: 'inline-block', width: '100%' }}>{dto.stateDTO.name}</span>
                        </Option>
                      ))}
                  </Select>,

                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
              >
                {getFieldDecorator('endNodeId', {
                  rules: [{
                    required: true,
                    message: intl.formatMessage({ id: 'required' }),
                  }],
                  initialValue: target ? target.stateId.toString() : '',
                })(
                  <Select
                    style={{ width: 520 }}
                    label={<FormattedMessage id="stateMachine.transfer.target" />}
                    dropdownMatchSelectWidth
                    size="default"
                    disabled={target !== false}
                  >
                    {nodeData &&
                      nodeData.length > 0 &&
                      nodeData.map(dto => dto.stateDTO && (
                        <Option
                          value={dto.stateDTO.id.toString()}
                          key={dto.stateDTO.toString()}
                        >
                          <span id={dto.stateDTO.id} name={dto.stateDTO.name} style={{ display: 'inline-block', width: '100%' }}>{dto.stateDTO.name}</span>
                        </Option>
                      ))}
                  </Select>,

                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                className="cloopm-sidebar-form"
              >
                {getFieldDecorator('name', {
                  rules: [{
                    required: true,
                    message: intl.formatMessage({ id: 'required' }),
                  }],
                  initialValue: selectedCell && selectedCell.edge ? selectedCell.value : '',
                })(
                  <Input
                    style={{ width: 520 }}
                    label={<FormattedMessage id="stateMachine.transfer.name" />}
                  />,
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                className="cloopm-sidebar-form"
              >
                {getFieldDecorator('description', {
                  initialValue: selectedCell && selectedCell.edge ? selectedCell.des : '',
                })(
                  <TextArea
                    style={{ width: 520 }}
                    label={<FormattedMessage id="stateMachine.transfer.des" />}
                  />,
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
              >
                {getFieldDecorator('page', {
                  initialValue: stateData ? { key: stateData.id } : [],
                })(
                  <Select
                    style={{ width: 520 }}
                    label={<FormattedMessage id="stateMachine.transfer.page" />}
                    dropdownMatchSelectWidth
                    size="default"
                    labelInValue
                  >
                    {nodeData &&
                      nodeData.length > 0 &&
                      nodeData.map((dto) => {
                        if (dto.stateDTO) {
                          return (
                            <Option
                              value={dto.stateDTO.id.toString()}
                              key={dto.stateDTO.toString()}
                            >
                              <span id={dto.stateDTO.id} name={dto.stateDTO.name} style={{ display: 'inline-block', width: '100%' }}>{dto.stateDTO.name}</span>
                            </Option>
                          );
                        }
                        return null;
                      })}
                  </Select>,

                )}
              </FormItem>
            </React.Fragment>
          </Form>
        </div>
      );
    }
  }

  getCreateForm = () => {
    const { form, intl } = this.props;
    const { getFieldDecorator } = form;
    const { getStageOptionsData } = StateStore;
    return (<div className="cloopm-region">
      <Form layout="vertical" className="cloopm-sidebar-form">
        <FormItem
          {...formItemLayout}
        >
          {getFieldDecorator('name', {
            rules: [{
              required: true,
              whitespace: true,
              max: 47,
              message: intl.formatMessage({ id: 'state.name.required' }),
            }],
          })(
            <Input
              style={{ width: 520 }}
              autoFocus
              label={<FormattedMessage id="state.name" />}
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
              label={<FormattedMessage id="state.des" />}
            />,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
        >
          {getFieldDecorator('type', {
            rules: [{
              required: true,
              whitespace: true,
              message: intl.formatMessage({ id: 'required' }),
            }],
          })(
            <Select
              style={{ width: 520 }}
              label={<FormattedMessage id="state.stage" />}
              dropdownMatchSelectWidth
              size="default"
            >
              {getStageOptionsData && getStageOptionsData.length > 0 && getStageOptionsData
                .map(s => (
                  <Option
                    value={s.id}
                    key={s.id}
                  >
                    <span style={{ display: 'inline-block', width: '100%' }}>{s.name}</span>
                  </Option>
                ))}
            </Select>,

          )}
        </FormItem>
        <div className="cloopm-state-tips-wrapper">
          <div className="cloopm-state-tips">帮助识别问题所处的生命周期的某个阶段</div>
          <div className="cloopm-state-tips">开始处理问题时，从 <span>待处理</span> 到 <span>处理中</span> ，随后，当完成所有工作时，进入到 <span>完成</span> 阶段。</div>
        </div>
      </Form>
    </div>);
  }

  setGraphRef = (graph) => {
    this.graph = graph;
  }

  handleCreateState = () => {
    this.setState({
      createShow: true,
      show: false,
    });
  }

  loadStateMachine = () => {
    const { StateMachineStore } = this.props;
    const { organizationId, id } = this.state;
    StateMachineStore.loadStateMachineById(organizationId, id)
      .then((data) => {
        if (data && data.failed) {
          Choerodon.prompt(data.message);
        } else {
          const nodeData = data.nodeDTOs;
          const transferData = data.transfDTOs;
          this.setState({
            stateMachineData: data,
            transferData,
            nodeData,
          });
        }
      });
  }

  refresh = () => {
    this.loadStateMachine();
  }

  loadStateList = () => {
    const { organizationId, stateMachineData, nodeData } = this.state;
    StateStore.loadAllState(organizationId).then((data) => {
      if (data && data.failed) {
        Choerodon.prompt(data.message);
      } else {
        const stateList = _.differenceWith(data,
          nodeData,
          (dataItem, nodeItem) => nodeItem.stateDTO && dataItem.id === nodeItem.stateDTO.id);
        this.setState({
          stateList,
        });
      }
    });
  }

  addStateMachineNode = (data) => {
    const { organizationId, stateMachineData } = this.state;
    const { StateMachineStore } = this.props;
    const node = {
      height: 50,
      positionX: 150,
      positionY: 0,
      stateId: data.state.key,
      stateMachineId: stateMachineData.id,
      width: 100,
    };
    this.setState({
      isLoading: true,
    });
    StateMachineStore.addStateMachineNode(organizationId, node)
      .then((nodeData) => {
        if (nodeData && nodeData.failed) {
          Choerodon.prompt(nodeData.message);
        } else if (nodeData && nodeData.length) {
          const cell = _.find(nodeData, item => item.stateId === data.state.key);
          if (cell) {
            this.graph.createStatus(cell);
          }
        }
        this.setState({
          show: false,
          isLoading: false,
          nodeData,
        });
      });
  }

  updateStateMachineNode = (data) => {
    const { organizationId, stateMachineData } = this.state;
    const { StateMachineStore } = this.props;
    this.setState({
      isLoading: true,
    });
    return StateMachineStore.updateStateMachineNode(organizationId, data.id, data);
  }

  addStateMachineTransfer = (data) => {
    const { organizationId, stateMachineData, transferData } = this.state;
    const { StateMachineStore } = this.props;
    const node = {
      ...data,
      // startNodeId: source.id,
      // endNodeId: target.id,
      stateMachineId: stateMachineData.id,
      page: null,
    };
    this.setState({
      isLoading: true,
    });
    StateMachineStore.addStateMachineTransfer(organizationId, node)
      .then((item) => {
        if (item && item.failed) {
          Choerodon.prompt(item.message);
        } else {
          this.graph.createTransition(item, item.startNodeId, item.endNodeId);
          transferData.push(item);
          this.setState({
            show: false,
            transferData,
            isLoading: false,
          });
        }
      });
  }

  updateStateMachineTransfer = (data) => {
    const { organizationId, stateMachineData, source, target, selectedCell } = this.state;
    const { StateMachineStore } = this.props;
    this.setState({
      isLoading: true,
    });
    return StateMachineStore.updateStateMachineTransfer(organizationId, data.id, data);
  }

  // DOUBLE CLICK NODE or TRANSFER
  handleDbClick = (cell, type) => {
    this.setState({
      selectedCell: cell,
    });
    if (type === 'transfer') {
      this.setState({
        source: cell.source,
        target: cell.target,
      });
    }
    this.showSideBar(type, 'edit');
  }

  // ON DRAG NODE, UPDATE NODE'S POSITION
  handleOnMove = (cell) => {
    const { nodeData } = this.state;
    if (nodeData && nodeData.length) {
      const node = _.find(nodeData, item => item.id.toString() === cell.id.toString());
      if (node) {
        const data = {
          ...node,
          positionX: cell.geometry.x,
          positionY: cell.geometry.y,
        };
        this.updateStateMachineNode(data)
          .then((nodes) => {
            if (nodes && nodes.failed) {
              Choerodon.prompt(nodes.message);
            } else {
              this.setState({
                show: false,
                nodeData: nodes,
                isLoading: false,
              });
            }
          });
      }
    }
  }

  handleReLink = (edge, style) => {
    const transferId = edge.transferId;
    const { transferData } = this.state;
    // GET INDEX OF SELECTED TRANSFER IN TRANSFER DATA
    const index = _.findIndex(transferData,
      item => item.id.toString() === (edge.transferId && edge.transferId.toString()));
    if (index > -1) {
      const param = {
        ...transferData[index],
        startNodeId: edge.source.id,
        endNodeId: edge.target.id,
        page: null,
        style,
      };
      this.updateStateMachineTransfer(param)
        .then((item) => {
          // edge.setValue(item.name);
          // selectedCell.des = item.description;
          // this.graph.refresh();
          if (item && item.failed) {
            Choerodon.prompt(item.message);
          } else {
            transferData[index] = item;
            this.setState({
              show: false,
              isLoading: false,
              transferData,
            });
          }
        });
    }
  }

  handleCellClick = (cell) => {
    if ((cell && cell.stateId !== 0) || !cell) {
      this.setState({
        selectedCell: cell,
      });
    }
  }

  // DISPLAY TRANSFER NAME or NO
  handleCheckChange = (e) => {
    this.graph.handleCheckChange(e);
  }


  handleSubmit = () => {
    const { StateMachineStore } = this.props;
    const {
      state,
      type,
      editState,
      page,
      pageSize,
      sorter,
      tableParam,
      organizationId,
      selectedCell,
      edgeStyle,
    } = this.state;

    this.props.form.validateFieldsAndScroll((err, data) => {
      if (!err) {
        if (type === 'state') {
          const { name } = data.state.label.props;
          if (state === 'add') {
            this.addStateMachineNode(data);
          } else {
            const { nodeData } = this.state;
            if (nodeData && nodeData.length) {
              // GET NODE DATA
              const node = _.find(nodeData, item => item.id.toString() === selectedCell.id.toString());
              if (node) {
                // UPDATE STATEID OF NODE DATA
                const param = {
                  ...node,
                  stateId: data.state.key,
                };
                this.updateStateMachineNode(param)
                  .then((nodes) => {
                    if (nodes && nodes.failed) {
                      Choerodon.prompt(nodes.message);
                    } else {
                      selectedCell.setValue(name);
                      selectedCell.stateId = data.state.key;
                      this.graph.refresh();
                      this.setState({
                        selectedCell,
                        show: false,
                        nodeData: nodes,
                        isLoading: false,
                      });
                    }
                  });
              }
            }
          }
        } else if (type === 'transfer') {
          if (state === 'add') {
            const { nodeData } = this.state;

            const source = _.find(nodeData, item => item.stateId.toString() === data.startNodeId);
            const target = _.find(nodeData, item => item.stateId.toString() === data.endNodeId);
            const param = {
              ...data,
              startNodeId: source.id,
              endNodeId: target.id,
              style: edgeStyle,
            };
            this.addStateMachineTransfer(param);
          } else {
            const { transferData } = this.state;
            // GET INDEX OF SELECTED TRANSFER IN TRANSFER DATA
            const index = _.findIndex(transferData,
              item => item.id.toString() === selectedCell.transferId.toString());
            const param = {
              ...transferData[index],
              name: data.name,
              description: data.description,
              page: null,
              style: edgeStyle,
            };
            this.updateStateMachineTransfer(param)
              .then((item) => {
                if (item && item.failed) {
                  Choerodon.prompt(item.message);
                } else {
                  selectedCell.setValue(item.name);
                  selectedCell.des = item.description;
                  this.graph.refresh();
                  transferData[index] = item;
                  this.setState({
                    show: false,
                    isLoading: false,
                    transferData,
                  });
                }
              });
          }
        }
      }
    });
  }

  // CREATE NEW TRANSFER BY LINKING
  handleOnTransfer = (source, target, style) => {
    this.setState({
      source,
      target,
      edgeStyle: style,
    });
    this.showSideBar('transfer', 'add');
  }

  removeCell = (cell) => {
    const { StateMachineStore } = this.props;
    const { selectedCell, organizationId, transferData } = this.state;
    this.setState({
      loading: true,
    });
    if (cell.vertex) {
      StateMachineStore.deleteStateMachineNode(organizationId, cell.id).then((data) => {
        this.setState({
          loading: false,
        });
        if (data && !data.failed) {
          this.graph.removeCells();
          this.setState({
            nodeData: data,
            selectedCell: null,
          });
        }
      });
    } else {
      StateMachineStore.deleteStateMachineTransfer(organizationId, cell.transferId)
        .then((data) => {
          this.setState({
            loading: false,
          });
          if (data && !data.failed) {
            if (cell) {
              this.graph.removeCells([cell], true);
            } else {
              this.graph.removeCells();
            }
            _.remove(transferData,
              item => item.id.toString() === cell.transferId.toString());
            this.handleCancel();
            this.setState({
              selectedCell: null,
              transferData,
            });
          }
        });
    }
  }

  textTransferDel = (id) => {
    const { transferData } = this.state;
    const transfes = _.filter(transferData, item => item.startNodeId === id && item.status !== '2');
    this.setState({
      deleteList: transfes,
      deleteVisible: true,
      deleteId: id,
    });
  }

  textTransferAdd = (id) => {
    const { nodeData } = this.state;
    const source = _.find(nodeData, item => item.id === id);
    if (source) {
      this.setState({
        source,
        target: false,
      }, () => {
        this.showSideBar('transfer', 'add');
      });
    }
  }

  handleCancel = () => {
    this.setState({
      deleteList: null,
      deleteVisible: false,
      deleteId: null,
    });
  }
  handleDeleteTransfer = () => {
    const { selectedDeleteId } = this.state;
    const cell = this.graph.getCell(`t${selectedDeleteId}`);
    this.setState({
      selectedCell: cell,
    }, () => {
      this.removeCell(cell);
    });
  }

  toolbarAdd = (type) => {
    this.setState({
      selectedCell: null,
      source: false,
      target: false,
    }, () => {
      this.showSideBar(type, 'add');
    });
  }

  handleCardEdit = (cell) => {
    if (cell) {
      const type = cell.edge ? 'transfer' : 'state';
      this.handleDbClick(cell, type);
    }
  }

  showSideBar = (type, state) => {
    this.setState({
      show: true,
      type,
      state,
    });
    if (type === 'state') {
      this.loadStateList();
    }
  }

  hideSidebar = () => {
    this.setState({
      show: false,
      // type: '',
    });
  }

  hideCreateSidebar = () => {
    this.setState({
      createShow: false,
      show: true,
    });
  }

  handleConfig = (cell) => {
    const { intl, history } = this.props;
    const { name, id, organizationId } = AppState.currentMenuType;
    const { stateMachineData } = this.state;
    const configId = cell.transferId;
    history.push(`/issue/state-machines/${stateMachineData.id}/editconfig/${configId}?type=organization&id=${id}&name=${encodeURIComponent(name)}&organizationId=${organizationId}`);
  }

  handlePublish = () => {
    const { stateMachineData } = this.state;
    const { StateMachineStore } = this.props;
    const { name, id, organizationId } = AppState.currentMenuType;

    StateMachineStore.publishStateMachine(organizationId, stateMachineData.id).then((data) => {
      if (data) {
        this.setState({
          stateMachineData: data,
        });
        Choerodon.prompt('发布成功');
      }
    });
  }

  handlecreateSubmit = () => {
    const { organizationId } = this.state;

    this.props.form.validateFieldsAndScroll((err, data) => {
      if (!err) {
        const postData = data;
        postData.organizationId = organizationId;
        this.setState({
          submitting: true,
        });
        StateStore.createState(organizationId, postData)
          .then((res) => {
            if (res && res.failed) {
              Choerodon.prompt(res.message);
            } else {
              this.loadStateList();
              this.setState({ createShow: false, show: true });
            }
            this.setState({
              submitting: false,
            });
          }).catch((error) => {
            Choerodon.prompt(error.response.data.message);
            this.setState({
              submitting: false,
            });
          });
      }
    });
  }

  render() {
    const { StateMachineStore, intl } = this.props;
    const {
      stateMachineData,
      stateData,
      stateList,
      selectedCell,
      nodeData,
      loading,
      transferData,
    } = this.state;
    const dataSource = nodeData && nodeData.slice();
    _.remove(dataSource, item => item.stateId === 0);
    const { getFieldDecorator } = this.props.form;
    const serviceData = StateMachineStore.getAllData;
    const { singleData, getStageOptionsData } = StateMachineStore;
    const menu = AppState.currentMenuType;
    const { type, id: projectId, organizationId: orgId, name } = menu;
    const graphHeader = (
      <React.Fragment>
        <Button onClick={() => this.toolbarAdd('state')} className="graph-toolbar-button" icon="add"><FormattedMessage id="stateMachine.state.add" /></Button>
        <Button onClick={() => this.toolbarAdd('transfer')} className="graph-toolbar-button" icon="add"><FormattedMessage id="stateMachine.transfer.add" /></Button>
        <Checkbox defaultChecked onClick={this.handleCheckChange} className="graph-toolbar-checkbox"><FormattedMessage id="stateMachine.transfer.display" /></Checkbox>
      </React.Fragment>
    );
    const graphExtra = (
      <div className="graph-card">
        <div className="graph-card-title">{selectedCell && selectedCell.value}
        </div>
        <div className="graph-card-des"><FormattedMessage id="stateMachine.des" />: {selectedCell && selectedCell.des}{selectedCell && selectedCell.id}</div>
        {selectedCell && selectedCell.edge ? (
          <React.Fragment>
            <div>
              <a><FormattedMessage id="stateMachine.condition" /></a>
            </div>
            <div>
              <a><FormattedMessage id="stateMachine.verification" /></a>
            </div>
            <div>
              <a><FormattedMessage id="stateMachine.processor" /></a>
            </div>
            <div className="graph-card-toolbar">
              <Button
                className="graph-card-btn"
                funcType="flat"
                onClick={() => this.handleCardEdit(this.state.selectedCell)}
              ><FormattedMessage id="edit" /></Button>
              <Button
                className="graph-card-btn"
                funcType="raised"
                type="primary"
                onClick={() => this.handleConfig(this.state.selectedCell)}
              ><FormattedMessage id="stateMachine.config" /></Button>
              <Popconfirm title={<FormattedMessage id="pageScheme.related.deleteTip" />} onConfirm={() => this.removeCell(this.state.selectedCell)}>
                <Button
                  disabled={selectedCell && selectedCell.status !== '0'}
                  className="graph-card-btn"
                  funcType="raised"
                >
                  <FormattedMessage id={`stateMachine.${selectedCell && selectedCell.vertex ? 'state' : 'transfer'}.delete`} />
                </Button>
              </Popconfirm>
            </div>
          </React.Fragment>
        )
          : (
            <Popconfirm title={<FormattedMessage id="pageScheme.related.deleteTip" />} onConfirm={() => this.removeCell(this.state.selectedCell)}>
              <Button
                disabled={selectedCell && selectedCell.status !== '0'}
                className="graph-card-btn"
                funcType="raised"
              >
                <FormattedMessage id={`stateMachine.${selectedCell && selectedCell.vertex ? 'state' : 'transfer'}.delete`} />
              </Button>
            </Popconfirm>
          )}
      </div>);

    const rowSelection = {
      getCheckboxProps: record => ({
        defaultChecked: record.id === 119,
      }),
    };
    return (
      <Page>
        <Header
          title={<FormattedMessage id="stateMachine.edit" />}
          backPath={`/issue/state-machines?type=${type}&id=${projectId}&name=${encodeURIComponent(name)}&organizationId=${orgId}`}
        >
          <Button
            onClick={this.refresh}
            funcType="flat"
          >
            <i className="icon-refresh icon" />
            <FormattedMessage id="refresh" />
          </Button>
        </Header>
        <Content>
          <div className={`${prefixCls}-header`}>
            {stateMachineData && stateMachineData.status === '1' && (
              <Button onClick={() => this.setState({ enable: true })}>wwww</Button>
            )}
            {stateMachineData && (stateMachineData.status === '0' || stateMachineData.status === '2') && (
              <div className={`${prefixCls}-header-tip`}>
                <span className="icon icon-warning" />
                <div className={`${prefixCls}-header-tip-text`}>
                  注意：此状态机正在被使用。你正在编辑 状态机草稿 ，如果修改后的草稿需要生效，请点击 发布 。删除草稿 后草稿备份为现在正在使用的状态机。
                </div>
                <div className={`${prefixCls}-header-tip-action`}>
                  <Button onClick={this.handlePublish} type="primary" funcType="raised" >发布</Button>
                  <Button funcType="raised" className="delete" >删除状态</Button>
                </div>
              </div>
            )}
            <div className={`${prefixCls}-header-name`}>
              {stateMachineData.name}
              {stateMachineData && stateMachineData.status === '2' && <span>草稿</span>}
            </div>
            <div className={`${prefixCls}-header-des`}>{stateMachineData.description}</div>
          </div>
          <Tabs defaultActiveKey="graph">
            <TabPane tab={<FormattedMessage id="stateMachine.tab.graph" />} key="graph">
              {nodeData && nodeData.length && (
                <Spin spinning={loading}>
                  <Graph
                    setRef={this.setGraphRef}
                    onLink={this.handleOnTransfer}
                    header={graphHeader}
                    cellDblClick={this.handleDbClick}
                    extra={selectedCell && graphExtra}
                    cellClick={this.handleCellClick}
                    data={nodeData && { vertex: nodeData, edge: transferData }}
                    onMove={this.handleOnMove}
                    onReLink={this.handleReLink}
                    enable={this.state.enable}
                  />
                </Spin>
              )}
            </TabPane>
            <TabPane tab={<FormattedMessage id="stateMachine.tab.text" />} key="text">
              <div className={`${prefixCls}-tab-action-btn`}>
                <Button onClick={() => this.toolbarAdd('state')} funcType="flat" icon="add">
                  <FormattedMessage id="stateMachine.state.add" />
                </Button>
              </div>
              <Table
                dataSource={dataSource}
                columns={this.getColumn()}
                filterBarPlaceholder={intl.formatMessage({ id: 'filter' })}
                rowKey={record => record.id}
                loading={StateStore.getIsLoading}
                onChange={this.tableChange}
                filterBar={false}
                className="cloopm-table"
              />
            </TabPane>
          </Tabs>
        </Content>
        {this.state.show && <Sidebar
          title={<FormattedMessage id={this.state.type === 'create' ? 'stateMachine.create' : 'stateMachine.edit'} />}
          visible={this.state.show}
          onOk={this.handleSubmit}
          okText={<FormattedMessage id={this.state.type === 'create' ? 'create' : 'save'} />}
          cancelText={<FormattedMessage id="cancel" />}
          confirmLoading={this.state.isLoading}
          onCancel={this.hideSidebar}
        >
          {this.getFormContent()}
        </Sidebar>}
        {this.state.createShow && <Sidebar
          title={<FormattedMessage id="state.create" />}
          visible={this.state.createShow}
          onOk={this.handlecreateSubmit}
          okText={<FormattedMessage id={this.state.type === 'create' ? 'create' : 'save'} />}
          cancelText={<FormattedMessage id="cancel" />}
          confirmLoading={this.state.submitting}
          onCancel={this.hideCreateSidebar}
        >
          {this.getCreateForm()}
        </Sidebar>}
        {this.state.deleteVisible && (
          <Modal
            title={<FormattedMessage id="stateMachine.transfer.delete" />}
            visible={this.state.deleteVisible}
            onOk={this.handleDeleteTransfer}
            onCancel={this.handleCancel}
          >
            <div>请选择你需要删除的转换。</div>
            <Select
              label={<FormattedMessage id="stateMachine.transfer.delete.tip" />}
              style={{ width: '100%' }}
              dropdownMatchSelectWidth
              size="default"
              onChange={value => this.setState({ selectedDeleteId: value })}
            >
              {this.state.deleteList && this.state.deleteList.length && this.state.deleteList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
            </Select>
          </Modal>
        )}
      </Page>
    );
  }
}

export default Form.create({})(withRouter(injectIntl(EditStateMachine)));
