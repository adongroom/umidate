import React from 'react';
import styles from './common.less'
export default ({dataSet=[]} ) => {
  return (
    <div className={styles.photo}>
      {dataSet.map((i:any,index:any)=><p key={index}><img src={i.photo} alt=""/></p>)}
    </div>
  );
}
