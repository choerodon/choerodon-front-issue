import { observable, action, computed } from 'mobx';
import { axios, store } from 'choerodon-front-boot';
import querystring from 'query-string';

const { height } = window.screen;
@store('CustomFieldsStore')
class CustomFieldsStore {
  @observable isLoading = false;

  @observable createFieldShow = false;

  @observable customFields = [];

  @observable customFieldTypes = [];

  @observable screens = [];

  @observable field = false;

  @observable pageInfo = {
    current: 1, total: 0, pageSize: height <= 900 ? 10 : 15,
  };

  @action setPageInfo(page) {
    this.pageInfo.current = page.number + 1;
    this.pageInfo.total = page.totalElements;
    this.pageInfo.pageSize = page.size;
  }

  @computed get getPageInfo() {
    return this.pageInfo;
  }

  @computed get getIsLoading() {
    return this.isLoading;
  }

  @action setIsLoading(loading) {
    this.isLoading = loading;
  }

  @computed get getCreateFieldShow() {
    return this.createFieldShow;
  }

  @action setCreateFieldShow(data) {
    this.createFieldShow = data;
  }

  @action setCustomFields(data) {
    this.customFields = data;
  }

  @computed get getCustomFields() {
    return this.customFields.slice();
  }

  @action setField(data) {
    this.field = data;
  }

  @computed get getField() {
    return this.field;
  }

  @action setScreens(data) {
    this.screens = data;
  }

  @computed get getScreens() {
    return this.screens;
  }

  @computed get getCustomFieldTypes() {
    return [
      'radio', 'checkbox', 'time',
      'datetime', 'number', 'input',
      'text', 'single', 'multiple',
      'cascade', 'url', 'label',
    ];
  }

  loadCustomFields = (orgId, page = this.pageInfo.current - 1, pageSize = this.pageInfo.pageSize, sort = { field: 'id', order: 'desc' }, map = {
    param: '',
  }) => {
    this.setIsLoading(true);
    return axios.get(`/cloopm/v1/organizations/${orgId}/field?${querystring.stringify(map)}&page=${page}&size=${pageSize}&sort=${sort.field},${sort.order}`).then((data) => {
      const res = this.handleProptError(data);
      if (res) {
        this.setCustomFields(data.content);
        const { number, size, totalElements } = data;
        this.setPageInfo({ number, size, totalElements });
      }
      this.setIsLoading(false);
    });
  };

  loadCustomFieldById = (orgId, id) => axios.get(`/cloopm/v1/organizations/${orgId}/field/${id}`).then((data) => {
    const res = this.handleProptError(data);
    if (res) {
      this.setField(res);
    }
    return res;
  });

  createCustomField = (orgId, field) => axios.post(`/cloopm/v1/organizations/${orgId}/field`, JSON.stringify(field))
    .then(data => this.handleProptError(data));

  updateCustomField = (orgId, id, field) => axios.put(`/cloopm/v1/organizations/${orgId}/field/${id}`, JSON.stringify(field))
    .then(data => this.handleProptError(data));

  checkDelete = (orgId, id) => axios.get(`/cloopm/v1/organizations/${orgId}/field/check_delete/${id}`)
    .then(data => this.handleProptError(data));

  checkName = (orgId, name, id) => axios.get(`/cloopm/v1/organizations/${orgId}/field/check_name?name=${name}${id ? `&id=${id}` : ''}`)
    .then(data => this.handleProptError(data));

  deleteCustomField = (orgId, id) => axios.delete(`/cloopm/v1/organizations/${orgId}/field/${id}`)
    .then(data => this.handleProptError(data));

  loadScreens = (orgId, map) => {
    this.setIsLoading(true);
    return axios.get(`/cloopm/v1/organizations/${orgId}/page/pages? ${querystring.stringify(map)}`).then((data) => {
      const res = this.handleProptError(data);
      if (res) {
        this.setScreens(data);
      }
      this.setIsLoading(false);
    });
  };

  loadAssociateScreens = (orgId, id) => axios.get(`/cloopm/v1/organizations/${orgId}/field/query_related_page?field_id=${id}`)
    .then(data => this.handleProptError(data));

  associateScreens = (orgId, id, screens) => axios.post(`/cloopm/v1/organizations/${orgId}/field/update_related_page?field_id=${id}`, JSON.stringify(screens))
    .then(data => this.handleProptError(data));

  handleProptError = (error) => {
    if (error && error.failed) {
      // Choerodon.prompt(error.message);
      return error;
    } else {
      return error;
    }
  }
}

const customFieldsStore = new CustomFieldsStore();
export default customFieldsStore;
