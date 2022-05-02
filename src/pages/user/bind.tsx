import request from '@/service/request';
import { GetQueryString } from '@/service/utils';
import logo from '@/static/imgs/logo.png';
import { PhoneO } from '@react-vant/icons';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  CountDown,
  Field,
  Form,
  hooks,
  Icon,
  Notify,
  NumberKeyboard,
  Toast,
} from 'react-vant';
import styles from './bind.module.less';

function App() {
  const [form] = Form.useForm();
  const [state, set] = hooks.useSetState({
    visible: false,
    value: '',
    isSend: false,
  });
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log('🚀 ~ file: bind.tsx ~ line 29 ~ onFinish ~ values', values);
    if (!/\d{6}/.test(state.value)) {
      Notify({ type: 'danger', message: '请输入6位校验码' });
    }
    // const returnUrl = GetQueryString('returnUrl');
    // const msg = await request({
    //   url: '/login',
    //   data: { ...values, openId: GetQueryString('openId') },
    //   method: 'POST',
    //   needLogin: false,
    // });
    // if (msg.success) {
    //   sessionStorage.user = JSON.stringify(msg.data.user);
    //   sessionStorage.token = msg.data.token;
    //   if (returnUrl) {
    //     window.location.href = returnUrl;
    //   } else {
    //     navigate('/records');
    //   }
    // }
  };

  const send = () => {
    set({
      isSend: true,
    });
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
            validateTrigger={['onBlur']}
            rules={[
              { required: true, message: '' },
              {
                pattern: /1\d{10}/,
                message: '请输入正确手机号',
                validateTrigger: 'onBlur',
              },
            ]}
            required={false}>
            <Field placeholder="请输入手机号" leftIcon={<PhoneO />} />
          </Form.Item>
          <div className={styles.checkBox}>
            <Field
              placeholder="请输入验证码"
              value={state.value}
              readonly
              onClick={() => set({ visible: true })}
              className={styles.checkCode}
            />
            {state.isSend ? (
              <Button
                className={styles.checkBtn}
                type="primary"
                block
                nativeType="button">
                <CountDown
                  time={60000}
                  millisecond
                  format="ss"
                  onFinish={() => set({ isSend: false })}
                />
              </Button>
            ) : (
              <Button
                nativeType="button"
                className={styles.checkBtn}
                type="primary"
                block
                onClick={send}>
                发送验证码
              </Button>
            )}
          </div>
          <NumberKeyboard
            value={state.value}
            visible={state.visible}
            maxlength={6}
            onChange={(v) => {
              set({ value: v });
            }}
            onBlur={() => {
              set({ visible: false });
            }}
          />
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