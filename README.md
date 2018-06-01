# uskin.doc

USkin 组件库文档。

## Usage

__Clone this repo and submodule. (Maybe you need fork it first)__

```bash
git clone git@github.com:unitedstack/uskin.doc.git --recursive
```

__Install packages__

```bash
npm instsall
```

__Dev Mode__

```bash
# webpack-dev-server will host localhost:8888
npm run dev
```

__Production Mode__

```bash
# this script will generate static files in fold static, push it to github pages, just it.
npm run build
```

## Uskin

We import uskin as submodule, import uskin like this:

```javascript
// In fact, uskin do not support tree shaking...
// whatever...
import {Table} from 'uskin';
```
