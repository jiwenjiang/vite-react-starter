import Topbar from '@/comps/TopBar';
import request from '@/service/request';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Icon, Tag } from 'react-vant';
import styles from './zibizheng.module.less';

const colorMap = {
  低风险: '#2EC25B',
  中等风险: '#FF7D41',
  高风险: '#EBEDF0',
};

const checkColor = (v) => {
  if (v) {
    return colorMap[v];
  } else {
    return '#ffffff';
  }
};

export default function App() {
  return (
    <div className={styles.box}>
      <Topbar title="感统量表测评结果" />
      <Card />
    </div>
  );
}

function Card() {
  const [data, setData] = useState<any>({});
  const params = useParams();
  const [range, setRange] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await request({
        url: '/scaleRecord/get',
        data: { id: params.id },
      });
      setData(res.data);
      const arr = res.data.answers.map((v) => v.score.split('-')[1]);
      setRange(arr);
    })();
  }, []);

  return (
    <>
      <div className={styles.cardBox}>
        <div className={styles.card}>
          <div className={styles.title}>
            <Icon name="coupon" size={18} />
            &nbsp; 用户详情
          </div>
          <div className={styles.kv}>
            <span className={styles.k}>姓名</span>
            <span className={styles.v}>{data.name}</span>
          </div>
          <div className={styles.kv}>
            <span className={styles.k}>性别</span>
            <span className={styles.v}>{data.gender}</span>
          </div>
          <div className={styles.kv}>
            <span className={styles.k}>年龄</span>
            <span className={styles.v}>{data.age}</span>
          </div>
        </div>
      </div>
      <div className={styles.cardBox}>
        <div className={styles.card}>
          <div className={styles.title}>
            <Icon name="coupon" size={18} />
            &nbsp; 测评结果
          </div>
          <div className={styles.scoreBox}>
            <div className={styles.text}>您本次评测的得分</div>
            <div className={styles.score} style={{ color: checkColor(data.content) }}>
              {data.totalScore}
            </div>
            <div>
              <Tag size="medium" type="primary" color={checkColor(data.content)}>
                {data.content}
              </Tag>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.cardBox}>
        <div className={styles.card}>
          <div className={styles.title}>
            <Icon name="coupon" size={18} />
            &nbsp; 结果分析
          </div>
          <div className={styles.scoreBox}>
            <Range data={range} content={data.content} score={data.totalScore} />
          </div>
          <div className={styles.remark}>{data.remark}</div>
        </div>
      </div>
    <div className={styles.btnBox}>
    <Button className={styles.btn} type="primary" block>
        对报告有疑问？立刻联系客服
      </Button>
    </div>
    
    </>
  );
}

function Range({ data, content, score }) {
  const widthUnit = 320 / data[2];
  const left = (score / data[2]) * 320 - 15;
  console.log('🚀 ~ file: zibizheng.tsx ~ line 116 ~ Range ~ widthUnit', widthUnit);

  return (
    <>
      {data.length > 0 && (
        <div className={styles.rangeBox}>
          <div style={{ width: widthUnit * data[0] }} className={styles.pipe}>
            <span>正常</span>
          </div>
          <div style={{ width: widthUnit * (data[1] - data[0]) }} className={styles.pipe}>
            <span>中等风险</span>
          </div>
          <div style={{ width: widthUnit * (data[2] - data[1]) }} className={styles.pipe}>
            <span>高风险</span>
          </div>
          <div
            className={styles.rect}
            style={{ backgroundColor: checkColor(content), left }}>
            {score}
          </div>
        </div>
      )}
    </>
  );
}
