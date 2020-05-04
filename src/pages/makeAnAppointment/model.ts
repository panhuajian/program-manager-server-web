import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import { fetchOfPost, fetchOfGet } from './service';
import { DeviceManagementDataType } from "./data.d";

export interface StateType {
  list: DeviceManagementDataType[];
  total: number
}

export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    fetchOfPost: Effect;
    fetchOfGet: Effect;
  };
  reducers: {
    setNewState: Reducer<StateType>;
  };
}
const Model: ModelType = {

  namespace: 'makeAnAppointment',

  state: {
    list: [],
    total: 0,
  },

  effects: {
    *fetchOfPost({ payload }, { call }) {
      const result = yield call(fetchOfPost, payload);
      message.success('提交成功');
      return result
    },
    *fetchOfGet({ payload }, { call, put }) {
      const { data, response } = yield call(fetchOfGet, payload);
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
