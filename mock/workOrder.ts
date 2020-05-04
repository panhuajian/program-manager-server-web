import { Request, Response } from 'express';
import mockjs from 'mockjs';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // GET POST 可省略
  'GET /mock/workOrder/info': mockjs.mock({
    'list|100': [{
      'id|+1': 1,
      name: '项目@id',
      releaseDate: '1994-09-04 00:00:00',
      initiator: '张三@id',
      status: '1',
    }]
  }).list
  // 'GET /user/info': [{
  //   id: 1
  // }]
}
