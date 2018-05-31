import request from '../../request';
import { ModalDelete } from 'ufec';
import React from 'react';
import { Alert } from 'antd';
import __ from 'client/locale/dashboard.lang.json';
import getErrorMessage from '../../../../utils/error_message';
// import config from './config';

const deletePool = (currentType, props, data) => {
  let untie = [];
  let delete_tip = __.cannot_delete_pool_tip;
  data.map(d => {
    if(d.tiernames.length > 0) {
      untie.push(d.pool_name);
    }
  });
  if(untie.length > 0) {
    delete_tip = untie.join('，') + delete_tip;
  }
  let hide = untie.length === 0 ? false : true;
  let delProps = {
    action: 'delete',
    __: __,
    data: data,
    type: 'pool',
    disabled: hide,
    nameType: 'pool_name',
    children: <div className={hide ? 'pool-pop-tip' : 'hide'}>
      <Alert type="warning" message={delete_tip} showIcon={true} />
    </div>,
    onDelete: function(data, cb) {
      request.deletePools(data).then(() => {
        cb(true);
      }).catch(err => {
        cb(false, getErrorMessage(err));
      });
    },
  };
  ModalDelete(delProps);
};

export default deletePool;