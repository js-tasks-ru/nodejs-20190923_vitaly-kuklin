const stream = require('stream');
const {EOL} = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.encoding = options.encoding;
    this.textData = '';
  }

  _transform(chunk, encoding, callback) {
    const incomingData = this.setEncoding(chunk);
    const currentData = this.textData + incomingData;
    if (currentData.includes(EOL)) {
      this.splitLogic(currentData);
    } else {
      this.textData += incomingData;
    }
    callback();
  }

  _flush(callback) {
    callback(null, this.textData);
  }

  setEncoding(chunk) {
    return this.encoding ? chunk.toString(this.encoding) : chunk.toString();
  }

  splitLogic(currentData, newLineSymbol) {
    const filteredData = currentData.split(EOL);
    const lastChild = filteredData.pop();
    filteredData.map((filteredChunk) => {
      this.push(filteredChunk);
    });
    this.textData = lastChild;
  }
}

module.exports = LineSplitStream;
