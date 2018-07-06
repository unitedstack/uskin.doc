```javascript
import { Switch } from 'uskin';

ReactDOM.render(<div>
  <Switch
    onChange={listener}
    width={50} />
  <Switch
    onChange={listener}
    width={70} />
</div>, mountNode);
```