import {ModalV2} from 'ufec';
import config from './config';
import __ from 'client/locale/dashboard.lang.json';
import request from '../../request';
import getErrorMessage from '../../../../utils/error_message';

/**
 * 处理一下客户端与卷的数组内容，方便传入 select
 * @param {object} res 包含客户端列表和卷列表的对象
 */
function normalizeData(res) {
  const clients = [];
  res.clients.forEach(client => {
    // 只有未关联卷的客户端才可以加入组中
    if(client.disks.length === 0) {
      clients.push({
        id: client.id,
        name: client.wwn,
        groupName: client.group_name
      });
    }
  });

  const disks = res.disks.map((disk) => {
    return {
      id: disk.id,
      name: disk.name + ' (' + __.pool + ': ' + disk.pool +')',
      suggestAssociating: disk.groups.length === 0 ? true : false
    };
  });

  return {
    clients,
    disks
  };
}

function pop(data, callback) {
  let props = {
    __: __,
    config: config,
    onInitialize: function(form, updateFields) {
      request.getClientsAndDisks().then(res => {
        const normalizedData = normalizeData(res);
        updateFields({
          associate_clients: {
            data: normalizedData.clients
          },
          volumes: {
            data: normalizedData.disks
          }
        });
      });
    },
    onConfirm: function(values, cb) {
      const reqData = {};
      const clientGroupName = values.client_group;
      const selectedClientIdList = values.associate_clients;
      const selectedDiskIdList = values.volumes;

      reqData.group = clientGroupName;
      reqData.members = selectedClientIdList || [];
      reqData.disks = selectedDiskIdList || [];
      request.createClientGroup(reqData).then(() => {
        cb(true);
        callback && callback();
      }).catch(err => {
        cb(false, getErrorMessage(err));
      });
    }
  };

  ModalV2(props);
}

export default pop;
