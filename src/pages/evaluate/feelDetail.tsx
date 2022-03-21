import Topbar from '@/comps/TopBar';
import request from '@/service/request';
import fenxiImg from '@/static/imgs/fenxi.png';
import jieguoImg from '@/static/imgs/pingce.png';
import yonghuImg from '@/static/imgs/yonghu.jpg';
import * as echarts from 'echarts';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Collapse, Tag } from 'react-vant';
import styles from './feelDetail.module.less';

const colorMap = {
  正常: '#3D8AFD',
  轻度失调: '#2EC25B',
  中度失调: '#FF7D41',
  重度失调: '#EBEDF0',
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

const num = 320;

function Card() {
  const [data, setData] = useState<any>({});
  const params = useParams();
  const [arr, setArr] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await request({
        url: '/scaleRecord/get',
        data: { id: params.id },
      });
      setData(res.data);
      const chartArr = res.data?.record?.map((v) => ({
        name: v.subject,
        value: v.score,
      }));
      setArr(res.data?.record);
      renderchart(chartArr);
    })();
  }, []);

  const renderchart = (arr) => {
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
            overflow: 'break',
            formatter: function (params) {
              let res = `{a|${params.name}}\n{c|未发育  }{b|${params.value}}`;
              console.log(res);
              return res;
            },
            rich: {
              verticalAlign: 'bottom',
              a: {
                color: '#181818',
                fontWeight: 'bold',
                lineHeight: 17,
              },
              b: {
                color: '#3D8AFD',
                fontSize: 17,
                fontWeight: 'bold',
              },
              c: {
                color: 'gray',
              },
            },
          },
          labelLine: {
            length: 15,
            length2: 5,
            // show: false,
          },
          itemStyle: {
            borderRadius: 8,
          },
          data: arr,
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
      <Collapse initExpanded={[0]}>
        {arr?.map((v, i) => (
          <div className={styles.cardBox} key={i}>
            <div className={styles.card2}>
              <Collapse.Item
                title={
                  <div className={styles.itemTitle}>
                    <img src={fenxiImg} alt="1" />
                    {v.subject}
                    <Tag
                      size="medium"
                      type="primary"
                      style={{ marginLeft: 10 }}
                      color={checkColor(v.content)}>
                      {v.content}
                    </Tag>
                  </div>
                }
                name={i}>
                <div className={styles.item}>
                  {v.subject}
                  {v.content}：{v.remark}
                </div>
              </Collapse.Item>
            </div>
          </div>
        ))}
      </Collapse>

      <div className={styles.btnBox}>
        <Button className={styles.btn} type="primary" block>
          对报告有疑问？立刻联系客服
        </Button>
      </div>
    </>
  );
}
