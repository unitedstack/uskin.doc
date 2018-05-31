import {ModalV2} from 'ufec';
import config from './config';
import __ from 'client/locale/dashboard.lang.json';
import getErrorMessage from '../../../../utils/error_message';

import request from '../../request';
let ids = [], poolNames = [], treeNode = [];
const osdObj = {
  rack: [],
  host: []
};
function getIds(treeData, _rack, _host, value, hasOsd) {
  treeData.forEach(tree => {
    if (hasOsd) {
      if (tree.type === 'osd' && !tree.disabled) {
        ids.push(tree.id);
      } else {
        osdObj[tree.type] && osdObj[tree.type].indexOf(tree.name) === -1 && osdObj[tree.type].push(tree.name);
        tree.children && getIds(tree.children, _rack, _host, value, true);
      }
    } else if (tree.name === value) {
      if (tree.type === 'osd' && !tree.disabled) {
        ids.push(tree.id);
        _rack && osdObj.rack.indexOf(_rack) === -1 && osdObj.rack.push(_rack);
        _host && osdObj.host.indexOf(_host) === -1 && osdObj.host.push(_host);
      } else {
        osdObj[tree.type] && osdObj[tree.type].indexOf(tree.name) === -1 && osdObj[tree.type].push(tree.name);
        tree.children && getIds(tree.children, _rack, _host, value, true);
      }
    } else {
      if (tree.type === 'rack') {
        _rack = tree.name;
      } else if (tree.type === 'host') {
        _host = tree.name;
      }
      tree.children && getIds(tree.children, _rack, _host, value);
    }
  });
}

function rackDisabeld(rack) {
  rack.disabled = rack.children.every(host => {
    let hostDisabled = host.children.every(r => r.device_class);
    host.disabled = hostDisabled;
    return hostDisabled;
  });
}

function getData(tree, poolClass) {
  tree.forEach((t, index) => {
    if (t.type === 'rack') {
      rackDisabeld(t);
    }
    if (t.children) {
      getData(tree[index].children, poolClass);
    } else if (t.device_class) {
      if (t.device_class === poolClass) {
        poolNames.push(t.name);
      } else {
        t.disabled = true;
      }
    }
  });
}

function pop(obj, parent, callback) {
  config.fields[0].text = obj.pool_name;
  let props = {
    __: __,
    parent: parent,
    config: config,
    onInitialize: function (form, updateFields) {
      request.getOsdTreeList().then(res => {
        poolNames = [];
        getData(res, obj.metadata_class);
        treeNode = res;

        updateFields({
          OSD: {
            treeData: res,
            hide: false
          }
        });

        form.setFields({
          OSD: {
            value: poolNames
          }
        });
      });
    },
    onConfirm: function (values, cb, closeImmediately) {
      let value = values.OSD, length = 3;
      ids = [];
      osdObj.host = [];
      osdObj.rack = [];
      value && value.forEach(v => {
        getIds(treeNode, null, null, v);
      });
      if (obj.strategy.constructor === Number) {
        length = obj.strategy;
      } else if (obj.strategy.constructor === String) {
        let strategy = obj.strategy.split('+');
        length = Number(strategy[0]) + Number(strategy[1]);
      }
      if (ids.length < length) {
        cb(false, __.osd_tip);
      } else if (osdObj[obj.crush_failure_domain].length < length) {
        cb(false, __.domian_tip.replace('{0}', length).replace('{1}', __[obj.crush_failure_domain]));
      } else {
        request.modifyOsd(ids, obj.pool_name).then(res => {
          cb(true);
          callback && callback();
        }).catch(error => {
          cb(false, getErrorMessage(error));
        });
      }
    },
    onAction: function (field, value, form) {
    }
  };

  ModalV2(props);
}

export default pop;
