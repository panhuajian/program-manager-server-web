import React, { FC, useEffect, useState } from 'react';
import {Table, Card, Input, Button, Form, Row, Col, message, Modal, Select} from 'antd';
import {connect, Dispatch, history} from 'umi';
import { StateType } from '../model';
import styles from '../style.less';

const FormItem = Form.Item;
const { Option } = Select;

interface BasicListProps {
  userManagement: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}


export const BasicList: FC<BasicListProps> = (props) => {
  const [form] = Form.useForm();
  const {
    loading,
    dispatch,
    userManagement: { list, total },
  } = props;

  const [formValue, setFormValue] = useState({});
  const [detail, setDetail] = useState<any>({});
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'userManagement/fetchOfGet',
      payload: {
        url: '/api/users?',
        body: {
          page: 0,
          size: 10,
        }
      },
    });
  }, []);

  // 删除用户
  // const delUserHandle = (login: string): void => {
    // dispatch({
    //   type: 'userManagement/fetchOfDelete',
    //   payload: {
    //     url: `/api/users/${login}`,
    //   },
    // }).then(({ response }: any): void => {
    //   if (response.status <= 300 && response.status >= 200) {
    //     message.success('删除成功')
    //     dispatch({
    //       type: 'userManagement/fetchOfGet',
    //       payload: {
    //         url: '/api/users?',
    //         body: {
    //           page: 0,
    //           size: 10,
    //           ...formValue
    //         }
    //       },
    //     });
    //   }
    // });
  // }

  // 关闭详情
  const hideDetailInfo = (): void => {
    setVisible(false)
  }

  // 显示详情
  const showDetailInfo = (): void => {
    setVisible(true)
  }

  // 点击详情
  const detailHandle = (record: any): void => {
    setDetail(record);
    showDetailInfo();
  }

  // 修改
  const editHandle = (id: number): void => {
    history.push({
      pathname: '/userManagement/add',
      query: {
        id
      },
    });

  }

  const departmentList = {
    "1": "技术部",
    "2": "工服部-数据中心",
    "3": "工服部-运维部"
  }

  const columns: any[] = [{
    title: '姓名',
    dataIndex: 'realName',
    align: 'center',
  }, {
    title: '部门',
    dataIndex: 'department',
    align: 'center',
    render: (value: string) => (
      <div>{departmentList[value]}</div>
    )
  }, {
    title: '工号',
    dataIndex: 'workNumber',
    align: 'center',
  }, {
    title: '手机号',
    dataIndex: 'mobilePhone',
    align: 'center',
  }, {
    title: '电话',
    dataIndex: 'telephone',
    align: 'center',
  }, {
    title: '操作',
    dataIndex: 'id',
    align: 'center',
    render: (value: number, record: any): any => (
      <div className={styles.user_operation}>
        <a onClick={() => detailHandle(record)}>详情</a>
        <a onClick={() => editHandle(record.id)}>修改</a>
        {/*<a onClick={() => delUserHandle(record.login)}>删除</a>*/}
      </div>
    )
  }];

  // 切换页码
  const handlePageChange = (page: number, pageSize: number): void => {
    dispatch({
      type: 'userManagement/fetchOfGet',
      payload: {
        url: '/api/users?',
        body: {
          page: page - 1,
          size: pageSize,
          ...formValue
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
    history.push('/userManagement/add')
  }

  const serchHandle = (): void => {
    form.validateFields().then(values => {
      dispatch({
        type: 'userManagement/fetchOfGet',
        payload: {
          url: '/api/users?',
          body: {
            page: 0,
            size: 10,
            ...values
          }
        },
      });
      setFormValue(values)
    })
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
                label="部门"
                name="department"
              >
                <Select
                  placeholder="部门"
                  allowClear
                  className={styles.department_select}
                >
                  <Option value="1">技术部</Option>
                  <Option value="2">工服部-数据中心</Option>
                  <Option value="3">工服部-运维部</Option>
                </Select>
              </FormItem>
              <FormItem
                label="姓名"
                name="realName"
              >
                <Input placeholder="姓名" allowClear />
              </FormItem>
            </Form>
          </Col>
          <Col className={styles.col_btn} span={6}>
            <Button type="primary" className={styles.user_add} onClick={addHandle}>新增</Button>
            <Button type="primary" onClick={serchHandle}>查询</Button>
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
      <Modal
        title="详情"
        visible={visible}
        onOk={hideDetailInfo}
        onCancel={hideDetailInfo}
      >
        <Row>
          <Col span={12}>id：{detail.id}</Col>
          <Col span={12}>创建时间：{detail.createdDate}</Col>
        </Row>
        <Row>
          <Col span={12}>姓名：{detail.realName}</Col>
          <Col span={12}>部门：{departmentList[detail.department]}</Col>
        </Row>
        <Row>
          <Col span={12}>工号：{detail.workNumber}</Col>
          <Col span={12}>手机号：{detail.mobilePhone}</Col>
        </Row>
        <Row>
          <Col span={12}>电话：{detail.telephone}</Col>
          <Col span={12}>邮箱：{detail.email}</Col>
        </Row>
        <Row>
          <Col span={12}>登录名：{detail.login}</Col>
        </Row>
      </Modal>
    </div>
  );
};

export default connect(
  ({
    userManagement,
    loading,
  }: {
    userManagement: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    userManagement,
    loading: loading.models.userManagement,
  }),
)(BasicList);
