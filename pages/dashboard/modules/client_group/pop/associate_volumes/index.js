import {ModalV2} from 'ufec';
import config from './config';
import __ from 'client/locale/dashboard.lang.json';
import request from '../../request';
import getErrorMessage from '../../../../utils/error_message';


function getAssociatedDisks(disks) {
  const diskList = disks.map(disk => {
    return {
      id: disk.id,
      name: disk.name + ' (' + __.pool + ': ' + disk.pool +')',
      suggestAssociating: disk.groups.length === 0 ? true : false
    };
  });
  return diskList;
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

      request.getDisks().then(res => {
        const diskList = getAssociatedDisks(res.data);
        updateFields({
          volumes: {
            data: diskList
          }
        });
        form.setFields({
          volumes: {
            value: data.disks.map((disk) => {
              return disk.id;
            })
          }
        });
      });
    },
    onConfirm: function(values, cb) {
      const reqData = {};
      const clientGroupName = data.name;
      const selectedDiskIdList = values.volumes;
      reqData.members = data.members;
      reqData.disks = selectedDiskIdList;

      request.associateVolumes(clientGroupName, reqData).then(() => {
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
