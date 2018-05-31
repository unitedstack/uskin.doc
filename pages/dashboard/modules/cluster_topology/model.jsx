import './style/index.less';

import React from 'react';
import {Link} from 'react-router-dom';
import {Button, Icon, Progress} from 'antd';
import Topology from './topology/index';
import request from './request';
import utils from './topology/utils';
import unit from '../../utils/unit';
import ButtonPeng from './components/button/index';
import Circle from 'client/components/status_with_circle/index';
import status from './status';

class Model extends React.Component {

  constructor(props) {
    super(props);

    ['onAction', 'onClickOsd', 'refresh'].forEach(func => {
      this[func] = this[func].bind(this);
    });
  }

  state = {
    loading: true,
    info: {
      type: null
    }
  };

  instance = null;

  stage = null;

  componentDidMount() {
    this.initTopplogy();
  }

  initTopplogy() {
    request.getTrees().then(res => {
      this.instance = new Topology(res, {
        onAction: this.onAction
      });
      this.instance.init();
      this.stage = this.instance.getStage();
    });
  }

  refreshTopology() {
    request.getTrees().then(res => {
      this.setState({
        loading: false
      }, () => {
        /**
         * 刷新比较繁琐，因为所画的对象没有被销毁，第二次draw的时候只是更新对象内的数据，所以需要做很多重置。
         * 1. 移除图形列表中的所有图形
         * 2. 更新data数据
         * 3. render
         * 4. 重置整个页面的缩放尺寸，全局位移尺寸
         * 5. 更新每个页面中除了有parent的图形的moveX，重置到0。因为parent的子图形的moveX和moveY需要和parent联动
         * 6. 更新所有group的子图形的位置
         * 7. 重绘
         */
        this.stage.removeAllChilds();
        this.instance.refreshData(res);
        this.instance.render();
        this.stage.scale = 1;
        this.stage.transX = 0;
        this.stage.transY = 0;
        this.stage.objects.filter(o => !o.parent).forEach(o => {
          o.moveX = 0;
          o.moveY = 0;
        });
        this.stage.objects.filter(o => o.type === 'group').forEach(o => {
          o.updateAllChildsPosition();
        });
        this.stage._objects = utils.reverse(this.stage.objects);
        this.stage.redraw();
      });
    });
  }

  onAction = (type, data) => {
    switch(type) {
      case 'hideLoading':
        this.setState({
          loading: false
        });
        break;
      case 'osd':
        this.onClickOsd(type, data);
        break;
      case 'server':
        this.onClickServer(type, data);
        break;
      case 'reset':
        this.setState({
          info: {
            type: null,
            data: null
          }
        });
        break;
      default:
        break;
    }
  }

  onClickOsd = (type, data) => {
    this.setState({
      info: {
        type: 'osd',
        data
      }
    });
  }

  onClickServer = (type, data) => {
    this.setState({
      info: {
        type,
        data
      }
    });
  }

  refresh() {
    this.setState({
      loading: true,
      info: {
        type: null
      }
    }, () => {
      this.refreshTopology();
    });
  }

  osdProps = [{
    lang: 'name',
    value: 'name',
    format: (value, id) => <Link to={`/osd_mgmt/${id}`}>{value}</Link>
  }, {
    lang: 'belong_pool',
    value: 'pool_name',
    format: (value, id) => value ? <Link to={`/pool/${value}`}>{value}</Link> : '-'
  }, {
    lang: 'type',
    value: 'rotational',
    format: value => value.toString() === '1' ? this.props.__.hdd : this.props.__.ssd
  }, {
    lang: 'osd_status',
    value: 'topology_status',
    format: value => <Circle customCfg={{circle: status[value].color, color: 'black', fontSize: '14px'}} text={this.props.__[value]} />
  }, {
    lang: 'process_status',
    value: 'status',
    format: value => value === 'up' ? this.props.__.available : this.props.__.unavailable
  }, {
    lang:  'status_of_use',
    value: 'reweight',
    format: value => value === 0 ? 'OUT' : 'IN'
  }, {
    custom: true,
    format: (osd, i) => this.renderKbDetail(osd, i)
  }];

