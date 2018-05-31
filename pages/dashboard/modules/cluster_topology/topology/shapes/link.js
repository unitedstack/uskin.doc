function drawLink(stage, settings, eventSettings) {
  const startY = settings.startY;
  const endY = settings.endY;
  const config = Object.assign({}, {
    matrix: [
      [162, startY],
      [168, startY],
      [168, endY],
      [182, endY]
    ],
    lineWidth: 2,
    hide: settings.hide,
    color: '#ef8376'
  }, settings);

  const link = stage.graphs.linkLine(config)
    .on('mouseenter', function(cur) {
      cur.color = eventSettings.enter.color;
      cur.lineWidth = 4;
      stage.redraw();
    }).on('mouseleave', function(cur) {
      cur.color = eventSettings.leave.color;
      cur.lineWidth = 2;
      stage.redraw();
    });
  return link;
}

export default drawLink;
