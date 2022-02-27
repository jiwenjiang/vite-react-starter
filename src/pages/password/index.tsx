import Topbar from '@/comps/TopBar';
import request from '@/service/request';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Field, Form, Icon } from 'react-vant';
import styles from './index.module.less';

export default function App() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log('🚀 ~ file: index.tsx ~ line 14 ~ onFinish ~ values', values);
    const msg = await request({
      url: '/password/update',
      data: { password: values.password },
      method: 'POST',
    });
    if (msg.success) {
      navigate('/mine');
    }
  };

  return (
    <div className={styles.box}>
      <Topbar title="修改密码" />
      <div className={styles.tip}>密码修改后，居家端设备上登录密码同步更新</div>
      <Form onFinish={onFinish} form={form}>
        <Form.Item
          name="newPassword"
          rules={[{ required: true, message: '' }]}
          required={false}>
          <Field
            placeholder="请输入新密码"
            leftIcon={<Icon name="lock" />}
            type={'password'}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: '' },
            {
              validator: (_, value) => {
                if (form.getFieldValue('newPassword') === value) {
                  return Promise.resolve(true);
                }
                return Promise.reject(new Error('两次密码输入需相同'));
              },
            },
          ]}
          required={false}>
          <Field
            placeholder="请确认新密码"
            leftIcon={<Icon name="lock" />}
            type={'password'}
          />
        </Form.Item>
        <Button nativeType="submit" className={styles.btn} type="primary" block>
          确认修改
        </Button>
      </Form>
    </div>
  );
}
