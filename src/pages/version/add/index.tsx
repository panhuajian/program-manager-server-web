import {Button, Card, Input, Form, message, Select, Upload} from 'antd';
import { connect, Dispatch, history } from 'umi';
import React, {FC, useEffect, useState} from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { StateType } from '../model';
import styles from '../style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

interface BasicFormProps {
  submitting: boolean;
  dispatch: Dispatch<any>;
  version: StateType;
  userInfo: {};
  location: {
    query: {
      id?: number
    }
  }
}

const BasicForm: FC<BasicFormProps> = (props) => {
  const { submitting, dispatch, location: { query: { id } }, version: { userInfo } } = props;
  const [form] = Form.useForm();
  const [fileData, setFileData] = useState();
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

  useEffect(() => {
    if (id) {
      dispatch({
        type: 'version/fetchOfGet',
        payload: {
          url: `api/users/id/${id}`,
          key: 'userInfo'
        },
      })
    } else {
      dispatch({
        type: 'version/resetData',
        payload: {
          key: 'userInfo',
          data: {}
        },
      });
    }
  }, [])

  useEffect(() => {
    form.setFieldsValue(userInfo)
  }, [userInfo])

  const normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  // 文件上传状态修改
  const uploadChangeHandle = (file: any): void => {
    if (file.fileList.length > 0) {
      setFileData(file.file)
    } else {
      setFileData(undefined)
    }
  }

  // 上传文件
  const uploadHandle = async (): void => {
    if (!fileData) {
      message.error('请先选择文件')
    } else {
      const result = await dispatch({
        type: 'version/fetchOfGet',
        payload: {
          url: '/api/upload?',
          body: {
            originFilename: fileData.name,
            resourceType: 'shaokabao'
          },
          key: 'uploadData'
        },
      })
      console.log(result)
    }
  }

  const handleSubmit = (): void => {
    form.validateFields().then(values => {
      if (id) {
        dispatch({
          type: 'version/fetchOfPut',
          payload: {
            url: '/api/users',
            body: {
              ...userInfo,
              ...values,
            }
          },
        }).then(({ response, data }: any): void => {
          if (response.status <= 300 && response.status >= 200) {
            history.push('/version/list');
            message.success('提交成功');
          } else if (data.title) {
            message.error(data.title);
          }
        })
      } else {
        dispatch({
          type: 'version/fetchOfPost',
          payload: {
            url: '/api/users',
            body: {
              ...values,
              langKey: 'zh-cn'
            }
          },
        }).then(({ response, data }: any): void => {
          if (response.status <= 300 && response.status >= 200) {
            history.push('/version/list');
            message.success('提交成功');
          } else if (data.title) {
            message.error(data.title);
          }
        })
      }
    }).catch(errorInfo => {
      console.log(errorInfo)
    })
  }

  const backHandle = (): void => {
    history.push('/version/list')
  }

  return (
    <Card bordered={false}>
      <Form
        style={{ marginTop: 8 }}
        form={form}
        name="basic"
        initialValues={{ public: '1' }}
      >
        <FormItem
          {...formItemLayout}
          label="项目名称"
          name="projectName"
          rules={[{
            required: true,
            message: "请输入项目名称",
          }]}
        >
          <Input placeholder="请输入项目名称" />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="版本类型"
          name="versionType"
          rules={[{
            required: true,
            message: "版本类型",
          }]}
        >
          <Select placeholder="版本类型">
            <Option value="1">初始化文件</Option>
            <Option value="2">程序文件</Option>
            <Option value="3">参数文件</Option>
          </Select>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="版本号"
          name="versionNum"
          rules={[{
            required: true,
            message: "请输入版本号",
          }]}
        >
          <Input placeholder="请输入版本号" />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="基础版本号"
          name="baseVersionNum"
          rules={[{
            required: true,
            message: "请输入基础版本号",
          }]}
        >
          <Input placeholder="请输入基础版本号" />
        </FormItem>
        <FormItem
          {...formItemLayout}
          name="upload"
          label="版本文件"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Button type="primary" className={styles.margin_right_20} onClick={uploadHandle}>上传</Button>
          <Upload
            onChange={uploadChangeHandle}
          >
            <Button>
              <UploadOutlined /> 选择
            </Button>
          </Upload>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="测试负责人"
          name="testWorkerRealName"
          rules={[{
            required: true,
            message: "请输入测试负责人",
          }]}
        >
          <Input placeholder="请输入测试负责人" />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="优化负责人"
          name="optimizeWorkerRealName"
          rules={[{
            required: true,
            message: "请输入优化负责人",
          }]}
        >
          <Input placeholder="请输入优化负责人" />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="注意事项"
          name="caution"
          rules={[{
            required: true,
            message: "请输入注意事项",
          }]}
        >
          <TextArea rows={4} placeholder="请输入注意事项"/>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="版本信息"
          name="versionInfo"
          rules={[{
            required: true,
            message: "请输入版本信息",
          }]}
        >
          <TextArea rows={4} placeholder="请输入版本信息"/>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="优化内容"
          name="optimizedContent"
          rules={[{
            required: true,
            message: "请输入优化内容",
          }]}
        >
          <TextArea rows={4} placeholder="请输入优化内容"/>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="需求信息"
          name="requirementInfo"
          rules={[{
            required: true,
            message: "请输入需求信息",
          }]}
        >
          <TextArea rows={4} placeholder="请输入需求信息"/>
        </FormItem>
        <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
          <Button type="primary" loading={submitting} onClick={handleSubmit} className={styles.margin_right_20}>提交</Button>
          <Button type="primary" onClick={backHandle}>返回</Button>
        </FormItem>
      </Form>
    </Card>
  );
};

export default connect(({ loading, version }: { loading: { effects: { [key: string]: boolean } }, version: StateType }) => ({
  submitting: loading.effects['version/fetchOfPost'],
  version,
}))(BasicForm);
