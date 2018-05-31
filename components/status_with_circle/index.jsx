import React from 'react';

/**
 * status 及其颜色的配置
*/
const statusColor = {
  'login': '#29cd7b',
  'logout': '#939ba3',
  'health': '#29cd7b'
};


/**
 * status 可以在上面的配置中添加，主要用来设置颜色
 * size 是小圆圈的尺寸
 * text 文本
 * customCfg 如果不想用上面的配置，可以直接传入一个对象来设置样式
 * customCfg.color 是字体的颜色
 * customCfg.circle 是圆圈的颜色
 * customCfg.fontSize 是字体大小
 * customCfg.lineHeight 是行高，记得加 px
 */
function StatusWithCircle (props) {
  const { status, size, text = 'nothing', customCfg } = props;

  const circleStyle = {
    display: 'inline-block',
    verticalAlign: '1px'
  };

  const fontStyle = {
    fontSize: '12px',
    lineHeight: '14px',
    marginLeft: '4px'
  };

  // 颜色

  if(status in statusColor) {
    fontStyle.color = statusColor[status];
    circleStyle.backgroundColor = statusColor[status];
  } else if(customCfg instanceof Object) {
    fontStyle.color = customCfg.color || '#939ba3';
    fontStyle.fontSize = customCfg.fontSize || '12px';
    fontStyle.lineHeight = customCfg.lineHeight || '14px';
    fontStyle.marginLeft = customCfg.marginLeft || '4px';
    circleStyle.backgroundColor = customCfg.circle || '#939ba3';
  } else {
    fontStyle.color = '#939ba3';
    fontStyle.fontSize = '12px';
    fontStyle.lineHeight = '14px';
    circleStyle.backgroundColor = '#939ba3';
  }

  // 尺寸
  switch(size) {
    case 'small':
      circleStyle.width = '4px';
      circleStyle.height = '4px';
      circleStyle.borderRadius = '2px';
      break;
    case 'normal':
      circleStyle.width = '6px';
      circleStyle.height = '6px';
      circleStyle.borderRadius = '3px';
      break;
    case 'large':
      circleStyle.width = '8px';
      circleStyle.height = '8px';
      circleStyle.borderRadius = '4px';
      break;
    default:
      circleStyle.width = '6px';
      circleStyle.height = '6px';
      circleStyle.borderRadius = '3px';
      break;
  }

  return (
    <div>
      <span style={circleStyle}></span>
      <span style={fontStyle}>{text}</span>
    </div>
  );
}

export default StatusWithCircle;
