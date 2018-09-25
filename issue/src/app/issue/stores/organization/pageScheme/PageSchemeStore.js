import { observable, action, computed } from 'mobx';
import { axios, store } from 'choerodon-front-boot';
import querystring from 'query-string';

const { height } = window.screen;
const types = [{
  value: 'default',
}, {
  value: 'create',
}, {
  value: 'edit',
}];

@store('PageSchemeStore')
class PageSchemeStore {
  @observable isLoading = false;

  @observable pageSchemes = [];

  @computed get getIsLoading() {
    return this.isLoading;
  }

  @action setIsLoading(loading) {
    this.isLoading = loading;
  }

  @action setPageSchemes(data) {
    this.pageSchemes = data;
  }

  @computed get getPageSchemes() {
    return this.pageSchemes.slice();
  }

  loadPagecheme = (orgId, sort = { field: 'id', order: 'desc' }, map = { param: '' }) => {
    this.setIsLoading(true);
    return axios.get(`cloopm/v1/organizations/${orgId}/page_scheme?${querystring.stringify(map)}&sort=${sort.field},${sort.order}`).then((data) => {
      this.setIsLoading(false);
      const res = this.handleProptError(data);
      if (res) {
        this.setPageSchemes(data.content);
      }
      return res;
    }).catch((err) => {
      this.setIsLoading(false);
      Choerodon.prompt(err);
      return err;
    });
  };

  loadFieldList = orgId => axios.get(`/cloopm/v1/organizations/${orgId}/field/fields`);

  createPageScheme = (orgId, map) => axios.post(`cloopm/v1/organizations/${orgId}/page_scheme`, JSON.stringify(map))
    .then(data => this.handleProptError(data));

  loadPageSchemeById = (orgId, id) => axios.get(`cloopm/v1/organizations/${orgId}/page_scheme/${id}`)
    .then(data => this.handleProptError(data));

  updatePageSchemeById = (orgId, id, map) => axios.put(`cloopm/v1/organizations/${orgId}/page_scheme/${id}`, JSON.stringify(map))
    .then(data => this.handleProptError(data));

  createFieldConfiguration = (orgId, map) => axios.post(`/cloopm/v1/organizations/${orgId}/issue_type`, JSON.stringify(map))
    .then(data => this.handleProptError(data));

  checkName = (orgId, name, id) => axios.get(`/cloopm/v1/organizations/${orgId}/issue_type/check_name?name=${name}${id ? `&id=${id}` : ''}`)
    .then(data => this.handleProptError(data));

  deletePageScheme = (orgId, id) => axios.delete(`/cloopm/v1/organizations/${orgId}/page_scheme/${id}`)
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

const pageSchemeStore = new PageSchemeStore();
export default pageSchemeStore;
