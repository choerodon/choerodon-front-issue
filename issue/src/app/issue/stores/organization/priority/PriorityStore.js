import { observable, computed, action, runInAction, autorun  } from 'mobx';
import { axios, store } from 'choerodon-front-boot';

@store('PriorityStore')
class PriorityStore {
  @observable allPriority = [];

  @observable onLoadingList = false;

  @observable priorityList = [];

  @observable onCreatingPriority = false;

  @observable onEditingPriority = false;

  @observable onDeletingPriority = false;

  @observable deletingPriorityId = null;

  @observable editingPriorityId = null;

  // 正在删除的优先级相关的事件单数量
  @observable deletingPriorityRelatedEventsCount = 0;

  @computed get deletingPriority() {
    return this.priorityList.find(item => item.id === this.deletingPriorityId);
  }

  @computed get editingPriority() {
    return this.priorityList.find(item => item.id === this.editingPriorityId);
  }

  @action
  setPriorityList(newPriorityList) {
    this.priorityList = [...newPriorityList];
  }

  @action
  setOnLoadingList(state) {
    this.onLoadingList = state;
  }

  @action
  setOnCreatingPriority(state) {
    this.onCreatingPriority = state;
  }

  @action
  setOnEditingPriority(state) {
    this.onEditingPriority = state;
  }

  @action
  setOnDeletingPriority(state) {
    this.onDeletingPriority = state;
  }

  @action
  setDeletingPriorityId(id) {
    this.deletingPriorityId = id;
  }

  @action
  setEditingPriorityId(id) {
    this.editingPriorityId = id;
  }

  @action
  async checkDeletingPriorityRelatedEventsCount() {
    try {
      const res = await axios.post('');
      runInAction(
        () => {
          this.deletingPriorityRelatedEventsCount = res;
          this.setOnDeletingPriority(true);
        },
      );
    } catch (err) {
      throw err;
    }
  }

  @action
  loadPriorityList = async (orgId) => {
    const URL = `/issue/v1/organizations/${orgId}/priority`;
    try {
      this.onLoadingList = true;
      const data = await axios.get(URL);
      runInAction(
        () => {
          this.priorityList = data;
        },
      );
    } catch (err) {
      throw err;
    } finally {
      runInAction(
        () => {
          this.onLoadingList = false;
        },
      );
    }
  }

  loadAllPriority = async (orgId) => {
    const URL = `/issue/v1/organizations/${orgId}/priority`;
    try {
      const data = await axios.get(URL);
      runInAction(
        () => {
          const { content } = data;
          this.allPriority = data;
        },
      );
    } catch (err) {
      throw err;
    }
  }

  checkName = (orgId, name) => axios.get(
    `/issue/v1/organizations/${orgId}/priority/check_name?name=${name}`,
  );

  editPriorityById = (orgId, priority) => axios.put(
    `/issue/v1/organizations/${orgId}/priority/${priority.id}`,
    {
      colour: priority.priorityColor,
      description: priority.des,
      id: priority.id,
      isDefault: priority.isDefault ? '1' : '0',
      name: priority.name,
      objectVersionNumber: priority.objectVersionNumber,
      organizationId: orgId,
    },
  );

  createPriority = (orgId, priority) => axios.post(
    `/issue/v1/organizations/${orgId}/priority`,
    {
      colour: priority.priorityColor,
      description: priority.des,
      isDefault: priority.isDefault ? '1' : '0',
      name: priority.name,
      objectVersionNumber: 1,
    },
  );

  deletePriorityById = (orgId, priorityId) => axios.delete(
    `/issue/v1/organizations/${orgId}/priority/${priorityId}`,
  );

  deleteAndChooseNewPriority = (orgId, prePriorityId, newPriorityId) => axios.post('');

  reOrder = orgId => axios.put(
    `/issue/v1/organizations/${orgId}/priority/sequence`,
    this.priorityList.map(item => ({
      id: item.id,
      sequence: item.sequence,
    })),
  );
}

const priorityStore = new PriorityStore();

export default priorityStore;
