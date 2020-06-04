const xml = require('xml-js');
const got = require('got');
const { string: { toSymbolKey }, bn } = require('@asefux/common');

const Base = require('./base');

class Source extends Base {
  constructor() {
    super({
      symbol: 'european-central-bank',
      quote: 'EUR',
      timeShift: 0,
    });
    this.url = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';
    this.deno = bn(1);
  }

  async _fetch() {
    const { body } = await got(this.url);

    const info = xml.xml2js(body);
    //    console.log(JSON.stringify(info, null, 2));

    //    return {};
    const { elements } = info.elements[0].elements[info.elements[0].elements.length - 1].elements[0];

    const reducer = (r, { attributes: { currency: base, rate } }) => ({
      ...r,
      [this.quote]: {
        ...(r[this.quote] || {}),
        [toSymbolKey(base)]: bn(rate).toFixed(this.decimals),

      },
      [toSymbolKey(base)]: {
        ...(r[toSymbolKey(base)] || {}),
        [this.quote]: this.deno.dividedBy(rate).toFixed(this.decimals),
      },
    });
    const merged = elements.reduce(reducer.bind(this), {});

    return merged;
  }

  create() {
    return new Source();
  }
}

module.exports = Source;
