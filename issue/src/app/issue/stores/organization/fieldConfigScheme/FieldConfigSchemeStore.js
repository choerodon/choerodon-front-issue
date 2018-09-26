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

@store('FieldConfigSchemeStore')
class FieldConfigSchemeStore {
  @observable isLoading = false;

  @observable createTypeShow = false;

  @observable FieldConfigSchemes = [];

  @observable field = false;

  @observable fieldList = [];

  @computed get getPageTypes() {
    return types;
  }

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

  @action setFieldConfigSchemes(data) {
    this.FieldConfigSchemes = data;
  }

  @computed get getFieldConfigSchemes() {
    return this.FieldConfigSchemes.slice();
  }

  @action setField(data) {
    this.field = data;
  }

  @computed get getField() {
    return this.field;
  }

  loadFieldConfigScheme = (orgId, sort = { field: 'id', order: 'desc' }, map = { param: '' }) => {
    this.setIsLoading(true);
    return axios.get(`/issue/v1/organizations/${orgId}/field_config_scheme?${querystring.stringify(map)}&sort=${sort.field},${sort.order}`).then((data) => {
      this.setIsLoading(false);
      const res = this.handleProptError(data);
      if (res) {
        this.setFieldConfigSchemes(data.content);
      }
      return res;
    }).catch((err) => {
      this.setIsLoading(false);
      Choerodon.prompt(err);
      return err;
    });
  };

  loadFieldConfiguration = orgId => axios.get(`/issue/v1/organizations/${orgId}/field_config/configs`).then(data => this.handleProptError(data));

  loadFieldList = orgId => axios.get(`/issue/v1/organizations/${orgId}/field/fields`);

  createFieldConfigScheme = (orgId, map) => axios.post(`/issue/v1/organizations/${orgId}/field_config_scheme`, JSON.stringify(map))
    .then(data => this.handleProptError(data));

  loadFieldConfigSchemeById = (orgId, id) => axios.get(`/issue/v1/organizations/${orgId}/field_config_scheme/${id}`)
    .then(data => this.handleProptError(data));

  updateFieldConfigSchemeById = (orgId, id, map) => axios.put(`/issue/v1/organizations/${orgId}/field_config_scheme/${id}`, JSON.stringify(map))
    .then(data => this.handleProptError(data));

  createFieldConfiguration = (orgId, map) => axios.post(`/issue/v1/organizations/${orgId}/issue_type`, JSON.stringify(map))
    .then(data => this.handleProptError(data));

  checkDelete = (orgId, id) => axios.get(`/issue/v1/organizations/${orgId}/issue_type/check_delete/${id}`)
    .then(data => this.handleProptError(data));

  checkName = (orgId, name, id) => axios.get(`/issue/v1/organizations/${orgId}/issue_type/check_name?name=${name}${id ? `&id=${id}` : ''}`)
    .then(data => this.handleProptError(data));

  deleteFieldConfiguration = (orgId, id) => axios.delete(`/issue/v1/organizations/${orgId}/field_config_scheme/${id}`)
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

const fieldConfigSchemeStore = new FieldConfigSchemeStore();
export default fieldConfigSchemeStore;
