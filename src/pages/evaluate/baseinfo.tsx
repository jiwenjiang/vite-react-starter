import { DatetimePickerItem } from '@/comps/CombinedItems.tsx';
import Topbar from '@/comps/TopBar';
import React from 'react';
import { Button, Field, Form, Radio } from 'react-vant';
import styles from './baseinfo.module.less';

export default function App() {
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    console.log('🚀 ~ file: baseinfo.tsx ~ line 10 ~ App ~ values', values);
  };

  return (
    <div className={styles.box}>
      <Topbar title="儿童基本信息" />
      <div className={styles.shadow}>
        <div className={styles.title}>
          <div>请填写孩子的基本信息</div>
          <div>信息准确才能匹配准确量表</div>
        </div>
        <Form onFinish={onFinish} form={form}>
          <Form.Item
            labelWidth={60}
            name="phone"
            label="昵称"
            rules={[{ required: true, message: '请输入昵称' }]}
            required={false}>
            <Field />
          </Form.Item>
          <Form.Item name="radio" label="性别" initialValue="r1" labelWidth={60}>
            <Radio.Group direction="horizontal">
              <Radio name="r1" style={{ marginRight: 20 }}>
                男
              </Radio>
              <Radio name="r2">女</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="datetime"
            label="出生年月"
            customField
            rules={[{ required: true, message: '' }]}>
            <DatetimePickerItem placeholder="选择时间" />
          </Form.Item>
          <Button nativeType="submit" className={styles.btn} type="primary" block>
            登录
          </Button>
        </Form>
      </div>
    </div>
  );
}
