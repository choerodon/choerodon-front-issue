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
      id: 'status_todo',
      code: 'todo',
      name: '待处理',
    }, {
      id: 'status_doing',
      code: 'status_doing',
      name: '处理中',
    }, {
      id: 'status_done',
      code: 'status_done',
      name: '完成',
    }, {
      id: 'status_none',
      code: 'status_none',
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
    return axios.get(`/state/v1/organizations/${orgId}/status?${querystring.stringify(map)}&sort=${sort.field},${sort.order}`).then((data) => {
      this.setStateList(data.content);
      if (data && data.failed) {
        Choerodon.prompt(res.message);
        return Promise.reject(data);
      } else {
        this.setIsLoading(false);
        return Promise.resolve(data);
      }
    }).catch(() => {
      return Promise.reject();
    });
  }

  loadStateById = (orgId, stateId) => axios.get(`/state/v1/organizations/${orgId}/status/${stateId}`);

  createState = (orgId, map) => axios.post(`/state/v1/organizations/${orgId}/status`, JSON.stringify(map));

  deleteState = (orgId, stateId) => axios.delete(`/state/v1/organizations/${orgId}/status/${stateId}`);

  updateState = (orgId, stateId, map) => axios.put(`/state/v1/organizations/${orgId}/status/${stateId}`, JSON.stringify(map));

  loadAllState = orgId => axios.get(`/state/v1/organizations/${orgId}/status/query_all`);
}

const stateStore = new StateStore();
export default stateStore;
