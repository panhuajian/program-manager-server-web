import request from 'umi-request';
import {stringify} from "qs";

export interface LoginParamsType {
  url: string;
  body: {}
}

interface ParamsType {
  url: string;
  body: {},
  params: {}
}

export async function fetOfPost(params: LoginParamsType) {
  return request(params.url, {
    method: 'POST',
    data: params.body,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function fetchOfGet(params: ParamsType) {
  return request(`${params.url}${stringify(params.body)}`, {
    ...params.params
  });
}
