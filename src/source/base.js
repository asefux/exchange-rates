const { string: { toSymbolKey } } = require('@asefux/common');

class SourceBase {
  constructor({
    symbol,
    quote,
    timeShift = 0,
    maxCacheTime = 4 * 3600 * 1000,
  }) {
    this._symbol = toSymbolKey(symbol || `source-${uuid.v4().split('-')[0]}`);
    this._timeShift = timeShift;
    this._quote = toSymbolKey(quote);
    this._matrix = {};
    this.lastFetched = null;
    this.maxCacheTime = maxCacheTime;
  }

  get symbol() {
    return this._symbol;
  }

  get timeShift() {
    return this._timeShift;
  }

  get now() {
    return new Date(Date.now() + this.timeShift);
  }

  get nowDate() {
    const [date] = this.now.toISOString().split('T');
    return date;
  }

  get quote() {
    return this._quote;
  }

  _fetch() {
    throw new Error('must override');
  }

  get matrix() {
    return this._matrix;
  }

  async getMatrix() {
    if (!this.lastFetched || this.now.getTime() - this.lastFetched.getTime() > this.maxCacheTime) {
      await this.fetch();
    }
    return this._matrix;
  }

  async fetch() {
    this._matrix = await this._fetch() || {};
    this.lastFetched = this.now;
    return this._matrix;
  }
}

module.exports = SourceBase;
