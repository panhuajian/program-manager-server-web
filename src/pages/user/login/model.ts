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
      const { data, response } = yield call(fetOfPost, payload);
      yield put({
        type: 'setNewState',
        key: 'status',
        data: response.status,
        currentAuthority: data.response,
      });
      yield put({
        type: 'setNewState',
        key: 'type',
        data: data.type,
        currentAuthority: data.response,
      });
      // Login successfully
      if (response.status === 200) {
        message.success('登录成功！');
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        // localStorage.setItem('token', data.id_token);
        history.replace(redirect || '/');
      }
    },
    *fetchOfGet({ payload }, { call }) {
      yield call(fetchOfGet, payload);
    },
    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
  },

  reducers: {
    setNewState(state, { key, data, currentAuthority } ) {
      setAuthority(currentAuthority);
      return {
        ...state,
        [key]: data,
      };
    },
  },
};

export default Model;
