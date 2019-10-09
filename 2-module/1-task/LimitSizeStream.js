const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._sreamLimit = options.limit;
    this.actualDataSize = 0;
  }

  _transform(chunk, encoding, callback) {
    const bufferDataLength = Buffer.byteLength(chunk);
    if (bufferDataLength > (this._sreamLimit - this.actualDataSize)) {
      return callback(new LimitExceededError());
    }
    this.actualDataSize += bufferDataLength;
    this.push(chunk);
    callback();
  }
}

module.exports = LimitSizeStream;
