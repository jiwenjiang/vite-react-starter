import Topbar from '@/comps/TopBar';
import request from '@/service/request';
import fenxiImg from '@/static/imgs/fenxi.png';
import pingceImg from '@/static/imgs/pingce.png';
import yonghuImg from '@/static/imgs/yonghu.jpg';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
    return '#000000';
  }
};

export default function App() {
  return (
    <div className={styles.box}>
      <Topbar title="脑瘫量表测评结果" />
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
            <img src={yonghuImg} alt="1" />
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
            <img src={pingceImg} alt="1" />
            &nbsp; 测评结果
          </div>
          <div className={styles.scoreBox}>
            <div className={styles.text}>您本次评测结果风险系数</div>
            <div className={styles.score} style={{ color: checkColor(data.content) }}>
              {data.score}%
            </div>
            {/* <div>
              <Tag size="medium" type="primary" color={checkColor(data.content)}>
                {data.content}
              </Tag>
            </div> */}
          </div>
        </div>
      </div>
      <div className={styles.cardBox}>
        <div className={styles.card}>
          <div className={styles.title}>
            <img src={fenxiImg} alt="1" />
            &nbsp; 结果分析
          </div>
          {/* <div className={styles.scoreBox}>
            <Range data={range} content={data.content} score={data.totalScore} />
          </div> */}
          <div className={styles.remark}>
            <div>
              蕾波婴幼儿脑瘫危险程度百分数表自测结果风险系数越高，则患儿童脑损伤的可能性越大。测评结果不代表诊断结果，建议您联系客服预约蕾波专业评估，进一步精准评定！
            </div>
            <div className={styles.kefu}>客服咨询预约电话：400-898-6862</div>
            <div className={styles.kefu}>附近中心预约评估：</div>
            <div className={styles.area}>总部</div>
            <div>北京市西城区南礼士路19号</div>
            <div className={styles.area}>济南中心</div>
            <div>山东省济南市槐荫区南辛庄中街69号</div>
            <div className={styles.area}>武汉中心</div>
            <div>湖北省武汉市洪山区卓刀泉路楚康路9附107号商铺</div>
          </div>
        </div>
      </div>
    </>
  );
}

function Range({ data, content, score }) {
  const widthUnit = 320 / data[2];
  const left = (score / data[2]) * 320 - 15;

  return (
    <>
      {data.length > 0 && (
        <div className={styles.rangeBox}>
          <div style={{ width: widthUnit * data[0] }} className={styles.pipe}>
            <span>低风险</span>
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
