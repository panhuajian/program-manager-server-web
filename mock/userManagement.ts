import { Request, Response } from 'express';
import mockjs from 'mockjs';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // GET POST 可省略
  'GET /mock/user/info': mockjs.mock({
    'list|100': [{
      'id|+1': 1,
      name: '张三@id',
      agentId: '00000@id',
      phoneNum: '11111111111',
      telNum: '0551-523465',
    }]
  }).list
  // 'GET /user/info': [{
  //   id: 1
  // }]
}
