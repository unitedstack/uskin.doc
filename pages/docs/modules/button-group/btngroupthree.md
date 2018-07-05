```javascript
import {Button} from 'uskin';
import {ButtonGroup} from 'uskin';

ReactDOM.render(
  <div>
    <ButtonGroup type="vertical">
      <Button tag="div" value="Prev" type="status"  selected={true}/>
      <Button tag="div" value="Mid 1" type="status" />
      <Button tag="div" value="Mid 2" disabled={true} />
      <Button tag="div" value="Next" type="create" />
    </ButtonGroup>
  </div>,
  mountNode);
```
