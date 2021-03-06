/* eslint-disable no-underscore-dangle, class-methods-use-this */
const { string: { toSymbolKey }, uuid } = require('@asefux/common');

class SourceBase {
  constructor({
    symbol,
    quote,
    timeShift = 0,
    maxCacheTime = 4 * 3600 * 1000,
    decimals = 8,
  }) {
    this._symbol = toSymbolKey(symbol || `source-${uuid.v4().split('-')[0]}`);
    this._timeShift = timeShift - 24 * 3600 * 1000;
    this._quote = toSymbolKey(quote);
    this._matrix = {};
    this.lastFetched = null;
    this.maxCacheTime = maxCacheTime;
    this._decimals = decimals;
  }

  get decimals() {
    return this._decimals;
  }

  get symbol() {
    return this._symbol;
  }

  get timeShift() {
    return this._timeShift;
  }

  get now() {
    const today = new Date();
    if (today.getDay() > 5) {
      const shifting = today.getDay() - 5;
      console.log(`shifting ${shifting} days`);
      return new Date(today.getTime() - shifting * 24 * 3600 * 1000);
    }
    if (today.getDay() === 1) {
      const shifting = 3;
      console.log(`shifting ${shifting} days`);
      return new Date(today.getTime() - shifting * 24 * 3600 * 1000);
    }
    if (today.getDay() === 0) {
      const shifting = 2;
      console.log(`shifting ${shifting} days`);
      return new Date(today.getTime() - shifting * 24 * 3600 * 1000);
    }
    console.log(`regular week day ${today.getDay()}`);
    return new Date(Date.now() + this.timeShift);
  }

  get nowDate() {
    const [date] = this.now.toISOString().split('T');

    return date;
  }

  get nowComponents() {
    const [fullYear, month, day] = this.nowDate.split('-');
    return { fullYear, month, day };
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
