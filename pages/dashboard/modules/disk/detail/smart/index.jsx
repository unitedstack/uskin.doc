import './style/index.less';

import React from 'react';


const SmartState = ({ state, color }) =>
  <div className="smart-state">
    <i className={ color }></i>
    { state }
  </div>;

const SmartStateIntro = ({ state, intro, color }) =>
  <li className="smart-card">
    <SmartState state={ state } color={ color } />
    <p>{ intro }</p>
  </li>;

const SmartStateBoard = ({ __ }) =>
  <div className="smart-container">
    <div className="smart-title">{ __.smart_title }</div>
    <ul className="smart-inner-container">
      <SmartStateIntro state={ __.smart_health } intro={ __.smart_health_intro } color={ __.smart_health_color } />
      <SmartStateIntro state={ __.smart_alert } intro={ __.smart_alert_intro } color={ __.smart_alert_color } />
      <SmartStateIntro state={ __.smart_error } intro={ __.smart_error_intro } color={ __.smart_error_color } />
    </ul>
  </div>;

export{
  SmartStateBoard,
  SmartState
};