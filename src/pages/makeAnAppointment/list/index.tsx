import React, { FC, useRef, useState, useEffect } from 'react';
import moment from 'moment';
import {Avatar, Table, Card, Button, Modal, Input, Form, Radio} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {connect, Dispatch, FormattedMessage, history, formatMessage} from 'umi';
import { StateType } from '../model';

const FormItem = Form.Item;

interface BasicListProps {
  makeAnAppointment: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}


export const BasicList: FC<BasicListProps> = (props) => {
  const {
    loading,
    dispatch,
    makeAnAppointment: { list, total },
  } = props;

  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: {
      xs: { span: 4 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 20 },
      sm: { span: 20 },
      md: { span: 20 },
    },
  };
  const [visible, setVisible] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<number>();
  const [imgVisible, setImgVisible] = useState<boolean>();
  const [currentImgUrl, setCurrentImgUrl] = useState<string>();
  const [formValue, setFormValue] = useState<{}>({});

  useEffect(() => {
    dispatch({
      type: 'makeAnAppointment/fetchOfGet',
      payload: {
        url: 'api/visitor-infos?',
        body: {
          page: 0,
          size: 10,
          sort: 'id,desc',
        }
      },
    });
  }, []);

  const auditHandle = (id: number): void =>{
    setVisible(true);
    setCurrentId(id)
  }

  const showImg = (url: string): void => {
    setImgVisible(true);
    setCurrentImgUrl(url)
  }

  const columns: any[] = [{
    title: '',
    dataIndex: 'photoPath',
    align: 'center',
    render: (value: string) => <Avatar shape="square" size={64} src={value} onClick={(): void => showImg(value)} />
  }, {
    title: formatMessage({ id: 'visitorList-table.id'}),
    dataIndex: 'id',
    align: 'center',
  }, {
    title: formatMessage({ id: 'visitorList-table.realName'}),
    dataIndex: 'realName',
    align: 'center',
  }, {
    title: formatMessage({ id: 'visitorList-table.identityCardNum'}),
    dataIndex: 'identityCardNum',
    align: 'center',
  }, {
    title: formatMessage({ id: 'visitorList-table.appointmentTime'}),
    dataIndex: 'appointmentTime',
    align: 'center',
    render: (value: string) => <div>{value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : undefined}</div>
  }, {
    title: formatMessage({ id: 'visitorList-table.visitTime'}),
    dataIndex: 'visitTime',
    align: 'center',
    render: (value: string) => <div>{value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : undefined}</div>
  }, {
    title: formatMessage({ id: 'visitorList-table.createTime'}),
    dataIndex: 'createTime',
    align: 'center',
    render: (value: string) => <div>{value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : undefined}</div>
  }, {
    title: formatMessage({ id: 'visitorList-table.operation'}),
    dataIndex: 'id',
    align: 'center',
    render: (value: number, record: any): any => {
      if (!record.audited) {
        return <a onClick={() => auditHandle(value)}>{formatMessage({ id: 'visitorList-table.audit'})}</a>
      }
      if (record.audited && record.intervieweeAudit) {
        return <div style={{color: '#52c41a'}}>{formatMessage({ id: 'visitorList-table.auditSuccess'})}</div>
      }
      if (record.audited && !record.intervieweeAudit) {
        return <div style={{color: '#ff4d4f'}}>{formatMessage({ id: 'visitorList-table.auditFail'})}</div>
      }
    }
  }];

  const addHandle = ():void => {
    history.push('/makeAnAppointment/add')
  }

  const handlePageChange = (page: number, pageSize: number): void => {
    dispatch({
      type: 'makeAnAppointment/fetchOfGet',
      payload: {
        url: 'api/visitor-infos?',
        body: {
          page: page - 1,
          size: pageSize,
          sort: 'id,desc',
        }
      },
    });
    setFormValue({
      page: page - 1,
      size: pageSize,
      sort: 'id,desc',
    })
  }

  const pagination = {
    total,
    pageSize: 10,
    onChange: handlePageChange,
  }

  const handleCancel = (): void => {
    setVisible(false);
    setImgVisible(false);
  }

  const handleSubmit = (): void => {
    form.validateFields().then(values => {
      dispatch({
        type: 'makeAnAppointment/fetchOfPost',
        payload: {
          url: 'api/visitor-infos/interviewee-audit',
          body: {
            ...values,
            visitorInfoId: currentId
          },
        },
      }).then(({ response }): void => {
        if (response.status <= 300 && response.status >= 200) {
          setVisible(false);
          dispatch({
            type: 'makeAnAppointment/fetchOfGet',
            payload: {
              url: 'api/visitor-infos?',
              body: {
                ...formValue
              }
            },
          });
        }
      })
    }).catch(errorInfo => {
      console.log(errorInfo)
    })
  }

  return (
    <div>
      <PageHeaderWrapper>
        <Card>
          <Button type="primary" onClick={addHandle}>{formatMessage({ id: 'visitorList-btn.add'})}</Button>
        </Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={list}
          loading={loading}
          pagination={pagination}
        />
        <Modal
          title="审核"
          visible={visible}
          onOk={handleSubmit}
          onCancel={handleCancel}
        >
          <Form
            style={{ marginTop: 8 }}
            form={form}
            name="basic"
            initialValues={{ public: '1' }}
          >
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="visitorList-table.audit" />}
              name="intervieweeAudit"
              rules={[{
                required: true,
                message: formatMessage({ id: 'audit-form.intervieweeAudit.required' }),
              }]}
            >
              <Radio.Group>
                <Radio value>{formatMessage({ id: 'visitorList-table.auditSuccess'})}</Radio>
                <Radio value={false}>{formatMessage({ id: 'visitorList-table.auditFail'})}</Radio>
              </Radio.Group>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="audit-form.intervieweeAuditMessage.label" />}
              name="intervieweeAuditMessage"
            >
              <Input.TextArea rows={4}/>
            </FormItem>
          </Form>
        </Modal>
        <Modal
          visible={imgVisible}
          title={formatMessage({ id: 'visitorAdd-form.photo.label'})}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="detail" style={{ width: '100%' }} src={currentImgUrl} />
        </Modal>
      </PageHeaderWrapper>
    </div>
  );
};

export default connect(
  ({
     makeAnAppointment,
     loading,
   }: {
    makeAnAppointment: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    makeAnAppointment,
    loading: loading.models.makeAnAppointment,
  }),
)(BasicList);
