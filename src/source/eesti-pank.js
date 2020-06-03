const xml = require('xml-js');
const got = require('got');
const { string: { toSymbolKey }, bn } = require('@asefux/common');

const Base = require('./base');

class Source extends Base {
  constructor() {
    super({
      symbol: 'bank-of-estonia',
      quote: 'EUR',
      timeShift: 0,
    });
    this.url = 'https://www.eestipank.ee/en/exchange-rates/export/xml/latest';
    this.deno = bn(1);
  }

  async _fetch() {
    const { body } = await got(this.url);

    const info = xml.xml2js(body);

    const { elements } = info.elements[0].elements[info.elements[0].elements.length - 1].elements[0];

    const reducer = (r, { attributes: { currency: base, rate } }) => ({
      ...r,
      [this.quote]: {
        ...(r[this.quote] || {}),
        [toSymbolKey(base)]: this.deno.dividedBy(rate).toFixed(4),

      },
      [toSymbolKey(base)]: {
        ...(r[toSymbolKey(base)] || {}),
        [this.quote]: bn(rate).toFixed(4),
      },
    });
    return elements.reduce(reducer.bind(this), {});
  }

  create() {
    return new Source();
  }
}

module.exports = Source;
