const configs = require('../menu.json');

let modules = {};

configs.modules.forEach((m) => {
  m.items.forEach((n) => {
    modules[n] = require('../modules/' + n + '/index');
  });
});

console.log(configs);

module.exports = {
  configs: configs,
  modules: modules
};
