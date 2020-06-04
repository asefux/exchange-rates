const { string: { compile, toSymbolKey }, bn } = require('@asefux/common');
const got = require('got');

const Base = require('./base');

class Source extends Base {
  constructor() {
    super({ symbol: 'bank-of-norway', quote: 'NOK' });
    this.url = 'https://data.norges-bank.no/api/data/EXR/B..NOK.SP?startPeriod=${todayDate}&endPeriod=${todayDate}&format=sdmx-json&locale=en';
  }

  async _fetch() {
    const url = compile({
      template: this.url,
      info: { todayDate: this.nowDate },
    });
    const body = await got.get(url).json();

    const { dataSets, structure } = body;
    const { series } = dataSets[0];
    const currencies = structure.dimensions.series[1].values.map(({ id }) => id);
    const rates = Object.entries(dataSets[0].series).map(([k, { observations, attributes }]) => {
      const [_, curId] = k.split(':');
      const [decimals, calculated, unitMult, collection] = attributes;
      const currency = toSymbolKey(currencies[parseInt(curId, 10)]);
      const [rate] = Object.values(observations)[0];
      const unitRate = bn(rate).dividedBy(bn(100).pow(unitMult)).toFixed(this.decimals);

      return { currency, rate: unitRate };
    });

    return rates.reduce((r, { currency, rate }) => ({
      ...r,
      [currency]: {
        ...(r[currency] || {}),
        [this.quote]: rate,
      },
      [this.quote]: {
        ...(r[this.quote] || {}),
        [currency]: bn(1).dividedBy(rate).toFixed(this.decimals),
      },
    }), {});
  }

  static create() {
    return new Source();
  }
}

module.exports = Source;
