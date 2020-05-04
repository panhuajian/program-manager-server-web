import { DefaultFooter, MenuDataItem, getMenuData, getPageTitle } from '@ant-design/pro-layout';
// import { Card, Row, Col } from 'antd'
import { Helmet, HelmetProvider } from 'react-helmet-async';
import {useIntl, ConnectProps, connect} from 'umi';
import React from 'react';
// import SelectLang from '@/components/SelectLang';
import { ConnectState } from '@/models/connect';
// import logo from '../assets/logo.png';
// import derhinologo from '../assets/derhinologo.png';
import styles from './UserLayout.less';

export interface UserLayoutProps extends Partial<ConnectProps> {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
}

const UserLayout: React.FC<UserLayoutProps> = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { formatMessage } = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <div className={styles.container}>
        {/*<div className={styles.lang}>*/}
        {/*  <SelectLang color="#fff" />*/}
        {/*</div>*/}
        <div className={styles.content}>
          <div className={styles.login_cont}>
            <div className={styles.name}>
              <span className={styles.title}>登录</span>
            </div>
            {children}
          </div>
        </div>
        {/*<div className={styles.footer}><img alt="derhinologo" src={derhinologo}/>copyright © Derhino</div>*/}
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);
