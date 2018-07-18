const configs = require('../menu.json');

const modules = {};

configs.items.forEach((m) => {
  m.subs.sort((a, b) => a.subtitle.toLowerCase().localeCompare(b.subtitle.toLowerCase()));
  m.subs.forEach((n) => {
    modules[n.key] = require(`../modules/${n.key}/index`);
  });
});

module.exports = {
  configs,
  modules,
};
