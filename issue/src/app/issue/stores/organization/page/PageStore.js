import { observable, action, computed } from 'mobx';
import { axios, store } from 'choerodon-front-boot';
import querystring from 'query-string';

const { height } = window.screen;
@store('PageStore')
class PageStore {
  @observable isLoading = false;

  @observable createTypeShow = false;

  @observable pages = [];

  @observable field = false;

  @observable fieldList = [];

  @computed get getFieldList() {
    return this.fieldList;
  }

  @action setFiledList(data) {
    this.fieldList = data;
  }

  @computed get getIsLoading() {
    return this.isLoading;
  }

  @action setIsLoading(loading) {
    this.isLoading = loading;
  }

  @computed get getCreateTypeShow() {
    return this.createTypeShow;
  }

  @action setCreateTypeShow(data) {
    this.createTypeShow = data;
  }

  @action setPages(data) {
    this.pages = data;
  }

  @computed get getPages() {
    return this.pages.slice();
  }

  @action setField(data) {
    this.field = data;
  }

  @computed get getField() {
    return this.field;
  }

  loadFieldConfiguration = (orgId, page = 0, pageSize = 10, sort = { field: 'id', order: 'desc' }, map = {
    param: '',
  }) => {
    this.setIsLoading(true);
    this.setIsLoading(false);
  };

  loadPage = (orgId, sort = { field: 'id', order: 'desc' }, map = { param: '' }) => {
    this.setIsLoading(true);
    return axios.get(`/issue/v1/organizations/${orgId}/page?${querystring.stringify(map)}&sort=${sort.field},${sort.order}`).then((data) => {
      this.setIsLoading(false);
      const res = this.handleProptError(data);
      if (res) {
        this.setPages(data.content);
      }
      return res;
    }).catch((err) => {
      this.setIsLoading(false);
      Choerodon.prompt(err);
      return err;
    });
  };

  loadFieldList = orgId => axios.get(`/issue/v1/organizations/${orgId}/field/fields`);

  createPage = (orgId, map) => axios.post(`/issue/v1/organizations/${orgId}/page`, JSON.stringify(map))
    .then(data => this.handleProptError(data));

  loadPageById = (orgId, id) => axios.get(`/issue/v1/organizations/${orgId}/page/${id}`)
    .then(data => this.handleProptError(data));

  updatePageById = (orgId, id, map) => axios.put(`/issue/v1/organizations/${orgId}/page/${id}`, JSON.stringify(map))
    .then(data => this.handleProptError(data));

  createFieldConfiguration = (orgId, map) => axios.post(`/issue/v1/organizations/${orgId}/issue_type`, JSON.stringify(map))
    .then(data => this.handleProptError(data));

  loadIssueTypeById = (orgId, id) => axios.get(`/issue/v1/organizations/${orgId}/issue_type/${id}`).then((data) => {
    const res = this.handleProptError(data);
    if (res) {
      this.setIssueType(res);
    }
    return res;
  });

  checkName = (orgId, name, id) => axios.get(`/issue/v1/organizations/${orgId}/issue_type/check_name?name=${name}${id ? `&id=${id}` : ''}`)
    .then(data => this.handleProptError(data));

  deletePage = (orgId, id) => axios.delete(`/issue/v1/organizations/${orgId}/page/${id}`)
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

const pageStore = new PageStore();
export default pageStore;
