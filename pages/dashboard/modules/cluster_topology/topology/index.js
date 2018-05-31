import omg from 'omg.js';
// import omg from '../../../../../../../../github/omg.js/dist/omg.min.js';
import images from './images';
import linkLine from './expand/link_line';
import osd from './expand/osd';
import drawServer from './shapes/server';
import drawDisk from './shapes/disk';
import drawLink from './shapes/link';
import drawGroup from './shapes/group';

import processData from './processData';
import config from './config';
import utils from './utils';

class Topology {

  /**
   * @param {Array} data      - 集群拓扑的树桩结构
   * @param {Object} settings - 用于调用页面dom的配置接口
   */
  constructor(data, settings) {
    this.wrapper = document.getElementById('canvas-wrapper');
    this.data = processData(data, this.wrapper.clientWidth);
    this.onAction = settings.onAction;
    this.stage = null;
  }

  init() {
    this.stage = omg({
      element: document.getElementById('canvas'),
      width: this.wrapper.clientWidth,
      height: this.wrapper.clientHeight,
      minDeviceScale: 0.2,
      enableGlobalTranslate: true,
      enableGlobalScale: true,
      images: images,
      prepareImage: () => {
        this.onAction('hideLoading');
      }
    });
    this.stage.resize({
      width: () => this.wrapper.clientWidth,
      height: () => this.wrapper.clientHeight,
      resize: (update) => {
        update();
      }
    });

    this.stage.extend({
      linkLine: linkLine,
      osd: osd
    });

    this.stage.init();

    this.dealMouseCursor();

    this.render();
  }

  // 处理拖拽鼠标指针
  dealMouseCursor() {
    const ele = this.stage.element;
    this.stage.utils.bind(ele, 'mousedown', () => {
      ele.className = 'grabbing';
    });
    this.stage.utils.bind(ele, 'mouseup', () => {
      ele.className = 'grab';
    });
  }

  refreshData(data) {
    this.data = processData(data, this.wrapper.clientWidth);
  }

  getStage() {
    return this.stage;
  }

  drawLink(settings) {
    const link = drawLink(this.stage, {
      startY: settings.startY,
      endY: settings.endY,
      hide: settings.hide
    }, {
      enter: {
        color: '#FE9D44'
      },
      leave: {
        color: '#ef8376'
      }
    });
    return link;
  }

