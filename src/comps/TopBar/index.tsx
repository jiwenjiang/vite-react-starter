import React from 'react';
import { NavBar } from 'react-vant';
import styles from './index.module.less';

function Topbar({ title, showBack = false }: { title: string; showBack?: boolean }) {
  const back = () => {
    history.back();
  };

  return (
    <div className={styles.box}>
      <NavBar title={title} leftArrow={showBack} onClickLeft={() => back()} />
    </div>
  );
}

export default Topbar;
