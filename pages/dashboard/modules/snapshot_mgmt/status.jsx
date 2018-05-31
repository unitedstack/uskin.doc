import React from 'react';

function Status(props) {
  const { status, text } = props;
  const divStyle = {
    display: 'inline-block',
    height: 20.5,
    padding: '2px 12px 0',
    fontSize: 12,
    borderRadius: 100,
    textAlign: 'center'
  };

  let bgColor, color;

  if(status === 'protected') {
    bgColor = 'rgba(1,175,201,0.20)';
    color = '#01afc9';
  } else {
    bgColor = 'rgba(163,167,173,0.20)';
    color = '#a3a7ad';
  }

  divStyle.backgroundColor = bgColor;
  divStyle.color = color;
  return (
    <div style={divStyle}>
      {text}
    </div>
  );
}

export default Status;