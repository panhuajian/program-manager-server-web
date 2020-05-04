import React, { FC, useRef, useState, useEffect } from 'react';
import { Table } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, Dispatch, formatMessage } from 'umi';
import { StateType } from './model';


interface BasicListProps {
  deviceManagement: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}


export const BasicList: FC<BasicListProps> = (props) => {
  const {
    loading,
    dispatch,
    deviceManagement: { list, total },
  } = props;

  useEffect(() => {
    dispatch({
      type: 'deviceManagement/fetchOfGet',
      payload: {
        url: 'api/monitors?',
        body: {
          page: 0,
          size: 10,
        }
      },
    });
  }, []);

  const columns: any[] = [{
    title: formatMessage({ id: 'deviceManagement-table.deviceId'}),
    dataIndex: 'id',
    align: 'center',
  }, {
    title: formatMessage({ id: 'deviceManagement-table.deviceCode'}),
    dataIndex: 'code',
    align: 'center',
  }, {
    title: formatMessage({ id: 'deviceManagement-table.deviceName'}),
    dataIndex: 'name',
    align: 'center',
  }, {
    title: formatMessage({ id: 'deviceManagement-table.deviceStatus'}),
    dataIndex: 'online',
    align: 'center',
    render: (text: boolean) => (
      <div>{text ? formatMessage({ id: 'deviceManagement-table.online'}) : formatMessage({ id: 'deviceManagement-table.offline'})}</div>
    )
  }];

  const handlePageChange = (page: number, pageSize: number): void => {
    dispatch({
      type: 'deviceManagement/fetchOfGet',
      payload: {
        url: 'api/monitors?',
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

  return (
    <div>
      <PageHeaderWrapper>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={list}
          loading={loading}
          pagination={pagination}
        />
      </PageHeaderWrapper>
    </div>
  );
};

export default connect(
  ({
    deviceManagement,
    loading,
  }: {
    deviceManagement: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    deviceManagement,
    loading: loading.models.deviceManagement,
  }),
)(BasicList);