  /**
   *
   * @param {Object} settings  -- 画服务器的配置参数
   * @param {Object} host      -- 服务器的数据信息，包括position，title等
   * @param {Array} row        -- 服务器所在的group所在的行中的所有group列表
   * @param {Shape} link       -- 当前group中所画的线（只此一条）
   * @param {Shape} osdWrapper -- 当前group中osd的背景wrapper
   */
  drawServer(settings, host, row, link, osdWrapper) {
    const openWidth = settings.openWidth;
    const openHeight = settings.openHeight;
    const _this = this;
    // draw host's disk
    const osdList = [];
    host.children.forEach(osd => {
      osd.forEach(_osd => {
        const o = _this.drawDisk({
          x: _osd.position.x,
          y: _osd.position.y,
          text: _osd.name
        }, _osd);
        o.isOsd = true;
        osdList.push(o);
      });
    });
    // 画关闭按钮
    const close = this.drawClose({
      x: openWidth - config.close.width,
      y: openHeight / 2 - config.close.height / 2
    }, row, link, osdWrapper);
    // 画服务器
    const server = drawServer(this.stage, {
      x: settings.x,
      y: settings.y,
      text: settings.text
    }, {
      enter: {
        img: `/public/assets/dashboard/server_${host.topology_status}_hover.png`
      },
      leave: {
        img: `/public/assets/dashboard/server_${host.topology_status}.png`
      },
      mousedown: function(cur) {
        if(_this.stage.animating) {
          return;
        }
        _this.onAction('server', host);
        // 如果group没有展开 && group没有正在动画中, 展开group，添加osd硬盘和close按钮
        if(!cur.parent.animating && !cur.parent.open) {
          const list = [close].concat(osdList);
          const index = row.indexOf(cur.parent);
          const afterRow = row.filter((r, i) => i > index);
          const moveWidth = openWidth - cur.parent.width;
          // 当前group展开
          cur.parent.open = true;
          cur.parent.animateTo({
            width: openWidth
          }, {
            easing: config.easing.type
          });
          // 处于当前group后边的同行的group向后移动
          afterRow.forEach(ar => {
            ar.animateTo({
              x: ar.x + moveWidth
            }, {
              easing: config.easing.type,
              // 在自身移动的同时更新所有子元素的位置
              onUpdate: (keys) => {
                ar.updateAllChildsPosition();
              }
            });
          });
          setTimeout(() => {
            // 连线出现
            link.hide = false;
            link.matrix = utils.changeLinkStartY(link.matrix, host.position.startY);
            osdWrapper.hide = false;
            // 添加硬盘
            cur.parent.add(list);
            cur.parent.updateAllChildsPosition();
            // 在页面上添加硬盘之后，把所有的硬盘都隐藏，然后再动态展开
            list.forEach(l => l.hide = true);
            list.forEach((l, i) => {
              setTimeout(() => {
                l.hide = false;
                _this.stage.redraw();
              }, i * 30);
            });
            _this.stage.redraw();
          }, 500);
        } else if(!cur.parent.animating && cur.parent.open) {
          // 如果group已经展开，又点击其他服务器，清空硬盘列表，更新为新点击的服务器。
          cur.parent.remove(child => child.isOsd);
          osdList.forEach(l => l.hide = false);
          cur.parent.add(osdList);
          // 更新所有子图形的位置坐标
          cur.parent.updateAllChildsPosition();
          // 更新Link的位置
          link.matrix = utils.changeLinkStartY(link.matrix, host.position.startY);
          _this.stage.redraw();
        }
      }
    });
    return server;
  }

  /**
   *
   * @param {Object} settings     -- 画关闭按钮的配置信息
   * @param {Array} row           -- 按钮所在group所在的行中的所有group列表
   * @param {Shape} link          -- 当前group中所画的线
   * @param {Shape} osdWrapper    -- 当前group中osd的背景wrapper
   */
  drawClose(settings, row, link, osdWrapper) {
    const _this = this;
    const close = this.stage.graphs.image({
      x: settings.x,
      y: settings.y,
      width: config.close.width,
      height: config.close.height,
      src: '/public/assets/dashboard/close.png'
    }).on('mouseenter', (cur) => {
      this.stage.element.className = 'pointer';
    }).on('mouseleave', (cur) => {
      this.stage.element.className = 'grab';
    }).on('mousedown', (cur) => {
      if(_this.stage.animating) {
        return;
      }
      if(!cur.hide) {
        _this.onAction('reset');
        const _osdList = cur.parent.children.filter(child => child.isOsd);
        const removeItems = [cur].concat(_osdList);
        const removeLength = _osdList.length + 1;
        const time = 30 * removeLength;
        for(let i = 0; i < removeLength; i++) {
          setTimeout(() => {
            removeItems[i].hide = true;
            _this.stage.redraw();
          }, time - i * 30);
        }
        setTimeout(() => {
          osdWrapper.hide = true;
        }, time);
        cur.parent.animateTo({
          width: config.group.width
        }, {
          delay: time,
          duration: 500,
          easing: config.easing.type,
          onFinish: () => {
            cur.parent.open = false;
            cur.parent.remove(child => child.isOsd);
            cur.parent.remove([cur]);
          }
        });
        const index = row.indexOf(cur.parent);
        const afterRow = row.filter((r, i) => i > index);
        const moveWidth = cur.parent.width - config.group.width;
        // 处于当前group后边的同行的group向前移动
        afterRow.forEach(ar => {
          ar.animateTo({
            x: ar.x - moveWidth
          }, {
            duration: 500,
            delay: time,
            easing: config.easing.type,
            // 在自身移动的同时更新所有子元素的位置
            onUpdate: (keys) => {
              ar.updateAllChildsPosition();
            }
          });
        });
        link.hide = true;
      }
    });
    return close;
  }

