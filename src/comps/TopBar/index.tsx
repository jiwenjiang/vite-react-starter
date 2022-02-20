import React, { useEffect } from 'react';
import styles from './index.module.less';

function Topbar({ title }: { title: string; showBack?: boolean }) {
  // const back = () => {
  //   history.back();
  // };

  useEffect(() => {
    document.title = title;
  }, []);

  return (
    <div className={styles.box}>
      {/* <NavBar title={title} leftArrow={showBack} onClickLeft={() => back()} /> */}
    </div>
  );
}

export default Topbar;
