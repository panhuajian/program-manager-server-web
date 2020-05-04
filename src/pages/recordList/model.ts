import { Effect, Reducer } from 'umi';
import moment from 'moment';
import { fetchOfGet, queryRecordStatistics} from './service';

import { BasicListItemDataType } from './data.d';

interface Statistics {
  totalCount: number,
  totalAlert: number,
  thisWeekCount: number,
  thisWeekAlert: number,
  thisMonthCount: number,
  thisMonthAlert: number,
}

export interface StateType {
  list: BasicListItemDataType[];
  statistics: Statistics,
  total: number,
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchOfGet: Effect;
    statistics: Effect;
  };
  reducers: {
    setNewState: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'recordList',

  state: {
    list: [],
    total: 0,
    statistics: {
      totalCount: 0,
      totalAlert: 0,
      thisWeekCount: 0,
      thisWeekAlert: 0,
      thisMonthCount: 0,
      thisMonthAlert: 0,
    }
  },

  effects: {
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
    *statistics({ payload }, { call, put }) {
      const { data: totalCount } = yield call(queryRecordStatistics, payload);
      const { data: totalAlert } = yield call(queryRecordStatistics, {tempOrMaskWarning: true});
      const { data: thisWeekCount } = yield call(queryRecordStatistics, {
        "createTime.greaterThanOrEqual":moment().subtract(1, 'week').startOf('day').format(),
        "createTime.lessThanOrEqual":moment().format(),
      });
      const { data: thisWeekAlert } = yield call(queryRecordStatistics, {
        "createTime.greaterThanOrEqual":moment().subtract(1, 'week').startOf('day').format(),
        "createTime.lessThanOrEqual":moment().format(),
        tempOrMaskWarning: true,
      });
      const { data: thisMonthCount } = yield call(queryRecordStatistics, {
        "createTime.greaterThanOrEqual":moment().subtract(1, 'month').startOf('day').format(),
        "createTime.lessThanOrEqual":moment().format(),
      });
      const { data: thisMonthAlert } = yield call(queryRecordStatistics, {
        "createTime.greaterThanOrEqual":moment().subtract(1, 'month').startOf('day').format(),
        "createTime.lessThanOrEqual":moment().format(),
        tempOrMaskWarning: true,
      });

      yield put({
        type: 'setNewState',
        key: 'statistics',
        data: {totalCount, totalAlert, thisWeekCount, thisWeekAlert, thisMonthCount, thisMonthAlert},
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
