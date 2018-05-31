import config from '../config';

function drawServer(stage, settings, eventSettings) {
  const c = Object.assign({}, {
    x: 0,
    y: 0,
    width: config.server.width,
    height: config.server.height,
    paddingTop: 8,
    paddingLeft: 6,
    center: false,
    background: {
      img: '/public/assets/dashboard/server_health.png'
    },
    fontSize: 9,
    text: 'Hello World',
    color: '#fff'
  }, settings);

  const server = stage.graphs.text(c)
    .on('mouseenter', (cur) => {
      cur.background.img = eventSettings.enter.img;
      stage.element.className = 'pointer';
      stage.redraw();
    }).on('mouseleave', (cur) => {
      cur.background.img = eventSettings.leave.img;
      stage.element.className = 'grab';
      stage.redraw();
    });
  if(eventSettings.mousedown && typeof eventSettings.mousedown === 'function') {
    server.on('mousedown', (cur) => {
      eventSettings.mousedown(cur);
    });
  }

  return server;
}

export default drawServer;
