import React, { FC, useEffect, useState } from 'react';
import {Table, Card, Input, Button, Form, Row, Col, message, Modal, Select, DatePicker } from 'antd';
import {connect, Dispatch, history} from 'umi';
import moment from 'moment';
import { StateType } from '../model';
import styles from '../style.less';

const FormItem = Form.Item;
const { Option } = Select;

interface BasicListProps {
  version: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}


export const BasicList: FC<BasicListProps> = (props) => {
  const [form] = Form.useForm();
  const {
    loading,
    dispatch,
    version: { list, total },
  } = props;
  const [formValue, setFormValue] = useState({});
  useEffect(() => {
    dispatch({
      type: 'version/fetchOfGet',
      payload: {
        url: '/api/version-infos?',
        body: {
          page: 0,
          size: 10,
        }
      },
    });
  }, []);


  const versionTypeList = {
    "init_file": "初始化文件",
    "project_file": "程序文件",
    "config_file": "参数文件"
  }

  const columns: any[] = [{
    title: '项目名称',
    dataIndex: 'projectName',
    align: 'center',
  }, {
    title: '版本号',
    dataIndex: 'versionNum',
    align: 'center',
  }, {
    title: '类型',
    dataIndex: 'versionType',
    align: 'center',
    render: (value: string) => <div>{versionTypeList[value]}</div>
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center',
    render: (value: string) => <div>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</div>
  }];

  // 切换页码
  const handlePageChange = (page: number, pageSize: number): void => {
    dispatch({
      type: 'version/fetchOfGet',
      payload: {
        url: '/api/version-infos?',
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
    history.push('/version/add')
  }

  const serchHandle = (): void => {
    form.validateFields().then(values => {
      let createTime;
      if (values['createTime.equals']) {
        createTime = moment(values['createTime.equals']).format('YYYY-MM-DD')
      }
      dispatch({
        type: 'version/fetchOfGet',
        payload: {
          url: '/api/version-infos?',
          body: {
            page: 0,
            size: 10,
            ...values,
            'createTime.equals': createTime
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
                label="项目名称"
                name="projectName.contains"
              >
                <Input placeholder="项目名称" allowClear />
              </FormItem>
              <FormItem
                label="类型"
                name="versionType.in"
              >
                <Select
                  placeholder="类型"
                  allowClear
                  mode="multiple"
                  style={{ width: 400 }}
                >
                  <Option value="init_file">初始化文件</Option>
                  <Option value="project_file">程序文件</Option>
                  <Option value="config_file">参数文件</Option>
                </Select>
              </FormItem>
              <FormItem
                label="创建日期"
                name="createTime.equals"
              >
                <DatePicker placeholder="创建日期" allowClear />
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
    </div>
  );
};

export default connect(
  ({
     version,
    loading,
  }: {
    version: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    version,
    loading: loading.models.version,
  }),
)(BasicList);
