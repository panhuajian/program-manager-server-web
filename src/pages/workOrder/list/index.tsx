import React, { FC, useEffect } from 'react';
import {Table, Card, Input, Button, Form, Row, Col, DatePicker} from 'antd';
import {connect, Dispatch, history} from 'umi';
import { StateType } from '../model';
import styles from '../style.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

interface BasicListProps {
  workOrder: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}


export const BasicList: FC<BasicListProps> = (props) => {
  const [form] = Form.useForm();
  const {
    loading,
    dispatch,
    workOrder: { list, total },
  } = props;

  useEffect(() => {
    dispatch({
      type: 'workOrder/fetchOfGet',
      payload: {
        url: '/mock/workOrder/info?',
        body: {
          page: 0,
          size: 10,
        }
      },
    });
  }, []);

  const columns: any[] = [{
    title: '项目名称',
    dataIndex: 'name',
    align: 'center',
  }, {
    title: '发布日期',
    dataIndex: 'releaseDate',
    align: 'center',
  }, {
    title: '发起人',
    dataIndex: 'initiator',
    align: 'center',
  }, {
    title: '项目状态',
    dataIndex: 'status',
    align: 'center',
  }, {
    title: "操作",
    dataIndex: 'id',
    align: 'center',
    render: (value: number, record: any): any => (
      <div className={styles.work_order_operation}>
        <a>查看</a>
        <a>下载</a>
        <a>导出</a>
      </div>
    )
  }];

  const handlePageChange = (page: number, pageSize: number): void => {
    dispatch({
      type: 'workOrder/fetchOfGet',
      payload: {
        url: '/mock/workOrder/info?',
        body: {
          page: page - 1,
          size: pageSize,
        }
      },
    });
  }

  const pagination = {
    pageSize: 10,
    total,
    onChange: handlePageChange,
  }

  const addHandle = (): void => {
    history.push('/workOrder/add')
  }

  return (
    <div>
      <Card className={styles.serch_form}>
        <Row>
          <Col span={18}>
            <Form
              form={form}
              layout="inline"
            >
              <FormItem
                label="项目名称"
                name="department"
              >
                <Input placeholder="项目名称" />
              </FormItem>
              <FormItem
                label="时间"
                name="name"
              >
                <RangePicker />
              </FormItem>
            </Form>
          </Col>
          <Col className={styles.col_btn} span={6}>
            <Button type="primary" className={styles.user_add} onClick={addHandle}>新增</Button>
            <Button type="primary">查询</Button>
          </Col>
        </Row>
      </Card>
      <Card>
        <Table
          rowKey="id"
          bordered
          columns={columns}
          dataSource={list}
          loading={loading}
          pagination={pagination}
        />
      </Card>
    </div>
  );
};

export default connect(
  ({
     workOrder,
    loading,
  }: {
    workOrder: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    workOrder,
    loading: loading.models.workOrder,
  }),
)(BasicList);
