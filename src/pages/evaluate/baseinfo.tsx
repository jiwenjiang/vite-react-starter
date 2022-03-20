import { DatetimePickerItem } from '@/comps/CombinedItems.tsx';
import Topbar from '@/comps/TopBar';
import { GenderType } from '@/service/const';
import moment from 'moment';
import React from 'react';
import { Button, Field, Form, Radio } from 'react-vant';
import styles from './baseinfo.module.less';

export default function App({ submit }: { submit: Function }) {
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    const params = { ...values, birthday: moment(values.birthday).format('X') };
    submit(params);
    // const list = [];
    // for (const key in params) {
    //   let str = `${key}=${params[key]}`;
    //   list.push(str);
    // }
    // const query = list.join('&');
    // navigate(`/evaluate/grow?${query}`);
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
            name="name"
            label="昵称"
            rules={[{ required: true, message: '请输入昵称' }]}
            required={false}>
            <Field />
          </Form.Item>
          <Form.Item
            name="gender"
            label="性别"
            initialValue={GenderType.MALE}
            labelWidth={60}>
            <Radio.Group direction="horizontal">
              <Radio name={GenderType.MALE} style={{ marginRight: 20 }}>
                男
              </Radio>
              <Radio name={GenderType.FEMALE}>女</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="birthday"
            label="出生年月"
            customField
            rules={[{ required: true, message: '' }]}>
            <DatetimePickerItem placeholder="选择时间" />
          </Form.Item>
          <Button nativeType="submit" className={styles.btn} type="primary" block>
            开始评测
          </Button>
        </Form>
      </div>
    </div>
  );
}
