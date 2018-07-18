```javascript
import { Slider } from 'uskin';

ReactDOM.render(
  <div>
    <Slider 
      min={10}
      max={100}
      value={30}
      step={1}
      width={300}
      onChange={this.onChange}
    />
  </div>,
  mountNode);
```
