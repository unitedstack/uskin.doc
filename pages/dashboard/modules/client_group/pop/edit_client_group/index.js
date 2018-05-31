import {ModalV2} from 'ufec';
import config from './config';
import __ from 'client/locale/dashboard.lang.json';
import request from '../../request';
import getErrorMessage from '../../../../utils/error_message';


/**
 * 提供一个客户端列表供 select 使用
 * @param {array} clients 所有的客户端
 */
function getAssociatedClients(clients) {
  const clientList = [];
  clients.forEach(client => {
    // 只有未关联卷的客户端才可以加入组中
    if(client.disks.length === 0) {
      clientList.push({
        id: client.id,
        name: client.wwn,
        groupName: client.group_name
      });
    }
  });
  return clientList;
}

function pop(data, callback) {
  let props = {
    __: __,
    config: config,
    onInitialize: function(form, updateFields) {
      form.setFields({
        client_group: {
          value: data.name
        }
      });

      request.getClients().then(res => {
        const clientList = getAssociatedClients(res.data);

        updateFields({
          associate_clients: {
            data: clientList
          }
        });
        form.setFields({
          associate_clients: {
            value: data.members
          }
        });
      });
    },
    onConfirm: function(values, cb) {
      const reqData = {};
      const clientGroupName = data.name;
      const selectedClientIdList = values.associate_clients;
      const diskIdList = data.disks.map(disk => {
        return disk.id;
      });

      reqData.members = selectedClientIdList;
      reqData.disks = diskIdList;
      request.editClientGroup(clientGroupName, reqData).then(() => {
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
