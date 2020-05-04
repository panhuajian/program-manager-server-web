import request from 'umi-request';
import {stringify} from "qs";

interface ParamsType {
  url: string;
  body: {},
  params: {}
}

export async function fetchOfPost(params: ParamsType) {
  return request(params.url, {
    method: 'POST',
    data: params.body,
  });
}

export async function fetchOfGet(params: ParamsType) {
  return request(`${params.url}${stringify(params.body)}`, {
    ...params.params
  });
}
