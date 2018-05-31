import './style/index.less';

import React from 'react';
import { Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import __ from 'client/locale/dashboard.lang.json';

/**
 * 表格中当访问路径或块存储卷数量多于1时候的额外行展示的组件
 * data 就是表格中的那一行数据
 */
function ExpandRow(props) {
  const data = props.data;
  return (
    <div className="client-group-expand-row">
      <div className="group-name">
        <span>{__.name + ': '}</span>
        <span>{data.name}</span>
      </div>
      <div className="access-path clear-fix">
        <div>{__.client + ': '}</div>
        <ul className="clear-fix">
          {
            data.members.map((iqnName, idx) => {
              return (
                <li key={String(idx)}>
                  <Tooltip title={iqnName}>
                    <Link to={`/iscsi_mgmt/${iqnName}`}>
                      {iqnName}
                    </Link>
                  </Tooltip>
                </li>
              );
            })
          }
        </ul>
      </div>
      <div className="volume clear-fix">
        <div>{__._volume + ': '}</div>
        <ul className="clear-fix">
          {
            data.disks.map(disk => {
              return (
                <li key={disk.id}>
                  <Tooltip title={disk.name}>
                    <Link to={`/block_mgmt/${disk.id}`}>
                      {disk.name}
                    </Link>
                  </Tooltip>
                </li>
              );
            })
          }
        </ul>
      </div>
    </div>
  );
}

export default ExpandRow;