  renderKbDetail(osd, i) {
    const __ = this.props.__;
    const info = utils.getColorFromPercent(osd.utilization / 100);

    return <div key={i} className="kb_used">
      <div className="top">
        <div className="item">
          <div>{this.props.__.osd_size}</div>
          <div>{unit.kbToGB(osd.kb).toFixed(2) + ' GB'}</div>
        </div>
        <div className="item">
          <div>{this.props.__.osd_used}</div>
          <div>{unit.kbToGB(osd.kb_used).toFixed(2) + ' GB'}</div>
        </div>
      </div>
      <div className="bottom">
        <div className="slide">
          <div className="tooltip-wrapper" style={{left: `${osd.utilization}%`}}>
            <div className="tooltip-arrow" style={{borderTopColor: info.color}}></div>
            <div className="tooltip" style={{backgroundColor: info.color}}>{`${osd.utilization.toFixed(2)}%`}</div>
          </div>
          <Progress percent={osd.utilization} size="small" style={{width: '100%'}} showInfo={false} status={info.type}/>
          <div className="num">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
        <div className="aha">
          <div className="wrapper">
            <div className="color health"></div>
            <div className="rate">0% ~ 85%</div>
            <div className="type">{__.health}</div>
          </div>
          <div className="wrapper">
            <div className="color warning"></div>
            <div className="rate">85% ~ 95%</div>
            <div className="type">{__.warning}</div>
          </div>
          <div className="wrapper">
            <div className="color error"></div>
            <div className="rate">95% ~ 100%</div>
            <div className="type">{__.error}</div>
          </div>
        </div>
      </div>
    </div>;
  }

  render() {
    const state = this.state;
    const props = this.props;
    const __ = props.__;

    return (
      <div className="garen-module-cluster-topology">
        <div className="garen-com-main">
          <div className="margin-wrapper">
            <div className="info-wrapper">
              <div className="title">{__.cluster_topology}</div>
              <div className="status-btn-wrapper">
                <ButtonPeng type="health" text={props.__.health} />
                <ButtonPeng type="warning" text={props.__.warning} />
                <ButtonPeng type="error" text={props.__.error} />
              </div>
            </div>
            <div className="topology-content">
              <div className="left">
                <div className="title-wrapper">
                  <Button type="primary" onClick={this.refresh}><Icon type="refresh" />{__.refresh}</Button>
                  <div className="title"></div>
                </div>
                <div id="canvas-wrapper" className="topology-wrapper">
                  <div className={'loading-wrapper' + (state.loading ? '' : ' hide')}><Icon type="loading" /></div>
                  <canvas id="canvas"></canvas>
                </div>
              </div>
              <div className="right">
                <div className="head">{__.properties}</div>
                {
                  state.info.type === 'osd' && this.osdProps.map((osd, i) => (
                    osd.custom ? osd.format(state.info.data, i) : <div key={i}>
                      <div className="title">{__[osd.lang]}</div>
                      <div className="content">{osd.format && osd.format(state.info.data[osd.value], state.info.data.id) || state.info.data[osd.value] || '-'}</div>
                    </div>
                  ))
                }
                {
                  state.info.type === 'server' && [
                    <div key="1">
                      <div className="title">{__.name}</div>
                      <div className="content" style={{fontSize: 12}}>{state.info.data.name}</div>
                    </div>,
                    <div key="2">
                      <div className="title">{__.disk_num}</div>
                      <div className="content">{state.info.data.children.reduce((pre, cur) => pre + cur.length, 0)}</div>
                    </div>
                  ]
                }
                {
                  !state.info.type && <div className="head">{__.no_select}</div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default Model;

