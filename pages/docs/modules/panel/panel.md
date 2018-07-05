```javascript
import {Panel} from 'uskin';

var text = [{
  'title': <div>比利时两球落后、三球逆袭，绝杀日本</div>,
  'content': <div><p>北京时间7月3日凌晨2点，2018俄罗斯世界杯一场1/8决赛在顿河畔罗斯托夫竞技场进行，由比利时队对阵日本队。上半场比利时压着日本队打，但没有进球。下半场风云突变，日本队在4分钟内由原口元气和乾贵士打进两球，落后的比利时队大举反扑，维尔通亨和费莱尼两记头球扳平比分。</p></div>
}];

ReactDOM.render(<div>
  <Panel title={text[0].title} content={text[0].content} width="480"/>
</div>, mountNode);
```
