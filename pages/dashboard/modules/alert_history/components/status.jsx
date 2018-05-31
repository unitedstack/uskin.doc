import React from 'react';

function Status(props) {
  const { status, __, onMarkAsRead } = props;
  let recoverText;
  let markContent;
  const recoverStyle = {
    display: 'inline-block',
    height: 20.5,
    padding: '0.5px 12px 0',
    marginRight: 27,
    marginBottom: 8,
    borderRadius: 100,
    textAlign: 'center'
  };

  const readStyle = {
    display: 'inline-block',
    height: 20.5,
    padding: '0.5px 12px 0',
    color: '#fff',
    textAlign: 'center',
    lineHeight: '20px',
    background: '#01AFC9',
    borderRadius: 100
  };

  const unreadStyle = {
    height: 20,
    cursor: 'pointer',
    display: 'inline-block',
    color: '#01AFC9'
  };


  switch (status) {
    case 'open':
      recoverText = __.not_recovered;
      recoverStyle.color = '#A3A7AD';
      recoverStyle.background = 'rgba(163,167,173,.2)';
      markContent = <div style={unreadStyle} onClick={onMarkAsRead}>{__.mark_as_read}</div>;
      break;
    case 'ack':
      recoverText = __.not_recovered;
      recoverStyle.color = '#A3A7AD';
      recoverStyle.background = 'rgba(163,167,173,.2)';
      markContent = <div style={readStyle}>{__.have_read}</div>;
      break;
    case 'closed':
      recoverText = __.recovered;
      recoverStyle.color = '#01AFC9 ';
      recoverStyle.background = 'rgba(1,175,201,.2)';
      markContent = null;
      break;
    default:
      break;
  }

  return (
    <div style={{fontSize:12, lineHeight: '20px'}}>
      <div style={recoverStyle}>
        {recoverText}
      </div>
      {
        markContent
      }
    </div>
  );
}

export default Status;
