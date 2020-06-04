const xml = require('xml-js');
const got = require('got');
const { string: { toSymbolKey }, bn } = require('@asefux/common');

const Base = require('./base');

class Source extends Base {
  constructor() {
    super({
      symbol: 'bank-of-romania',
      quote: 'RON',
      timeShift: 0,
    });
    this.url = 'https://www.bnr.ro/nbrfxrates.xml';
    this.deno = bn(1);
  }

  async _fetch() {
    const { body } = await got(this.url);

    const info = xml.xml2js(body);


    const { elements } = info.elements[0].elements[info.elements[0].elements.length - 1].elements[
      info.elements[0].elements[info.elements[0].elements.length - 1].elements.length - 1
    ];


    const reducer = (r, { elements, attributes }) => {
      const [{ text: rate }] = elements;
      const { currency: base, multiplier = 1 } = attributes;

      return {
        ...r,
        [this.quote]: {
          ...(r[this.quote] || {}),
          [toSymbolKey(base)]: this.deno.dividedBy(bn(rate).dividedBy(multiplier)).toFixed(this.decimals),

        },
        [toSymbolKey(base)]: {
          ...(r[toSymbolKey(base)] || {}),
          [this.quote]: bn(rate).dividedBy(multiplier).toFixed(this.decimals),
        },
      };
    };
    const merged = elements.reduce(reducer.bind(this), {});

    return merged;
  }

  create() {
    return new Source();
  }
}

module.exports = Source;
