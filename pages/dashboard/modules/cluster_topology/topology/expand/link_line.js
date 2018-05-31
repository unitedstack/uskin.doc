const linkLine = function(settings, _this) {
  const colorList = {
    rect: '#6684B0',
    rectBig: '#4D678C',
    line: '#FE9D44'
  };
  const draw = function() {
    const canvas = _this.canvas;
    const scale = _this.scale;
    const rect = {
      sw: 3 * scale,
      sh: 5 * scale,
      w: 4 * scale,
      h: 10 * scale
    };
    const rectBig = {
      sw: 5 * scale,
      sh: 10 * scale,
      w: 7 * scale,
      h: 14 * scale
    };

    _this.ext.DefineScale.call(this, scale, 'moveX', 'moveY', 'matrix', 'lineWidth');

    const matrix = this.scaled_matrix;

    canvas.save();
    canvas.translate(this.scaled_moveX, this.scaled_moveY);
    if(this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }

    if(!this.hide) {
      /* begin shape start */
      canvas.save();
      canvas.fillStyle = colorList.rect;
      canvas.fillRect(matrix[0][0] - rect.sw, matrix[0][1] - 0.5 * rect.sh, rect.sw, rect.sh);
      canvas.fillStyle = colorList.rectBig;
      canvas.fillRect(matrix[0][0] - rect.sw - rect.w, matrix[0][1] - 0.5 * rect.h, rect.w, rect.h);
      canvas.restore();
      /* begin shape end */

      /* end shape start */
      canvas.save();
      canvas.fillStyle = colorList.rect;
      canvas.fillRect(matrix[3][0], matrix[3][1] - 0.5 * rectBig.sh, rectBig.sw, rectBig.sh);
      canvas.fillStyle = colorList.rectBig;
      canvas.fillRect(matrix[3][0] + rectBig.sw, matrix[3][1] - 0.5 * rectBig.h, rectBig.w, rectBig.h);
      canvas.restore();
      /* end shape end */

      // 有border的画法
      // canvas.moveTo(matrix[0][0], matrix[0][1]);
      // canvas.lineTo(matrix[1][0] - 4 * scale, matrix[0][1]);
      // canvas.quadraticCurveTo(matrix[1][0], matrix[0][1], matrix[1][0], matrix[0][1] + 4 * scale);
      // canvas.lineTo(matrix[1][0], matrix[2][1] - 4 * scale);
      // canvas.quadraticCurveTo(matrix[2][0], matrix[2][1], matrix[2][0] + 4 * scale, matrix[2][1]);
      // canvas.lineTo(matrix[3][0], matrix[3][1]);

      canvas.beginPath();
      matrix.forEach(function(point, i) {
        i === 0 ? canvas.moveTo(point[0], point[1]) : canvas.lineTo(point[0], point[1]);
      });

      canvas.strokeStyle = this.color;
      canvas.lineWidth = this.scaled_lineWidth;
      canvas.stroke();
      canvas.closePath();
    }
    canvas.restore();
  };

  return Object.assign({}, _this.ext.display(settings, _this), {
    type: 'line',
    draw: draw,
    lineWidth: settings.lineWidth || 1,
    matrix: settings.matrix,
    color: colorList.line
  });
};

export default linkLine;
