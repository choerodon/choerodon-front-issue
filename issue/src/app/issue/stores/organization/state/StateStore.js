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
      code: 'todo',
      name: '待处理',
      colour: '#ffb100',
    }, {
      code: 'doing',
      name: '处理中',
      colour: '#4d90fe',
    }, {
      code: 'done',
      name: '完成',
      colour: '#00bfa5',
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

  loadStateList = (orgId, page, size, sort = { field: 'id', order: 'desc' }, param) => {
    this.setIsLoading(true);
    return axios.post(
      `/state/v1/organizations/${orgId}/status/list?page=${page}&size=${size}&sort=${sort.field},${sort.order}`,
      JSON.stringify(param),
    ).then((data) => {
      this.setStateList(data.content);
      if (data && data.failed) {
        Choerodon.prompt(data.message);
        return Promise.reject(data);
      } else {
        this.setIsLoading(false);
        return Promise.resolve(data);
      }
    }).catch(() => Promise.reject());
  };

  loadStateById = (orgId, stateId) => axios.get(`/state/v1/organizations/${orgId}/status/${stateId}`);

  createState = (orgId, map) => axios.post(`/state/v1/organizations/${orgId}/status`, JSON.stringify(map));

  deleteState = (orgId, stateId) => axios.delete(`/state/v1/organizations/${orgId}/status/${stateId}`);

  updateState = (orgId, stateId, map) => axios.put(`/state/v1/organizations/${orgId}/status/${stateId}`, JSON.stringify(map));

  loadAllState = orgId => axios.get(`/state/v1/organizations/${orgId}/status/query_all`);
}

const stateStore = new StateStore();
export default stateStore;
