```javascript
import {Button} from 'uskin';
import {ButtonGroup} from 'uskin';

ReactDOM.render(
  <div>
    <ButtonGroup>
      <Button tag="div" value="Prev" />
      <Button tag="div" value="Mid 1" type="delete" />
      <Button tag="div" value="Mid 2" disabled={true} />
      <Button tag="div" value="Next" type="create" />
    </ButtonGroup>
  </div>,
  mountNode);
```