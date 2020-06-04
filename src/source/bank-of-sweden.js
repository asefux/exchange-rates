const got = require('got');
const { string: { toSymbolKey, compile }, bn } = require('@asefux/common');

const Base = require('./base');

class Source extends Base {
  constructor() {
    super({
      symbol: 'bank-of-sweden',
      quote: 'SEK',
      timeShift: 0,
    });
    this.url = 'https://www.riksbank.se/en-gb/statistics/search-interest--exchange-rates/?c=cAverage&f=Day&from=03%2f06%2f2020&g130-SEKATSPMI=on&g130-SEKAUDPMI=on&g130-SEKBEFPMI=on&g130-SEKBRLPMI=on&g130-SEKCADPMI=on&g130-SEKCHFPMI=on&g130-SEKCNYPMI=on&g130-SEKCYPPMI=on&g130-SEKCZKPMI=on&g130-SEKDEMPMI=on&g130-SEKDKKPMI=on&g130-SEKEEKPMI=on&g130-SEKESPPMI=on&g130-SEKEURPMI=on&g130-SEKFIMPMI=on&g130-SEKFRFPMI=on&g130-SEKGBPPMI=on&g130-SEKGRDPMI=on&g130-SEKHKDPMI=on&g130-SEKHUFPMI=on&g130-SEKIDRPMI=on&g130-SEKIEPPMI=on&g130-SEKINRPMI=on&g130-SEKISKPMI=on&g130-SEKITLPMI=on&g130-SEKJPYPMI=on&g130-SEKKRWPMI=on&g130-SEKKWDPMI=on&g130-SEKLTLPMI=on&g130-SEKLVLPMI=on&g130-SEKMADPMI=on&g130-SEKMXNPMI=on&g130-SEKMYRPMI=on&g130-SEKNLGPMI=on&g130-SEKNOKPMI=on&g130-SEKNZDPMI=on&g130-SEKPLNPMI=on&g130-SEKPTEPMI=on&g130-SEKRUBPMI=on&g130-SEKSARPMI=on&g130-SEKSGDPMI=on&g130-SEKSITPMI=on&g130-SEKSKKPMI=on&g130-SEKTHBPMI=on&g130-SEKTRLPMI=on&g130-SEKTRYPMI=on&g130-SEKUSDPMI=on&g130-SEKZARPMI=on&s=Dot&to=${day}%2f${month}%2f${fullYear}&export=csv';
  }

  async _fetch() {
    const info = this.nowComponents;
    const url = compile({ template: this.url, info });
    const { body } = await got(url);

    const lines = body.split('\n').map((line) => line.split(';').map((column) => column.trim())).filter((line) => line.length === 4);

    lines.shift();
    const normalizedLines = lines.map(([date, desc, currencyAmount, amountRate]) => {
      const [amount, currency] = currencyAmount.split(' ');
      const unitRate = bn(amountRate).dividedBy(amount).toFixed(this.decimals);
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
