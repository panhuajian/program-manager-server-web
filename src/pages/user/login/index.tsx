import {Alert, Checkbox, message} from 'antd';
import React, { useState, useEffect } from 'react';
import {Dispatch, AnyAction, Link, connect, history} from 'umi';
import { StateType } from './model';
import styles from './style.less';
import LoginFrom from './components/Login';
import { getCSRF } from '@/utils/utils';

const { UserName, Password, Submit } = LoginFrom;
interface LoginProps {
  dispatch: Dispatch<AnyAction>;
  userAndlogin: StateType;
  submitting?: boolean;
}

interface LoginValue {
  username: string,
  password: string
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const { userAndlogin = {}, submitting, dispatch } = props;
  // const { status, type: loginType } = userAndlogin;
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState<string>('account');

  useEffect(() => {
    if (!getCSRF()) {
      dispatch({
        type: 'userAndlogin/fetchOfGet',
        payload: {
          url: '/api/authenticate'
        },
      });
    }
  }, [])

  const handleSubmit = (values: LoginValue): void => {
    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('password', values.password);
    formData.append('remember-me', autoLogin.toString());
    formData.append('submit', "Login");
    dispatch({
      type: 'userAndlogin/login',
      payload: {
        url: '/api/authentication',
        body: formData
      },
    }).then(({ response }: any) => {
      if (response.status === 200) {
        dispatch({
          type: 'userAndlogin/fetchOfGet',
          payload: {
            url: '/api/account',
            key: 'authorities'
          },
        })
        message.success('登录成功！');
        history.replace('/');
      }
    });
    localStorage.setItem('username', values.username);
  };
  return (
    <div className={styles.main}>
      <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
          <UserName
            name="username"
            placeholder="请输入管理员姓名"
            rules={[
              {
                required: true,
                message: "请输入管理员姓名",
              },
            ]}
          />
          <Password
            name="password"
            placeholder="请输入登录密码"
            rules={[
              {
                required: true,
                message: "请输入登录密码",
              },
            ]}
          />
        {/*<div>*/}
        {/*  <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>自动登录</Checkbox>*/}
        {/*</div>*/}
        <Submit loading={submitting}>登录</Submit>
      </LoginFrom>
    </div>
  );
};

export default connect(
  ({
    userAndlogin,
    loading,
  }: {
    userAndlogin: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    userAndlogin,
    submitting: loading.effects['userAndlogin/login'],
  }),
)(Login);
