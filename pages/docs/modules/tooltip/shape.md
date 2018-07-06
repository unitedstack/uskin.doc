```javascript
import {Tooltip} from 'uskin';

const a = {
  b: 1
};

ReactDOM.render(
  <div>
    <Tooltip shape="top-left" content="top left tooltip" />
    <Tooltip shape="top" content="top tooltip" />
    <Tooltip shape="top-right" content="top right tooltip" />
    <Tooltip shape="right-top" content="right top tooltip" />
    <Tooltip shape="right" content="right tooltip" />
    <Tooltip shape="right-bottom" content="right bottom tooltip" />
    <Tooltip shape="bottom-right" content="bottom right tooltip" />
    <Tooltip shape="bottom" content="bottom tooltip" />
    <Tooltip shape="bottom-left" content="bottom left tooltip" />
    <Tooltip shape="left-bottom" content="left bottom tooltip" />
    <Tooltip shape="left" content="left tooltip" />
    <Tooltip shape="left-top" content="left top tooltip" />
  </div>,
  mountNode);
```
