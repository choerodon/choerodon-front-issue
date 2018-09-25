import { observable, action, computed } from 'mobx';
import { axios, store } from 'choerodon-front-boot';
import querystring from 'query-string';

const { height } = window.screen;
@store('FieldConfigurationStore')
class FieldConfigurationStore {
  @observable isLoading = false;

  @observable fieldConfigurations = [];

  @observable fieldConfigurationLine = [];

  @computed get getIsLoading() {
    return this.isLoading;
  }

  @action setIsLoading(loading) {
    this.isLoading = loading;
  }

  @action setFieldConfigurations(data) {
    this.fieldConfigurations = data;
  }

  @computed get getFieldConfigurations() {
    return this.fieldConfigurations.slice();
  }

  @action setFieldConfigurationLine(data) {
    this.fieldConfigurationLine = data;
  }

  @computed get getFieldConfigurationLine() {
    return this.fieldConfigurationLine.slice();
  }

  loadFieldConfiguration = (orgId, sort = { field: 'id', order: 'desc' }, map = { param: '' }) => {
    this.setIsLoading(true);
    return axios.get(`/cloopm/v1/organizations/${orgId}/field_config?${querystring.stringify(map)}&sort=${sort.field},${sort.order}`).then((data) => {
      const res = this.handleProptError(data);
      this.setIsLoading(false);
      if (res) {
        this.setFieldConfigurations(data.content);
        return res;
      }
    }).catch((err) => {
      this.setIsLoading(false);
      Choerodon.prompt(err);
      return err;
    });
  };

  createFieldConfiguration = (orgId, map) => axios.post(`/cloopm/v1/organizations/${orgId}/field_config`, JSON.stringify(map))
    .then(data => this.handleProptError(data));

  loadFieldConfigurationById = (orgId, id) => axios.get(`/cloopm/v1/organizations/${orgId}/field_config/${id}`).then((data) => {
    const res = this.handleProptError(data);
    if (res) {
      this.setFieldConfigurationLine(data.fieldConfigLineDTOList);
    }
    return res;
  });

  updateLineByConfigId = (orgId, id, map) => axios.put(`/cloopm/v1/organizations/${orgId}/field_config_line/${id}`, JSON.stringify(map))
    .then(data => this.handleProptError(data));

  deleteFieldConfiguration = (orgId, id) => axios.delete(`/cloopm/v1/organizations/${orgId}/field_config/${id}`)
    .then(data => this.handleProptError(data));

  checkName = (orgId, name, id) => axios.get(`/cloopm/v1/organizations/${orgId}/issue_type/check_name?name=${name}${id ? `&id=${id}` : ''}`)
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

const fieldConfigurationStore = new FieldConfigurationStore();
export default fieldConfigurationStore;
