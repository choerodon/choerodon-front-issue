import { observable, action, computed } from "mobx";
import { axios, store } from "choerodon-front-boot";
import querystring from "query-string";

@store("StateMachineSchemeStore")
class StateMachineSchemeStore {
  @observable
  isLoading = false;
  @observable
  stateMachineLoading = false;
  @observable
  stateMachineSchemeList = [];
  @observable
  pagination = {
    current: 1,
    pageSize: 10
  };
  @observable
  isAddVisible = false;
  @observable
  graphLoading = false;
  @observable
  isConnectVisible = false;
  @observable
  isMachineDeleteVisible = false;
  @observable
  isSchemeDeleteVisible = false;
  @observable
  stateMachine = [];
  @observable
  allStateMachine = [];
  @observable
  allIssueType = [];
  @observable
  newStateMachineId = "";
  @observable
  schemeDTOs = [];
  @observable
  selectedIssueTypeId = [];
  @observable
  nodeData = [];
  @observable
  transferData = [];


  @action setGraphLoading(data) {
    this.graphLoading = data;
  }

  @computed
  get getGraphLoading() {
    return this.graphLoading;
  }

  @computed
  get getIsLoading() {
    return this.isLoading;
  }
  @action
  setIsLoading(loading) {
    this.isLoading = loading;
  }
  @computed
  get getStateMachineLoading() {
    return this.stateMachineLoading;
  }
  @action
  setStateMachineLoading(loading) {
    this.stateMachineLoading = loading;
  }

  @computed
  get getStateMachineSchemeList() {
    return this.stateMachineSchemeList.slice();
  }

  @action
  setStateMachineSchemeList(data) {
    this.stateMachineSchemeList = data;
  }

  @computed
  get getStateMachine() {
    return this.stateMachine.slice();
  }
  @action
  setStateMachine(data) {
    this.stateMachine = data;
  }
  @computed
  get getIsAddVisible() {
    return this.isAddVisible;
  }
  @action
  setIsAddVisible(visibleStatus) {
    this.isAddVisible = visibleStatus;
  }
  @computed
  get getIsConnectVisible() {
    return this.isConnectVisible;
  }
  @action
  setIsConnectVisible(visibleStatus) {
    this.isConnectVisible = visibleStatus;
  }
  @computed
  get getIsMachineDeleteVisible() {
    return this.isMachineDeleteVisible;
  }
  @action
  setIsMachineDeleteVisible(visibleStatus) {
    this.isMachineDeleteVisible = visibleStatus;
  }
  @computed
  get getIsSchemeDeleteVisible() {
    return this.isSchemeDeleteVisible;
  }
  @action
  setIsSchemeDeleteVisible(visibleStatus) {
    this.isSchemeDeleteVisible = visibleStatus;
  }
  @computed
  get getAllStateMachine() {
    return this.allStateMachine;
  }
  @action
  setAllStateMachine(data) {
    this.allStateMachine = data;
  }
  @computed
  get getAllIssueType() {
    return this.allIssueType;
  }
  @action
  setAllIssueType(data) {
    this.allIssueType = data;
  }
  @computed
  get getSchemeDTOs() {
    return this.schemeDTOs;
  }
  @action
  setSchemeDTOs(data) {
    this.schemeDTOs = data;
  }
  @computed
  get getNewStateMachineId() {
    return this.newStateMachineId;
  }
  @action
  setNewStateMachineId(data) {
    this.newStateMachineId = data;
  }
  @computed
  get getSelectedIssueTypeId() {
    return this.selectedIssueTypeId;
  }
  @action
  setSelectedIssueTypeId(data) {
    this.selectedIssueTypeId = data;
  }
  @computed
  get getNodeData() {
    return this.nodeData;
  }
  @action
  setNodeData(data) {
    this.nodeData = data;
  }
  @computed
  get getTransferData() {
    return this.transferData;
  }
  @action
  setTransferData(data) {
    this.transferData = data;
  }

