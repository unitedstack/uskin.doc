import '../../style/index.less';
import utilConverter from '../../../../utils/unit_converter';
import React from 'react';

function CapacityUse(props) {
  // kb 为单位
  const { used, total } = props;
  let percent = Math.ceil(used / total * 100);
  percent = isNaN(percent) ? 0 : percent;
  const width = percent;

  return (
    <div className="osd-mgmt-capacity-use-wrapper">
      <span className="osd-mgmt-used">
        { utilConverter(used, 'KB').num + utilConverter(used, 'KB').unit }
      </span>
      <span className="osd-mgmt-total">
        { utilConverter(total, 'KB').num + utilConverter(total, 'KB').unit }
      </span>
      <div className="osd-mgmt-capacity-use-bar">
        <div className="osd-mgmt-used-bar"
          style = {{width: width}}
        ></div>
      </div>
    </div>
  );
}

export default CapacityUse;
