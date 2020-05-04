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
