const { string: { compile, toSymbolKey }, bn } = require('@asefux/common');
const got = require('got');

const Base = require('./base');

class Source extends Base {
  constructor() {
    super({ symbol: 'bank-of-canada', quote: 'CAD' });
    this.url = 'https://www.bankofcanada.ca/valet/observations/group/FX_RATES_DAILY/json?start_date=${todayDate}';
  }

  async _fetch() {
    const url = compile({
      template: this.url,
      info: { todayDate: this.nowDate },
    });
    const body = await got.get(url).json();
    const { observations } = body;
    if (observations.length === 0) {
      return null;
    }
    const raw = observations[observations.length - 1];
    const rates = Object.entries(raw).reduce((r, [rawKey, value]) => {
      if (!rawKey.startsWith('FX')) {
        return r;
      }

      const currency = rawKey.replace('FX', '').replace(this.quote, '');
      return {
        ...r,
        [toSymbolKey(currency)]: { [this.quote]: value.v },
        [this.quote]: {
          ...(r[this.quote] || {}),
          [toSymbolKey(currency)]: bn(1).dividedBy(value.v).toFixed(this.decimals),
        },
      };
    }, {});

    return rates;
  }

  static create() {
    return new Source();
  }
}

module.exports = Source;
