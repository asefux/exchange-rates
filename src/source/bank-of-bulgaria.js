const got = require('got');
const { string: { toSymbolKey, compile }, bn } = require('@asefux/common');

const Base = require('./base');

class Source extends Base {
  constructor() {
    super({
      symbol: 'bank-of-bulgaria',
      quote: 'BGN',
      timeShift: 0,
    });
    this.url = 'http://www.bnb.bg/Statistics/StExternalSector/StExchangeRates/StERForeignCurrencies/index.htm?download=csv&search=&lang=EN';
  }

  async _fetch() {
    const info = this.nowComponents;
    const url = compile({ template: this.url, info });
    const { body } = await got(url);

    const linesRaw = body.split('\n');
    linesRaw.shift();
    linesRaw.shift();
    const lines = linesRaw.map((line) => line.split(',').map((column) => column.trim())).filter((line) => line.length === 6);

    const normalizedLines = lines.map(([date, desc, rawcurrency, amount, rate]) => {
      const currency = toSymbolKey(rawcurrency);
      const unitRate = bn(rate).dividedBy(amount).toFixed(this.decimals);
      return { currency: toSymbolKey(currency), rate: unitRate };
    });

    return normalizedLines.reduce((r, { currency, rate }) => ({
      ...r,
      [this.quote]: {
        ...(r[this.quote] || {}),
        [currency]: bn(1).dividedBy(rate).toFixed(this.decimals),
      },
      [currency]: {
        ...(r[currency] || {}),
        [this.quote]: rate,
      },
    }), {});
  }

  static create() {
    return new Source();
  }
}

module.exports = Source;
