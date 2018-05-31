import '../style/index.less';

import React from 'react';
import __ from 'client/locale/dashboard.lang.json';
import moment from 'moment';

/**
 * 表格中当访问路径或块存储卷数量多于1时候的额外行展示的组件
 * data 就是表格中的那一行数据
 */
function ExpandRow(props) {
  const data = props.data;
  return (
    <ul className="alert-silence-expand-row">
      {
        data.matchers.map((matcher, index) => {
          return (
            <li key={String(index)}>
              <div className="expand-row-data-name">{__.matching_rule + ':'}</div>
              <div className="expand-row-data-value">
                {
                  matcher.name + ' = ' + matcher.value
                }
              </div>
              {
                matcher.isRegex && <div className="expand-row-data-value">{__.match_regular} </div>
              }
            </li>
          );
        })
      }
      <li key="startsAt">
        <div className="expand-row-data-name">{__.start_time}</div>
        <div className="expand-row-data-value">
          { moment(data.startsAt).format('YYYY:MM:DD HH:mm') }
        </div>
      </li>
      <li key="endsAt">
        <div className="expand-row-data-name">{__.end_time}</div>
        <div className="expand-row-data-value">
          { moment(data.endsAt).format('YYYY:MM:DD HH:mm') }
        </div>
      </li>
      <li key="updatedAt">
        <div className="expand-row-data-name">{__.updated_time}</div>
        <div className="expand-row-data-value">
          { moment(data.updatedAt).format('YYYY:MM:DD HH:mm') }
        </div>
      </li>
      {
        data.comment && (
          <li key="comment">
            <div className="expand-row-data-name">{__.comment}</div>
            <div className="expand-row-data-value">
              {data.comment}
            </div>
          </li>
        )
      }
    </ul>
  );
}

export default ExpandRow;
