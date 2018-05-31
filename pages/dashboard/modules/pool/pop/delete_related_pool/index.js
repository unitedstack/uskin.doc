import request from '../../request';
import { ModalAlert } from 'ufec';
import getErrorMessage from '../../../../utils/error_message';

const coldPool = 'metadata,data,block,cloud,iscsi';
const hotPool = 'cache';

const deleteRelatedPool = (currentType, props, data, callback) => {
  const coldPoolName = currentType === coldPool ? data.pool_name : data.tiername_of;
  const hotPoolName = currentType === hotPool ? data.pool_name : data.tiernames[0];
  console.log(coldPoolName, hotPoolName);
  ModalAlert({
    __: props.__,
    title: ['delete_related_pool'],
    message: props.__.delete_related_pool_tip.replace('{0}', coldPoolName).replace('{1}', hotPoolName),
    tip_type: 'error',
    btnValue: 'delete',
    btnType: 'delete',
    onAction: (cb) => {
      request.deleteRelatedPool(coldPoolName, hotPoolName).then(res => {
        cb(true);
        callback && callback();
      }).catch(err => {
        cb(false, getErrorMessage(err));
      });
    }
  });
};

export default deleteRelatedPool;