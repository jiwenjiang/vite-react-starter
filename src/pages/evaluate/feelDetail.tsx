import Topbar from '@/comps/TopBar';
import request from '@/service/request';
import jieguoImg from '@/static/imgs/pingce.png';
import yonghuImg from '@/static/imgs/yonghu.jpg';
import * as echarts from 'echarts';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'react-vant';
import styles from './feelDetail.module.less';

export default function App() {
  return (
    <div className={styles.box}>
      <Topbar title="感统量表测评结果" />
      <Card />
    </div>
  );
}

const num = 320;

function Card() {
  const [data, setData] = useState<any>({});
  const params = useParams();

  useEffect(() => {
    (async () => {
      const res = await request({
        url: '/scaleRecord/get',
        data: { id: params.id },
      });
      setData(res.data);
      renderchart();
    })();
  }, []);

  const renderchart = () => {
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      legend: {
        top: 'bottom',
        show: false,
      },
      toolbox: {
        show: false,
      },
      series: [
        {
          name: '感统',
          type: 'pie',
          top: 0,
          radius: [10, 80],
          center: ['50%', '50%'],
          roseType: 'area',
          label: {
            formatter: function (params) {
              console.log(params, 123);
              let res = `{a|${params.name}}\n{b|${params.value}}`;
              console.log(res);
              return res;
            },
            rich: {
              a: {
                color: 'gray',
              },
              b: {
                color: 'green',
              },
            },
          },
          labelLine: {
            length: 10,
            length2: 0,
            show: false,
          },
          itemStyle: {
            borderRadius: 8,
          },
          data: [
            { value: 40, name: 'rose 1', name2: '111' },
            { value: 38, name: 'rose 2', name2: '112' },
            { value: 32, name: 'rose 3', name2: '113' },
            { value: 30, name: 'rose 4', name2: '114' },
            { value: 28, name: 'rose 5', name2: '115' },
          ],
        },
      ],
    };

    option && myChart.setOption(option);
  };

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
            <img src={jieguoImg} alt="1" />
            &nbsp; 测评结果
          </div>
          <div className={styles.desc}>您的报告已产生，有问题可以咨询客服～</div>
          <div className={styles.chartBox}>
            <canvas
              id="main"
              style={{ width: num, height: num }}
              width={num}
              height={num}></canvas>
          </div>
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
