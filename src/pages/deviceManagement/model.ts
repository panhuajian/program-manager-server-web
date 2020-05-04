import { Effect, Reducer } from 'umi';
import { fetchOfGet } from './service';

import { BasicListItemDataType } from './data.d';

export interface StateType {
  list: BasicListItemDataType[];
  total: number;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchOfGet: Effect;
  };
  reducers: {
    setNewState: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'deviceManagement',

  state: {
    list: [],
    total: 0,
  },

  effects: {
    *fetchOfGet({ payload }, { call, put }) {
      const { response, data} = yield call(fetchOfGet, payload);
      yield put({
        type: 'setNewState',
        key: 'list',
        data: Array.isArray(data) ? data : [],
      });
      yield put({
        type: 'setNewState',
        key: 'total',
        data: response.headers.get('X-Total-Count') * 1,
      });
    },
  },

  reducers: {
    setNewState(state, action) {
      return {
        ...state,
        [action.key]: action.data,
      };
    },
  },
};

export default Model;
