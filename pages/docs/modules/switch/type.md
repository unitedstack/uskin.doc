```javascript
import { Switch } from 'uskin';

ReactDOM.render(<div>
  <Switch
    onChange={listener}
    labelOn="ON"
    labelOff="OFF"
    checked={true} />
  <Switch
    onChange={listener}
    labelOn="ON"
    labelOff="OFF"
    checked={false} />
</div>, mountNode);
```
