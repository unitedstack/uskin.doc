export default {
  // 将一个数组拆分为多个指定长度的数组
  splitArray: (array, num) => {
    let ret = [];
    const len = array.length;
    for(let i = 0; i < len; i += num) {
      ret.push(array.slice(i, i + num));
    }
    return ret;
  },

  /**
   * @param {Array} arr
   */
  getMax(arr) {
    return Math.max.apply(null, arr);
  },
  /**
   * @param {Array} arr
   */
  getMin(arr) {
    return Math.min.apply(null, arr);
  },

  changeLinkStartY: (matrix, y) => {
    matrix[0] = [matrix[0][0], y];
    matrix[1] = [matrix[1][0], y];
    return matrix;
  },

  // reverse an array
  // do not change the origin array
  reverse(array) {
    const [ length, ret ] = [ array.length, [] ];
    for(let i = 0; i < length; i++) {
      ret[i] = array[length - i -1];
    }
    return ret;
  },

  getColorFromPercent(percent) {
    if(percent < 0.85) {
      return {
        type: 'success',
        color: '#29CD7B'
      };
    } else if(percent < 0.95) {
      return {
        type: 'exception',
        color: '#FDA82A'
      };
    }
    return {
      type: 'active',
      color: '#EF6D64'
    };
  },

  getColorFromType(type) {
    if(type === 'health') {
      return '#29CD7B';
    } else if(type === 'warning') {
      return '#EF6D64';
    }
    return '#FDA82A';
  }
};
