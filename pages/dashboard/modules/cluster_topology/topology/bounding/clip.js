// 仅用于link line, 因为线两端多出了两部分
function clip(_this, canvas, scale) {
  if(_this.cliping) {
    const bounding = _this.getBounding();
    if(_this.cliping.column) {
      canvas.rect(bounding.lt[0], bounding.lt[1], bounding.rt[0] - bounding.lt[0], _this.boundingHeight * scale);
    } else {
      canvas.rect(bounding.lt[0], bounding.lt[1] - 10, (_this.boundingWidth + 12) * scale, bounding.rb[1] - bounding.rt[1] + 10);
    }
    canvas.clip();
  }
}

export default clip;
