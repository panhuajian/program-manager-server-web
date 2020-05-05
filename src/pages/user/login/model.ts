import { Effect, history, Reducer } from 'umi';
import { message } from 'antd';
import { fetOfPost, getFakeCaptcha } from './service';
import { getPageQuery, setAuthority } from './utils/utils';
import {fetchOfGet} from "@/pages/workOrder/service";

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
  username: string;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    fetchOfGet: Effect;
    getCaptcha: Effect;
  };
  reducers: {
    setNewState: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userAndlogin',

  state: {
    status: undefined,
    username: ''
  },

  effects: {
    *login({ payload }, { call, put }) {
      const result  = yield call(fetOfPost, payload);
      const { data, response } = result;
      yield put({
        type: 'setNewState',
        key: 'status',
        data: response.status,
      });
      yield put({
        type: 'setNewState',
        key: 'type',
        data: data.type,
      });
      // Login successfully
      // if (response.status === 200) {
        // const urlParams = new URL(window.location.href);
        // const params = getPageQuery();
        // let { redirect } = params as { redirect: string };
        // if (redirect) {
        //   const redirectUrlParams = new URL(redirect);
        //   if (redirectUrlParams.origin === urlParams.origin) {
        //     redirect = redirect.substr(urlParams.origin.length);
        //     if (redirect.match(/^\/.*#/)) {
        //       redirect = redirect.substr(redirect.indexOf('#') + 1);
        //     }
        //   } else {
        //     window.location.href = redirect;
        //     return;
        //   }
        // }
        // localStorage.setItem('token', data.id_token);
      // }
      return result;
    },
    *fetchOfGet({ payload }, { call, put }) {
      const result = yield call(fetchOfGet, payload);
      const { data, response } = result;
      if (payload.key === 'authorities') {
        if (response.status >= 200 && response.status < 300) {
          setAuthority(data.authorities);
        }
      }
    },
    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
  },

  reducers: {
    setNewState(state, { key, data } ) {
      return {
        ...state,
        [key]: data,
      };
    },
  },
};

export default Model;
