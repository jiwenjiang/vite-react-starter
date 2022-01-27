import React, { useState } from 'react';
import { Button, Field, Form, Icon } from 'react-vant';

import request from '@/service/request';
import logo from '@/static/imgs/logo.png';

import styles from './index.module.less';

function App() {
  const [form] = Form.useForm();
  const [isPsw, setIsPsw] = useState(true);

  const onFinish = async (values) => {
    console.log('form submit', values);
    const a = await request({ url: '/login', data: values, method: 'POST' });
    console.log('🚀 ~ file: index.tsx ~ line 14 ~ onFinish ~ a', a);
  };

  const changePsw = () => {
    setIsPsw(!isPsw);
  };
  return (
    <div className={styles.box}>
      <div className={styles.shadow}>
        <div className={styles.imgBox}>
          <img src={logo} alt="" />
        </div>
        <div className={styles.title}>脑科学数字化精准康复变革者</div>
        <Form onFinish={onFinish} form={form}>
          <Form.Item
            name="phone"
            rules={[{ required: true, message: '' }]}
            required={false}>
            <Field placeholder="请输入用户名" leftIcon={<Icon name="friends" />} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '' }]}
            required={false}>
            <Field
              placeholder="请输入密码"
              leftIcon={<Icon name="lock" />}
              rightIcon={<Icon name="eye" />}
              onClickRightIcon={changePsw}
              type={isPsw ? 'password' : 'text'}
            />
          </Form.Item>
          <Button nativeType="submit" className={styles.btn} type="primary" block>
            登录
          </Button>
        </Form>
        <div className={styles.rights}>
          Copyright © {new Date().getFullYear()} 复数健康
        </div>
      </div>
    </div>
  );
}

export default App;
