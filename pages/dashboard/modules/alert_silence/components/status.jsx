import React from 'react';

function Status({ status, __ }) {
  const style = {
    display: 'inline-block',
    height: 20.5,
    padding: '1px 12px 0',
    lineHeight: '20px',
    borderRadius: 100,
    textAlign: 'center'
  };

  let bgColor, color, text;

  switch (status) {
    case 'pending':
      text = __.not_yet_started;
      color = '#01AFC9';
      bgColor = 'rgba(1,175,201,.2)';
      break;
    case 'active':
      text = __.processing;
      color = '#fff';
      bgColor = '#01AFC9';
      break;
    case 'expired':
      text = __.expired;
      color = '#A3A7AD';
      bgColor = 'rgba(163,167,173,0.20)';
      break;
    default:
      break;
  }

  style.color = color;
  style.backgroundColor = bgColor;

  return (
    <div style={style}>
      {text}
    </div>
  );
}

export default Status;
