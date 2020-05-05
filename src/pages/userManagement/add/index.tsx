import {Button, Card, Input, Form, message, Select} from 'antd';
import { connect, Dispatch, history } from 'umi';
import React, { FC, useEffect } from 'react';
import { StateType } from '../model';
import styles from '../style.less';

const FormItem = Form.Item;
const { Option } = Select;

interface BasicFormProps {
  submitting: boolean;
  dispatch: Dispatch<any>;
  userManagement: StateType;
  userInfo: {};
  location: {
    query: {
      id?: number
    }
  }
}

const BasicForm: FC<BasicFormProps> = (props) => {
  const { submitting, dispatch, location: { query: { id } }, userManagement: { userInfo } } = props;
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

  useEffect(() => {
    if (id) {
      dispatch({
        type: 'userManagement/fetchOfGet',
        payload: {
          url: `api/users/id/${id}`,
          key: 'userInfo'
        },
      })
    } else {
      dispatch({
        type: 'userManagement/resetData',
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

  const handleSubmit = (): void => {
    form.validateFields().then(values => {
      if (id) {
        dispatch({
          type: 'userManagement/fetchOfPut',
          payload: {
            url: '/api/users',
            body: {
              ...userInfo,
              ...values,
            }
          },
        }).then(({ response, data }: any): void => {
          if (response.status <= 300 && response.status >= 200) {
            history.push('/userManagement/list');
            message.success('提交成功');
          } else if (data.title) {
            message.error(data.title);
          }
        })
      } else {
        dispatch({
          type: 'userManagement/fetchOfPost',
          payload: {
            url: '/api/users',
            body: {
              ...values,
              langKey: 'zh-cn'
            }
          },
        }).then(({ response, data }: any): void => {
          if (response.status <= 300 && response.status >= 200) {
            history.push('/userManagement/list');
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
    history.push('/userManagement/list')
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
          label="部门"
          name="department"
          rules={[{
            required: true,
            message: "请选择部门",
          }]}
        >
          <Select placeholder="请选择部门">
            <Option value="1">技术部</Option>
            <Option value="2">工服部-数据中心</Option>
            <Option value="3">工服部-运维部</Option>
          </Select>
        </FormItem>
        {/*<FormItem*/}
        {/*  {...formItemLayout}*/}
        {/*  label="权限"*/}
        {/*  name="authorities"*/}
        {/*  rules={[{*/}
        {/*    required: true,*/}
        {/*    message: "请选择权限",*/}
        {/*  }]}*/}
        {/*>*/}
        {/*  <Select placeholder="请选择权限" mode="multiple">*/}
        {/*    <Option value="ROLE_ADMIN">超级管理员</Option>*/}
        {/*  </Select>*/}
        {/*</FormItem>*/}
        <FormItem
          {...formItemLayout}
          label="姓名"
          name="realName"
          rules={[{
            required: true,
            message: "请输入姓名",
          }]}
        >
          <Input placeholder="请输入姓名" />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="邮箱"
          name="email"
          rules={[{
            required: true,
            message: "请输入邮箱",
          }, {
            type: 'email',
            message: '请输入正确的邮箱格式'
          }]}
        >
          <Input placeholder="请输入邮箱" />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="登录名"
          name="login"
          rules={[{
            required: true,
            message: "请输入登录名",
          }, {
            max: 50,
            message: '登录名长度不能大于50位',
          }, {
            pattern: /^[_.@A-Za-z0-9-]*$/,
            message: '登录名只能是包含数字、字母或者._-',
          }]}
        >
          <Input placeholder="请输入登录名" />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="工号"
          name="workNumber"
          rules={[{
            required: true,
            message: "请输入工号",
          }]}
        >
          <Input placeholder="请输入工号" />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="手机号"
          name="mobilePhone"
          rules={[{
            required: true,
            message: "请输入手机号",
          }, {
            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
            message: '请输入正确的手机号'
          }]}
        >
          <Input placeholder="请输入手机号" />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="电话"
          name="telephone"
          rules={[{
            required: true,
            message: "请输入电话",
          }]}
        >
          <Input placeholder="请输入电话" />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="密码"
          name="password"
          rules={[{
            required: true,
            message: "请输入密码",
          }, {
            min: 8,
            message: '密码长度不能少于8位',
          }, {
            max: 30,
            message: '密码长度不能大于30位',
          }, {
            pattern: /^[_.@A-Za-z0-9-]*$/,
            message: '密码只能是包含数字、字母或者._-',
          }]}
        >
          <Input placeholder="请输入密码" />
        </FormItem>
        <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
          <Button type="primary" loading={submitting} onClick={handleSubmit} className={styles.margin_right_20}>提交</Button>
          <Button type="primary" onClick={backHandle}>返回</Button>
        </FormItem>
      </Form>
    </Card>
  );
};

export default connect(({ loading, userManagement }: { loading: { effects: { [key: string]: boolean } }, userManagement: StateType }) => ({
  submitting: loading.effects['userManagement/fetchOfPost'],
  userManagement,
}))(BasicForm);
