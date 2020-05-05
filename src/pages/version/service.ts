import request from 'umi-request';
import { BasicListItemDataType } from './data.d';
import {stringify} from "qs";

interface ParamsType extends Partial<BasicListItemDataType> {
  count?: number;
  url: string;
  params: {}
}

export async function fetchOfGet(params: ParamsType) {
  return request(`${params.url}${stringify(params.body)}`, {
    ...params.params
  });
}

export async function fetchOfPost(params: ParamsType) {
  return request(params.url, {
    method: 'POST',
    data: params.body,
  });
}

export async function fetchOfDelete(params: ParamsType) {
  return request(params.url, {
    method: 'DELETE',
    data: params.body,
  });
}

export async function fetchOfPut(params: ParamsType) {
  return request(params.url, {
    method: 'PUT',
    data: params.body,
  });
}
