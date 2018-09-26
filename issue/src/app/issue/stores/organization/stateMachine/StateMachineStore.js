import { observable, action, computed } from 'mobx';
import { axios, store } from 'choerodon-front-boot';
import querystring from 'query-string';

@store('StateMachineStore')
class StateMachineStore {

  @observable isLoading = false;
  @observable stateMachine = {};

  @computed get getIsLoading() {
    return this.isLoading;
  }

  @computed get getStateMachine() {
    return this.stateMachine;
  }

  @action setIsLoading(loading) {
    this.isLoading = loading;
  }

  @action setStateMachine(data) {
    this.stateMachine = data;
  }

  loadStateMachineList = (orgId, sort = { field: 'id', order: 'desc' }, map = {}) => {
    this.setIsLoading(true);
    return axios.get(`/issue/v1/organizations/${orgId}/state_machine?${querystring.stringify(map)}&sort=${sort.field},${sort.order}`).then((data) => {
      // this.setStateList(data);
      this.setIsLoading(false);
      if (data && data.failed) {
        Choerdon.propmt(data.message);
      } else {
        return Promise.resolve(data);
      }
    });
  }


  loadStateMachineById = (orgId, stateId) => axios.get(`/statemachine/v1/organizations/${orgId}/state_machine/${stateId}`).then((data) => {
    const res = this.handleProptError(data);
    if (data) {
      this.setStateMachine(data);
    }
    return res;
  });

  createStateMachine = (orgId, map) => axios.post(`/statemachine/v1/organizations/${orgId}/state_machine`, JSON.stringify(map));

  deleteStateMachine = (orgId, stateId) => axios.delete(`/issue/v1/organizations/${orgId}/state_machine/${stateId}`)
    .then(data => this.handleProptError(data));

  updateStateMachine = (orgId, stateId, map) => axios.put(`/statemachine/v1/organizations/${orgId}/state_machine/${stateId}`, JSON.stringify(map));

  // 编辑状态机时添加状态
  addStateMachineNode = (orgId, map) => axios.post(`/statemachine/v1/organizations/${orgId}/state_machine_node`, JSON.stringify(map));

  updateStateMachineNode = (orgId, nodeId, map) => axios.put(`/statemachine/v1/organizations/${orgId}/state_machine_node/${nodeId}`, JSON.stringify(map));

  deleteStateMachineNode = (orgId, nodeId) => axios.delete(`/statemachine/v1/organizations/${orgId}/state_machine_node/${nodeId}`)

  addStateMachineTransfer = (orgId, map) => axios.post(`statemachine/v1/organizations/${orgId}/state_machine_transf`, JSON.stringify(map));

  updateStateMachineTransfer = (orgId, nodeId, map) => axios.put(`/statemachine/v1/organizations/${orgId}/state_machine_transf/${nodeId}`, JSON.stringify(map));

  deleteStateMachineTransfer = (orgId, nodeId) => axios.delete(`/statemachine/v1/organizations/${orgId}/state_machine_transf/${nodeId}`);

  getTransferById = (orgId, id) => axios.get(`/statemachine/v1/organizations/1${orgId}/state_machine_transf/getById/${id}`).then(data => this.handleProptError(data));

  getStateById = (orgId, id) => axios.get(`/statemachine/v1/organizations/${orgId}/state_machine_node/getById/${id}`).then(data => this.handleProptError(data));

  loadTransferConfigList = (orgId, id, type) => {
    this.setIsLoading(true);
    return axios.get(`/statemachine/v1/organizations/${orgId}/state_machine_config/queryConfig/${id}?type=${type}`)
      .then((data) => {
        this.setIsLoading(false);
        return this.handleProptError(data);
      });
  }

  addConfig = (orgId, stateMachineId, map) => axios.post(`/statemachine/v1/organizations/${orgId}/state_machine_config/${stateMachineId}`, JSON.stringify(map))
    .then(data => this.handleProptError(data));

  deleteConfig = (orgId, id) => axios.delete(`/statemachine/v1/organizations/${orgId}/state_machine_config/${id}`)
    .then(item => this.handleProptError(item));

  publishStateMachine = (orgId, id) => axios.get(`/statemachine/v1/organizations/${orgId}/state_machine/deploy/${id}`)
    .then(data => this.handleProptError(data));

  handleProptError = (error) => {
    if (error && error.failed) {
      Choerodon.prompt(error.message);
      return false;
    } else {
      return error;
    }
  }
}

const stateMachineStore = new StateMachineStore();
export default stateMachineStore;
