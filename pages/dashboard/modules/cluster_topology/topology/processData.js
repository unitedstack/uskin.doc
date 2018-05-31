import config from './config';
import utils from './utils';

const oneLineMaxOsdNumber = config.disk.oneLineMaxNumber;
const statusList = ['health', 'warning', 'error'];

function processData(data, canvasWidth) {
  let ret = JSON.parse(JSON.stringify(data));

  // 根据canvas的宽度决定每行放几个机架
  const rowNumbers = Math.floor( canvasWidth / (config.group.width + 10) );

  const hasRack = ret.some(r => {
    return r.children.find(c => c.type === 'rack');
  });

  // 存在有机架和没机架两种情况
  // 没有机架的时候root当作机架
  if(hasRack) {
    ret.forEach(r => {
      // 将机架的数组按照每行最大放置的个数，拆分为多行数组
      r.children = utils.splitArray(r.children, rowNumbers);
      processChildren(r.children);
    });
  } else {
    ret = utils.splitArray(ret, rowNumbers);
    processChildren(ret);
  }

  function processChildren(children) {
    let maxRowHeightList = [];
    const groupLeftWidth = config.groupPadding.left + config.wrapper.width + config.disk.firstMargin;
    children.forEach((rowRack, rowRackIndex) => {
      // 分行计算每个机架的坐标
      rowRack.forEach((rack, rackIndex) => {
        // group中服务器中最多osd的个数
        const maxOsdNumber = Math.max.apply(null, rack.children.map(h => h.children.length));
        // group中一行最多放几个osd
        const oneLineOsdNumber = maxOsdNumber > oneLineMaxOsdNumber ? oneLineMaxOsdNumber : maxOsdNumber;
        const openWidth = groupLeftWidth + config.disk.firstMargin
          + (config.disk.margin + config.disk.width) * oneLineOsdNumber;
        const maxServerHeight = (config.server.height + 2) * rack.children.length;
        const maxOsdHeight = Math.ceil(maxOsdNumber / oneLineMaxOsdNumber) * (config.disk.height + config.disk.margin) + 40;
        const openHeight = Math.max(maxServerHeight, maxOsdHeight) + config.groupPadding.top + 30;

        rack.position = {
          x: 10 + rackIndex * (config.group.width + 10),
          y: 10 + rowRackIndex * (openHeight + 10),
          openWidth: openWidth,
          openHeight: openHeight,
          linkEndY: openHeight / 2,
          // osd背景wrapper的位置
          wrapper: {
            x: groupLeftWidth - 4,
            y: config.groupPadding.top,
            width: (config.disk.width + config.disk.margin) * oneLineOsdNumber + 8,
            height: openHeight - config.groupPadding.top - config.innerPadding * 2
          }
        };
        // host
        rack.children.forEach((host, hostIndex) => {
          host.position = {
            x: config.groupPadding.left + config.innerPadding,
            y: config.groupPadding.top + config.innerPadding + hostIndex * (config.server.height + 2),
            // 用于画连线，连线的起始高度。
            startY: config.groupPadding.top + config.innerPadding + hostIndex * (config.server.height + 2) + 0.5 * config.server.height
          };
          // 根据该服务器中的osd的状态来决定服务器的状态。
          host.topology_status = 'health';

          host.children = utils.splitArray(host.children, oneLineMaxOsdNumber);
          host.children.forEach((disk, diskIndex) => {
            disk.forEach((osd, osdIndex) => {
              osd.position = {
                x: groupLeftWidth + (config.disk.width + config.disk.margin) * osdIndex,
                y: config.groupPadding.top + config.innerPadding + diskIndex * (config.disk.height + config.disk.margin)
              };
              osd.topology_status = (() => {
                // 使用状态为IN && 进程状态为可用
                if(osd.status === 'up' && osd.reweight !== 0) {
                  return 'health';
                }
                // 使用状态为IN && 进程状态不可用
                else if(osd.status !== 'up' && osd.reweight != 0) {
                  return 'error';
                }
                return 'warning';
              })();
              // 如果osd中有优先级更高的状态，服务器状态升级。
              if(statusList.indexOf(osd.topology_status) > statusList.indexOf(host.topology_status)) {
                host.topology_status = osd.topology_status;
              }
            });
          });
        });
      });
      // 每行的最大高度取决于该行的最大机架高度
      const maxRowHeight = Math.max.apply(null, rowRack.map(rr => rr.position.openHeight));
      maxRowHeightList.push(maxRowHeight);
      rowRack.forEach((rr) => {
        rr.position.openHeight = maxRowHeight;
        rr.position.y = 10 + rowRackIndex * (maxRowHeightList[rowRackIndex ? rowRackIndex - 1 : 0] + 10);
      });
    });
  }

  return ret;
}

export default processData;
