import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import Albutm from '@/components/albutm';
import { Table, Input, Button, Popover, Modal } from 'antd';

const { Search } = Input;

import styles from './index.less';
import { getMyClassList } from './service';
export default () => {
  const [loading, setLoading] = useState(true);
  const [Visible, setVisible] = useState(false);
  const [dataSet, setData] = useState([]);
  const [Album, setAlbum] = useState({
    list: [],
    uploadnum: 0,
    total: 0,
  });
  const [pagination, setPage] = useState({
    pageSize: 20,
    current: 1,
    total: 0,
  });
  const classColumns: any = [
    {
      title: '班级名称',
      render: (e: any) => {
        return (
          <a
            onClick={() => {
              console.log('e:', e);
              history.push({
                pathname: '/classdetail',
                query: { ClassCode: e.classcode },
              });
            }}
          >
            {e.classname}
          </a>
        );
      },
    },
    {
      title: '年级',
      dataIndex: 'gradname',
    },
    {
      title: '辅导员',
      dataIndex: 'instructor',
    },
    { title: '班主任', dataIndex: 'headmaster' },
    { title: '学生总数', dataIndex: 'studentnumber' },
    {
      title: '班委',
      width: 100,
      render: (e: any) => {
        const content = (
          <div>
            {e.classcommitteelist.list.map((i: any, index: number) => (
              <p key={index}>
                {i.position}:{i.name}
              </p>
            ))}
          </div>
        );
        return (
          <Popover content={content} title="班委">
            <a>{e.classcommitteelist.total}</a>
          </Popover>
        );
      },
    },
    {
      title: '操作',
      width: 100,
      render: (e: any) => (
        <a
          onClick={() => {
            setAlbum(e.classalbum || {});
            setVisible(true);
          }}
        >
          班级相册
        </a>
      ),
    },
  ];
  /* init*/
  useEffect(() => {
    setLoading(true);
    getClassData({
      Count: pagination.pageSize,
      Page: pagination.current,
    });
  }, [pagination.current]);

  /*  methods*/

  const getClassData = (payload: any) => {
    getMyClassList(payload).then((r: any) => {
      const res = r?.data;
      if (!res?.FeedbackCode) {
        pagination.total = res?.Data?.total;
        setPage(pagination);
        setData(res?.Data?.list || []);
      }
      setLoading(false);
    });
  };
  const handleTableChange = (p: any) => {
    setPage(p);
  };

  const onClassQuery = (v: any) => {
    console.log('value', v);
    getClassData({
      Count: pagination.pageSize,
      Page: pagination.current,
      Search: v,
    });
  };

  const footer = (
    <div className={styles.top} style={{ marginBottom: 0 }}>
      <div>
        已上传头像{Album.uploadnum}人，未上传{Album.total - Album.uploadnum}人
      </div>
      <Button type="primary" onClick={() => setVisible(false)}>
        关闭
      </Button>
    </div>
  );
  return (
    <div className="mt">
      <div className={styles.top}>
        <div>共计{pagination.total}个班</div>
        <Search
          placeholder="请输入班级名称"
          onSearch={onClassQuery}
          style={{ width: 200 }}
        />
      </div>

      {!dataSet.length ? (
        <div>暂无数据</div>
      ) : (
        <Table
          loading={loading}
          columns={classColumns}
          dataSource={dataSet}
          pagination={pagination}
          rowKey={(record: any) => record.classcode}
          onChange={handleTableChange}
        ></Table>
      )}

      <Modal
        title="班级相册"
        width="96%"
        visible={Visible}
        footer={footer}
        onCancel={() => setVisible(false)}
      >
        <Albutm dataSet={Album.list} />
      </Modal>
    </div>
  );
};
