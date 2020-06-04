const xml = require('xml-js');
const got = require('got');
const { string: { toSymbolKey }, bn } = require('@asefux/common');

const Base = require('./base');

class Source extends Base {
  constructor() {
    super({
      symbol: 'danmark-national-bank',
      quote: 'DKK',
      timeShift: 0,
    });
    this.url = 'http://www.nationalbanken.dk/_vti_bin/DN/DataService.svc/CurrencyRatesXML?lang=en';
    this.deno = bn(100);
  }

  async _fetch() {
    const { body } = await got(this.url);
    const info = xml.xml2js(body);

    const { elements } = info.elements[0].elements[0];

    return elements.reduce((r, { attributes: { code: base, rate } }) => ({
      ...r,
      [toSymbolKey(base)]: {
        ...(r[toSymbolKey(base)] || {}),
        [this.quote]: bn(rate).dividedBy(this.deno).toFixed(this.decimals),

      },
      [this.quote]: {
        ...(r[this.quote] || {}),
        [toSymbolKey(base)]: bn(1).dividedBy(bn(rate).dividedBy(this.deno)).toFixed(this.decimals),
      },
    }), {});
  }

  create() {
    return new Source();
  }
}

module.exports = Source;
