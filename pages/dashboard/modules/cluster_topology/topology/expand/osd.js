import utils from '../utils';

const osd = function(settings, _this) {

  function text_ellipsis(ctx, str, maxWidth) {
    let width = ctx.measureText(str).width,
      ellipsis = '...',
      ellipsisWidth = ctx.measureText(ellipsis).width;

    if (width <= maxWidth || width <= ellipsisWidth) {
      return str;
    } else {
      let len = str.length;
      while (width >= maxWidth - ellipsisWidth && len-- > 0) {
        str = str.substring(0, len);
        width = ctx.measureText(str).width;
      }
      return str + ellipsis;
    }
  }

  let draw = function() {
    const canvas = _this.canvas;
    const scale = _this.scale;
    const fontFamily = settings.fontFamily || 'arial,sans-serif';
    const fontSize = settings.fontSize || 14;
    const fontWeight = settings.fontWeight || 400;
    const size = fontSize * scale;
    const font = `normal ${fontWeight} ${size}px ${fontFamily}`;

    if(!this.fixed) {
      _this.ext.DefineScale.call(this, scale, 'x', 'y', 'width', 'height', 'moveX', 'moveY', 'paddingTop', 'paddingLeft');
    }

    let ellipsisText;

    canvas.save();
    canvas.translate(this.scaled_moveX, this.scaled_moveY);
    if(this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }

    if(!this.hide) {
      // 画背景图
      if(this.background && this.background.img) {
        canvas.drawImage(
          _this.loader.getImg(this.background.img),
          this.scaled_x,
          this.scaled_y,
          this.scaled_width,
          this.scaled_height
        );
      }
      // 画硬盘使用量
      canvas.fillStyle = utils.getColorFromPercent(this.percent).color;
      canvas.fillRect(this.scaled_x, this.scaled_y + 77 * scale, this.scaled_width * this.percent, 4 * scale);

      // 画文字前的点
      canvas.beginPath();
      canvas.fillStyle = utils.getColorFromType(settings.topology_status);
      canvas.arc(this.scaled_x + 6 * scale, this.scaled_y + 93 * scale, 3 * scale, 0, 2 * Math.PI);
      canvas.fill();
      canvas.closePath();

      // 画文字
      canvas.font = font;
      canvas.textBaseline = 'top';

      ellipsisText = text_ellipsis(canvas, this.text, this.scaled_width - 16 * scale);

      canvas.fillStyle = this.color;
      canvas.fillText(ellipsisText, this.scaled_x + 14 * scale, this.scaled_y + 86 * scale);
    }
    canvas.restore();
  };

  return Object.assign({}, _this.ext.display(settings, _this), {
    type: 'rectangle',
    draw: draw,
    color: settings.color,
    background: settings.background,
    text: settings.text || 'no text',
    percent: settings.percent || 0
  });
};

export default osd;
