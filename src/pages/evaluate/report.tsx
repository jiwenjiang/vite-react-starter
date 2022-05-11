import Topbar from '@/comps/TopBar';
import useCheckUser from '@/hooks/checkUser';
import request from '@/service/request';
import fenxiImg from '@/static/imgs/fenxi.png';
import jieguoImg from '@/static/imgs/pingce.png';
import yonghuImg from '@/static/imgs/yonghu.jpg';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './report.module.less';

export default function App() {
  useCheckUser();
  return (
    <div className={styles.box}>
      <Topbar title="医生评估结果" />
      <Card />
    </div>
  );
}

function Card() {
  const [data, setData] = useState<any>({});
  const navigate = useNavigate();
  const params = useParams();

  const nav = (v) => {
    navigate(v.url);
  };

  useEffect(() => {
    (async () => {
      const res = await request({
        url: '/scaleRecord/report',
        data: { id: params.id },
      });
      setData(res.data);
      console.log('🚀 ~ file: report.tsx ~ line 37 ~ res', res);
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
            <span className={styles.v}>
              {data.gender === 1 ? '男' : data.gender === 2 ? '女' : '未知'}
            </span>
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
            <img src={jieguoImg} alt="1" />
            &nbsp; 医生评估
            <span className={styles.date}>{data.evaluateDate}</span>
          </div>
          <div className={styles.remark}>{data.conclusion}</div>
          <div className={styles.k}>评估结果不代表诊断结果</div>
        </div>
      </div>
      <div className={styles.cardBox}>
        <div className={styles.card}>
          <div className={styles.title}>
            <img src={fenxiImg} alt="1" />
            &nbsp; 量表信息
          </div>
          <div className={styles.kv2}>
            <span className={styles.k}>量表名称：</span>
            <span className={styles.v}>{data.scaleTableName}</span>
            <Link to={`/evaluate/detail/${params.id}`}>
              <span className={styles.link}>量表详情</span>
            </Link>
          </div>
          <div className={styles.kv2}>
            <span className={styles.k}>筛查时间：</span>
            <span className={styles.v}>{data.created}</span>
          </div>
          <div className={styles.kv2}>
            <span className={styles.k}>自筛得分：</span>
            <span className={styles.v}>{data.userScore}</span>
          </div>
          <div className={styles.kv2}>
            <span className={styles.k}>医生评估：</span>
            <span className={styles.v}>{data.doctorScore}</span>
          </div>
          <div className={styles.table}>
            <div className={styles.head}>
              <div className={styles.col1}>题目</div>
              <div className={styles.col2}>自筛选择</div>
              <div className={styles.col2}>自筛得分</div>
              <div className={styles.col2}>医生评估</div>
            </div>
            <div className={styles.body}>
              {data.answers?.map((v, i) => (
                <div key={i} className={styles.li}>
                  <div className={styles.col1}>{v.name}</div>
                  <div className={styles.col2}>{v.answer}</div>
                  <div className={styles.col2}>{v.userScore}</div>
                  <div className={styles.col2}>{v.doctorScore}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
