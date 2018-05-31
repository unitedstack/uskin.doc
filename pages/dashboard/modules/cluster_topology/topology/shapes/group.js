import config from '../config';

function drawGroup(stage, settings, eventSettings) {
  const c = Object.assign({}, {
    x: 0,
    y: 0,
    width: config.group.width,
    height: config.group.height,
    radius: {
      tl: 4,
      tr: 4,
      bl: 4,
      br: 4
    },
    background: {
      color: config.group.backgroundColor
    }
  }, settings);

  const group = stage.group(c).config({
    zindex: 10
  });

  return group;
}

export default drawGroup;
