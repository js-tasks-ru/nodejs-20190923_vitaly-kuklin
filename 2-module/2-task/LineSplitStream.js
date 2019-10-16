const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.textData = '';
  }

  _transform(chunk, encoding, callback) {
    const incomingData = chunk.toString();
    const currentData = this.textData + incomingData;
    const filteredData = currentData.split(EOL);
    const lastChild = filteredData.pop();
    filteredData.map((filteredChunk) => {
      this.push(filteredChunk);
    });
    this.textData = lastChild;
    callback();
  }

  _flush(callback) {
    callback(null, this.textData);
  }
}

module.exports = LineSplitStream;
