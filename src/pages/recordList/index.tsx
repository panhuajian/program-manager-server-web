import React, { FC, useRef, useState, useEffect } from 'react';
import {
  Avatar,
  Card,
  Col,
  List,
  Modal,
  Progress,
  Radio,
  Row,
} from 'antd';

import { findDOMNode } from 'react-dom';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, Dispatch, formatMessage } from 'umi';
import moment from 'moment';
import { StateType } from './model';
import { BasicListItemDataType } from './data.d';
import styles from './index.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

interface BasicListProps {
  recordList: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}

const Info: FC<{
  title: React.ReactNode;
  value: React.ReactNode;
  bordered?: boolean;
}> = ({ title, value, bordered }) => (
  <div className={styles.headerInfo}>
    <span>{title}</span>
    <p>{value}</p>
    {bordered && <em />}
  </div>
);

const ListContent = ({
                       data: { monitor, createTime, temperature, temperatureWarning, maskedWarning },
                     }: {
  data: BasicListItemDataType;
}) => {
  const progressPercent = (t => {
    if (t >= 38) return 100;
    if (t <= 36) return 0;
    return (t - 36.0) * 100 / 2.0
  })(temperature);
  let status = 'success';
  if (maskedWarning || temperatureWarning) {
    status = 'exception'
  }

  return <div className={styles.listContent}>
    <div className={styles.listContentItem}>
      <Progress percent={progressPercent} status={status} showInfo={false} strokeWidth={16} style={{width: 180}}/>
    </div>
    <div className={styles.listContentItem}>
      <span>{formatMessage({ id: 'record-list.detectionTime'})}</span>
      <p>{`${monitor.name}${monitor.code}`}</p>
    </div>
    <div className={styles.listContentItem}>
      <span>{formatMessage({ id: 'record-list.device'})}</span>
      <p>{moment(createTime).format('YYYY-MM-DD HH:mm')}</p>
    </div>
  </div>
};

export const BasicList: FC<BasicListProps> = (props) => {
  const addBtn = useRef(null);
  const {
    loading,
    dispatch,
    recordList: { list, statistics, total },
  } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [formValue, setFormValue] = useState({});
  const [currentImgUrl, setCurrentImgUrl] = useState<string>('');
  const [current, setCurrent] = useState<number>(1)

  useEffect(() => {
    dispatch({
      type: 'recordList/fetchOfGet',
      payload: {
        url: 'api/monitor-temp-data?',
        body: {
          page: 0,
          size: 10,
        }
      },
    });
    dispatch({
      type: 'recordList/statistics',
      payload: {
      },
    });
  }, [1]);

  const tempOrMaskWarningList = {
    'all': undefined,
    'alert': true,
    'normal': false,
  }

  const handleFilterChange = (e) => {
    const filter = e.target.value;
    setFormValue({
      tempOrMaskWarning: tempOrMaskWarningList[filter],
    })
    setCurrent(1)
    dispatch({
      type: 'recordList/fetchOfGet',
      payload: {
        url: 'api/monitor-temp-data?',
        body: {
          page: 0,
          size: 10,
          tempOrMaskWarning: tempOrMaskWarningList[filter],
        }
      },
    });
  }

  const handlePageChange = (page: number, size: number | undefined) => {
    dispatch({
      type: 'recordList/fetchOfGet',
      payload: {
        url: 'api/monitor-temp-data?',
        body: {
          page: page - 1,
          size,
          ...formValue,
        }
      },
    });
    setCurrent(page)
  };

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: 10,
    total,
    onChange: handlePageChange,
    current
  };

  const extraContent = (
    <div className={styles.extraContent}>
      <RadioGroup defaultValue="all" onChange={handleFilterChange}>
        <RadioButton value="all">{formatMessage({ id: 'record-list.all'})}</RadioButton>
        <RadioButton value="normal">{formatMessage({ id: 'record-list.normal'})}</RadioButton>
        <RadioButton value="alert">{formatMessage({ id: 'record-list.alert'})}</RadioButton>
      </RadioGroup>
    </div>
  );


  const setAddBtnblur = () => {
    if (addBtn.current) {
      // eslint-disable-next-line react/no-find-dom-node
      const addBtnDom = findDOMNode(addBtn.current) as HTMLButtonElement;
      setTimeout(() => addBtnDom.blur(), 0);
    }
  };

  const showImg = (url: string): void => {
    setVisible(true);
    setCurrentImgUrl(url)
  }

  const handleCancel = () => {
    setAddBtnblur();
    setVisible(false);
  };

  return (
    <div>
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title={formatMessage({ id: 'record-list.totalCount'})} value={`${statistics.totalCount}${formatMessage({ id: 'record-list.personTime'})}，${statistics.totalAlert}${formatMessage({ id: 'record-list.personAbnormal'})}`} bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title={formatMessage({ id: 'record-list.thisWeekCount'})} value={`${statistics.thisWeekCount}${formatMessage({ id: 'record-list.personTime'})}，${statistics.thisWeekAlert}${formatMessage({ id: 'record-list.personAbnormal'})}`} bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title={formatMessage({ id: 'record-list.thisMonthCount'})} value={`${statistics.thisMonthCount}${formatMessage({ id: 'record-list.personTime'})}，${statistics.thisMonthAlert}${formatMessage({ id: 'record-list.personAbnormal'})}`} />
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.filePath} shape="square" size="large" onClick={(): void => showImg(item.filePath)} />}
                    title={<a>{`${item.temperature}℃`}</a>}
                    description={item.masked === true ? formatMessage({ id: 'record-list.WearMask'}) : formatMessage({ id: 'record-list.NoMask'})}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageHeaderWrapper>
      <Modal
        visible={visible}
        title={formatMessage({ id: 'record-list.picture'})}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="detail" style={{ width: '100%' }} src={currentImgUrl} />
      </Modal>
    </div>
  );
};

export default connect(
  ({
     recordList,
     loading,
   }: {
    recordList: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    recordList,
    loading: loading.models.recordList,
  }),
)(BasicList);
