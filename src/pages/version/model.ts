import { Effect, Reducer } from 'umi';
import { fetchOfGet, fetchOfPost, fetchOfDelete, fetchOfPut } from './service';

import { BasicListItemDataType } from './data.d';

export interface StateType {
  list: BasicListItemDataType[];
  total: number;
  userInfo: {}
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    resetData: Effect;
    fetchOfGet: Effect;
    fetchOfPost: Effect;
    fetchOfDelete: Effect;
    fetchOfPut: Effect;
  };
  reducers: {
    setNewState: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'version',

  state: {
    list: [],
    total: 0,
    userInfo: {}
  },

  effects: {
    *resetData({ payload }, { put }) {
      yield put({
        type: 'setNewState',
        key: payload.key,
        data: payload.data,
      });

    },
    *fetchOfGet({ payload }, { call, put }) {
      const { response, data} = yield call(fetchOfGet, payload);
      if (payload.key) {
        yield put({
          type: 'setNewState',
          key: payload.key,
          data,
        });
      } else {
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
      }
    },
    *fetchOfPost({ payload }, { call }) {
      const result = yield call(fetchOfPost, payload);
      return result
    },
    *fetchOfDelete({ payload }, { call }) {
      const result = yield call(fetchOfDelete, payload);
      return result
    },
    *fetchOfPut({ payload }, { call }) {
      const result = yield call(fetchOfPut, payload);
      return result
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