  drawDisk(settings, osd) {
    const type = osd.rotational.toString() === '1' ? 'hdd' : 'ssd';
    const _this = this;
    const server = drawDisk(this.stage, {
      x: settings.x,
      y: settings.y,
      text: settings.text,
      percent: osd.utilization / 100,
      topology_status: osd.topology_status,
      background: {
        img: `/public/assets/dashboard/${type}.png`
      }
    }, {
      enter: {
        img: `/public/assets/dashboard/${type}_hover.png`,
        color: '#42C2D4'
      },
      leave: {
        img: `/public/assets/dashboard/${type}.png`,
        color: '#fff'
      },
      mousedown(cur) {
        _this.onAction('osd', osd);
      }
    });
    return server;
  }

  drawGroup(settings, row) {
    const group = drawGroup(this.stage, {
      x: settings.x,
      y: settings.y,
      height: settings.height,
      title: {
        text: settings.name,
        fontSize: 14,
        paddingTop: 12,
        paddingLeft: 14,
        color: config.group.textColor
      }
    }, {});
    return group;
  }

  drawRectangle(settings) {
    const rectangle = this.stage.graphs.rectangle({
      x: settings.x,
      y: settings.y,
      width: settings.width,
      height: settings.height,
      radius: {
        tl: 4,
        tr: 4,
        bl: 4,
        br: 4
      },
      color: config.group.innerBackgroudColor,
      hide: settings.hide
    });
    return rectangle;
  }

  render() {
    this.stage.clear();
    const hasRack = this.data.some(data => {
      return data.children.some(child => {
        return child.find(c => c.type === 'rack');
      });
    });

    // 按照有没有rack这个层级进行绘制
    if(!hasRack) {
      this.data.forEach(d => {
        this.draw(d);
      });
    } else {
      this.data.forEach(data => {
        data.children.forEach(d => {
          this.draw(d);
        });
      });
    }
    this.stage.show();
  }

  draw(rack) {
    const groupList = [];
    const linkList = [];
    const osdWrapperList = [];
    rack.forEach(r => {
      // 画服务器和硬盘之间的连线
      const link = this.drawLink({
        startY: r.children[0].position.startY,
        endY: r.position.linkEndY,
        hide: true
      });
      const osdWrapper = this.drawRectangle({
        x: r.position.wrapper.x,
        y: r.position.wrapper.y,
        width: r.position.wrapper.width,
        height: r.position.wrapper.height,
        hide: true
      });
      // draw group
      const group = this.drawGroup({
        x: r.position.x,
        y: r.position.y,
        height: r.position.openHeight,
        name: r.name
      }, rack);
      groupList.push(group);
      linkList.push(link);
      osdWrapperList.push(osdWrapper);
    });
    this.stage.addChild(groupList);
    groupList.forEach((group, i) => {
      const children = [];
      const r = rack[i];
      // draw inner wrapper
      const wrapper = this.drawRectangle({
        x: config.groupPadding.left,
        y: config.groupPadding.top,
        width: config.wrapper.width,
        height: r.position.openHeight - config.groupPadding.top - config.innerPadding * 2
      });
      children.push(wrapper);
      // draw server
      r.children.forEach(host => {
        const server = this.drawServer({
          x: host.position.x,
          y: host.position.y,
          openWidth: r.position.openWidth,
          openHeight: r.position.openHeight,
          text: host.name
        }, host, groupList, linkList[i], osdWrapperList[i]);
        children.push(server);
      });
      group.add(children.concat([linkList[i], osdWrapperList[i]]));
    });
  }

}

export default Topology;
