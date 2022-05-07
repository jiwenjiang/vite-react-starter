import request from '@/service/request';
import { GetQueryString } from '@/service/utils';
import logo from '@/static/imgs/logo.png';
import { PhoneO } from '@react-vant/icons';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, CountDown, Field, Form, hooks, Notify } from 'react-vant';
import styles from './bind.module.less';

function App() {
  const [form] = Form.useForm();
  const [state, set] = hooks.useSetState({
    visible: false,
    value: '',
    isSend: false,
  });
  const [showRight, setShowRight] = useState(true);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log('🚀 ~ file: bind.tsx ~ line 29 ~ onFinish ~ values', values);
    if (!/\d{6}/.test(state.value)) {
      Notify.show({ type: 'danger', message: '请输入6位校验码' });
      return;
    }
    const returnUrl = GetQueryString('returnUrl');
    const msg = await request({
      url: '/login',
      data: { ...values, openId: GetQueryString('openId'), code: state.value },
      method: 'POST',
      needLogin: false,
    });
    if (msg.success) {
      sessionStorage.user = JSON.stringify(msg.data.user);
      sessionStorage.token = msg.data.token;
      if (returnUrl) {
        window.location.href = returnUrl;
      } else {
        navigate('/records');
      }
    }
  };

  const send = async () => {
    const phone = form.getFieldValue('phone');
    if (/1\d{10}/.test(phone)) {
      request({
        url: '/sms',
        data: {
          phone: phone,
        },
        needLogin: false,
      });
      set({
        isSend: true,
      });
    } else {
      Notify.show({ type: 'danger', message: '请输入正确手机号' });
    }
  };

  useEffect(() => {
    const hide = () => {
      setShowRight(false);
    };
    const show = () => {
      setShowRight(true);
    };
    window.addEventListener('focus', hide, { capture: true });
    window.addEventListener('blur', show, { capture: true });
    return () => {
      window.removeEventListener('focus', hide);
      window.removeEventListener('blur', show);
    };
  }, []);

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
              className={styles.checkCode}
              onChange={(e) => {
                set({ value: e });
              }}
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
                onClick={() => send()}>
                发送验证码
              </Button>
            )}
          </div>
          {/* <NumberKeyboard
            value={state.value}
            visible={state.visible}
            maxlength={6}
            onChange={(v) => {
              set({ value: v });
            }}
            onBlur={() => {
              set({ visible: false });
            }}
          /> */}
          <Button nativeType="submit" className={styles.btn} type="primary" block>
            绑定
          </Button>
        </Form>
        {showRight && (
          <div className={styles.rights}>
            Copyright © {new Date().getFullYear()} 复数健康
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
