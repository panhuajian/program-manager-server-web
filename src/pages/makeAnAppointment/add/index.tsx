import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Input, Form, Upload, DatePicker } from 'antd';
import { connect, Dispatch, FormattedMessage, formatMessage, history } from 'umi';
import React, { FC } from 'react';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const FormItem = Form.Item;

interface BasicFormProps {
  submitting: boolean;
  dispatch: Dispatch<any>;
}

const BasicForm: FC<BasicFormProps> = (props) => {
  const { submitting, dispatch } = props;
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 10 },
    },
  };

  const submitFormLayout = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 10, offset: 7 },
    },
  };

  const normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleSubmit = (): void => {
    form.validateFields().then(values => {
      console.log('values', values)
      const formData = new FormData();
      Object.keys(values).forEach(item => {
        if (item === 'photo') {
          formData.append(item, values[item][0].originFileObj)
        } else if (item === 'appointmentTime') {
          formData.append(item, moment(values[item]).format())
        } else {
          formData.append(item, values[item])
        }
      });
      console.log(formData)
      dispatch({
        type: 'makeAnAppointment/fetchOfPost',
        payload: {
          url: 'api/visitor-infos',
          body: formData,
        },
      }).then(({ response }): void => {
        if (response.status <= 300 && response.status >= 200) {
          history.push('/makeAnAppointment/list')
        }
      })
    }).catch(errorInfo => {
      console.log(errorInfo)
    })
  }

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <Form
          style={{ marginTop: 8 }}
          form={form}
          name="basic"
          initialValues={{ public: '1' }}
        >
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="visitorAdd-form.intervieweeName.label" />}
            name="intervieweeName"
            rules={[{
              required: true,
              message: formatMessage({ id: 'visitorAdd-form.intervieweeName.required' }),
            }]}
          >
            <Input placeholder={formatMessage({ id: 'visitorAdd-form.intervieweeName.placeholder' })} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="visitorAdd-form.identityCardNum.label" />}
            name="identityCardNum"
            rules={[{
              required: true,
              message: formatMessage({ id: 'visitorAdd-form.identityCardNum.required' }),
            }, {
              pattern: /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/,
              message: formatMessage({ id: 'visitorAdd-form.identityCardNum.format' }),
            }]}
          >
            <Input placeholder={formatMessage({ id: 'visitorAdd-form.identityCardNum.placeholder' })} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="visitorAdd-form.appointmentTime.label" />}
            name="appointmentTime"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'visitorAdd-form.appointmentTime.required' }),
              },
            ]}
          >
            <DatePicker showTime placeholder={formatMessage({ id: 'visitorAdd-form.appointmentTime.placeholder' })} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            name="photo"
            label={<FormattedMessage id="visitorAdd-form.photo.label" />}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'visitorAdd-form.photo.required'}),
              },
            ]}
          >
            <Upload name="logo" listType="picture">
              <Button>
                <UploadOutlined /> <FormattedMessage id="visitorAdd-form.upload.value" />
              </Button>
            </Upload>
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" loading={submitting} onClick={handleSubmit}>
              <FormattedMessage id="visitorAdd-form.form.submit" />
            </Button>
          </FormItem>
        </Form>
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
  submitting: loading.effects['makeAnAppointment/submitRegularForm'],
}))(BasicForm);
