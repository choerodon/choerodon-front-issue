import { observable, action, computed } from 'mobx';
import { axios, store } from 'choerodon-front-boot';
import querystring from 'query-string';

@store('StateStore')
class StateStore {
  @observable stageOptionsData = [];
  @observable stateList = [];
  @observable isLoading = false;

  @action setStageOptionsData() {
    this.stageOptionsData = [{
      id: '0',
      code: 'todo',
      name: '待处理',
    }, {
      id: '1',
      code: 'doing',
      name: '处理中',
    }, {
      id: '2',
      code: 'done',
      name: '完成',
    }, {
      id: '3',
      code: 'none',
      name: '无阶段',
    }];
  }

  @computed get getStageOptionsData() {
    this.setStageOptionsData();
    return this.stageOptionsData.slice();
  }

  @computed get getStateList() {
    return this.stateList;
  }

  @action setStateList(data) {
    this.stateList = data;
  }

  @computed get getIsLoading() {
    return this.isLoading;
  }

  @action setIsLoading(loading) {
    this.isLoading = loading;
  }

  loadStateList = (orgId, sort = { field: 'id', order: 'desc' }, map = {}) => {
    this.setIsLoading(true);
    return axios.get(`/statemachine/v1/organizations/${orgId}/state?${querystring.stringify(map)}&sort=${sort.field},${sort.order}`).then((data) => {
      this.setStateList(data.content);
      if (data && data.failed) {
        Choerodon.prompt(res.message);
        return Promise.reject(data);
      } else {
        this.setIsLoading(false);
        return Promise.resolve(data);
      }
    }).catch(() => {
      return Promise.reject
    });
  }

  loadStateById = (orgId, stateId) => axios.get(`/statemachine/v1/organizations/${orgId}/state/${stateId}`);

  createState = (orgId, map) => axios.post(`/statemachine/v1/organizations/${orgId}/state`, JSON.stringify(map));

  deleteState = (orgId, stateId) => axios.delete(`/statemachine/v1/organizations/${orgId}/state/${stateId}`);

  updateState = (orgId, stateId, map) => axios.put(`/statemachine/v1/organizations/${orgId}/state/${stateId}`, JSON.stringify(map));

  loadAllState = orgId => axios.get(`/statemachine/v1/organizations/${orgId}/state/selectAll`);
}

const stateStore = new StateStore();
export default stateStore;
