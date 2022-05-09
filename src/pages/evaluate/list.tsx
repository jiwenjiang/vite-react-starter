import Topbar from '@/comps/TopBar';
import VList from '@/comps/VList';
import request from '@/service/request';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './list.module.less';

export default function App() {
  const [height, setHeight] = useState(600);
  const [data, setData] = useState([]);
  const total = useRef(1);
  const params = useRef({ pageNo: 1, pageSize: 10, patientId: null });
  const isLoading = useRef(false);
  const [loadingText, setLoadingText] = useState('正在加载中');
  const navigate = useNavigate();

  const onLoad = () => {
    if (total.current > params.current.pageNo && !isLoading.current) {
      isLoading.current = true;
      params.current.pageNo++;
      getList();
    }
  };

  const getList = async (init?: boolean) => {
    const res = await request({
      url: '/scaleRecord/list',
      data: params.current,
    });
    total.current = res.data?.page?.totalPage;
    if (total.current === params.current.pageNo) {
      setLoadingText('无更多数据了~');
    }
    setData(init ? res.data?.records : [...data, ...res.data?.records]);
    isLoading.current = false;
  };

  useEffect(() => {
    const h = document.body.offsetHeight;
    setHeight(h);
    getList(true);
  }, []);

  const toReport = async (v) => {
    if ([1, 2, 3, 4].includes(v.scaleTableCode)) {
      navigate(`/evaluate/zibizheng/${v.id}`);
      return;
    }
    if ([6].includes(v.scaleTableCode)) {
      navigate(`/evaluate/feelDetail/${v.id}`);
      return;
    }
    if ([7].includes(v.scaleTableCode)) {
      navigate(`/evaluate/growDetail/${v.id}`);
      return;
    }
    if ([9].includes(v.scaleTableCode)) {
      navigate(`/evaluate/brainDetail/${v.id}`);
      return;
    }
  };

  const toDetail = async (v) => {
    navigate(`/evaluate/detail/${v.id}`);
  };

  return (
    <div className={styles.box}>
      <Topbar title="自测量表记录" />
      <VList
        renderFn={(d) => Card(d, toReport, toDetail)}
        data={data}
        itemSize={166}
        height={height}
        onLoad={onLoad}
        loadingText={loadingText}
      />
    </div>
  );
}

function Card(data, report, detail) {
  const toReport = () => {
    report?.(data);
  };

  const toDetail = () => {
    detail?.(data);
  };

  return (
    <div className={styles.cardBox}>
      <div className={styles.card}>
        <div className={styles.scaleName}>{data?.scaleName}</div>
        <div className={styles.kv}>
          <div className={styles.k}>量表类型</div>
          <div className={styles.v}>{data?.scaleClassification}</div>
        </div>
        <div className={styles.kv}>
          <div className={styles.k}>自测时间</div>
          <div className={styles.v}>{data?.time}</div>
        </div>
        <div className={styles.btnbox}>
          <div
            className={styles.btn}
            style={{ borderRight: '1px solid #f0f0f0' }}
            onClick={() => toReport()}>
            查看报告
          </div>
          <div className={styles.btn} onClick={() => toDetail()}>
            量表详情
          </div>
        </div>
      </div>
    </div>
  );
}
