import config from '../config';

function drawDisk(stage, settings, eventSettings) {
  const c = Object.assign({}, {
    x: 0,
    y: 0,
    width: config.disk.width,
    height: config.disk.height,
    hide: false,
    background: {
      img: '/public/assets/dashboard/hdd.png'
    },
    fontSize: 11,
    text: 'HDD硬盘',
    color: '#fff'
  }, settings);

  const disk = stage.graphs.osd(c)
    .on('mouseenter', function(cur) {
      cur.background.img = eventSettings.enter.img;
      cur.color = eventSettings.enter.color;
      stage.element.className = 'pointer';
      stage.redraw();
    })
    .on('mouseleave', function(cur) {
      cur.background.img = eventSettings.leave.img;
      cur.color = eventSettings.leave.color;
      stage.element.className = 'grab';
      stage.redraw();
    });
  if(eventSettings.mousedown && typeof eventSettings.mousedown === 'function') {
    disk.on('mousedown', (cur) => {
      eventSettings.mousedown(cur);
    });
  }

  return disk;
}

export default drawDisk;