  @action
  loadStateMachineSchemeList = (orgId, pagination = this.pagination, sort = { field: 'id', order: 'desc' }, map = {}) => {
    this.setIsLoading(true);
    const { current, pageSize } = pagination;
    return axios.get(`/issue/v1/organizations/${orgId}/state_machine_scheme?page=${current - 1}&size=${pageSize}&${querystring.stringify(map)}&sort=${sort.field},${sort.order}`)
      .then(
      action(data => {
        this.setIsLoading(false);
        if (data && data.failed) {
          return Promise.reject(data.message);
        } else {
          this.setStateMachineSchemeList(data.content);
          this.pagination = {
            ...pagination,
            total: data.totalElements
          };
          return Promise.resolve(data);
        }
      })
      )
      .catch(err => {
        this.setIsLoading(false);
        return Promise.reject(err);
      });
  };

  @action
  createStateMachineScheme = (stateMachineScheme, organizationId) => {
    axios
      .post(
      `/issue/v1/organizations/${organizationId}/state_machine_scheme`,
      JSON.stringify(stateMachineScheme)
      )
      .then(
      action(() => {
        this.loadStateMachineSchemeList(organizationId);
      })
      )
      .catch(() => {
        Choerodon.prompt("保存失败");
      });
  };

  @action
  loadStateMachine = (orgId, scheme_id, pagination = this.pagination) => {
    // const { current, pagination } = pagination;
    this.setStateMachineLoading(true);
    return axios
      .get(
      `/issue/v1/organizations/${orgId}/state_machine_scheme/${scheme_id}`
      // ?page=${current -
      //   1}&size=${pageSize}
      //   `
      )
      .then(
      action(data => {
        if (data && data.failed) {
          return Promise.reject(data.message);
        } else {
          this.setStateMachineLoading(false);
          this.setStateMachine(data.viewDTOs || []);
          // this.pagination = {
          //   ...pagination,
          //   total: data.totalElements
          // };
          return Promise.resolve(data);
        }
      })
      );
  };
  @action
  loadGraphData = (orgId, state_machine_id) => {
    this.setGraphLoading(true);
    axios
      .get(`/state/v1/organizations/${orgId}/state_machines/${state_machine_id}`)
      .then(res => {
        this.setGraphLoading(false);
        this.setNodeData(res.nodeDTOs);
        this.setTransferData(res.transfDTOs);
      })
      .catch((e) => {
        this.setGraphLoading(false);
      });
  };
  @action
  loadAllStateMachine = orgId => {
    return axios
      .get(`/state/v1/organizations/${orgId}/state_machines/query_all`)
      .then(
      action(res => {
        this.setAllStateMachine(res);
      })
      );
  };
  @action
  loadAllIssueType(orgId, scheme_id) {
    return axios
      .get(
      `/issue/v1/organizations/${orgId}/issue_type/query_issue_type/${scheme_id}`
      )
      .then(
      action(res => {
        this.setAllIssueType(res);
      })
      );
  }

  @action
  saveStateMachine(orgId, scheme_id, state_machine_id, schemeDTOs) {
    return axios
      .post(
      `/issue/v1/organizations/${orgId}/state_machine_scheme/create_config/${scheme_id}/${state_machine_id}`,
      schemeDTOs
      )
      .then(
      action(() => {
        this.loadStateMachine(orgId, scheme_id);
      })
      );
  }
  @action
  deleteStateMachine(orgId, scheme_id, state_machine_id) {
    return axios
      .delete(
      `/issue/v1/organizations/${orgId}/state_machine_scheme/delete_config/${scheme_id}/${state_machine_id}`
      )
      .then(
      action(() => {
        this.loadStateMachine(orgId, scheme_id);
      })
      );
  }

  @action
  deleteStateMachineScheme = (orgId, scheme_id) => axios.delete(`/issue/v1/organizations/${orgId}/state_machine_scheme/${scheme_id}`)
    .then(data => this.handleProptError(data));

  handleProptError = (error) => {
    if (error && error.failed) {
      // Choerodon.prompt(error.message);
      return false;
    } else {
      return error;
    }
  }
}

const stateMachineSchemeStore = new StateMachineSchemeStore();

export default stateMachineSchemeStore;
