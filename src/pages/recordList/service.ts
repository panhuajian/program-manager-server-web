import request from 'umi-request';
import { stringify } from 'qs';
import { BasicListItemDataType } from './data.d';

interface ParamsType extends Partial<BasicListItemDataType> {
  count?: number;
  url: string;
  body: {};
  params?: {}
}

export async function fetchOfGet(params: ParamsType) {
  return request(`${params.url}${stringify(params.body)}`, {
    params: params.params,
  });
}

export async function queryRecordStatistics(params: ParamsType) {
  return request(`api/monitor-temp-data/count`, {
    params,
  });
}
