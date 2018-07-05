```javascript
import { Switch } from 'uskin';

ReactDOM.render(<div>
  <Switch
    onChange={listener}
    labelOn="ON"
    labelOff="OFF"
    checked={true}
    disabled={false} />
  <Switch
    onChange={listener}
    labelOn="ON"
    labelOff="OFF"
    checked={false}
    disabled={true} />
</div>, mountNode);
```

