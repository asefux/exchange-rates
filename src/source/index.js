const { bn, string: { toSymbolKey } } = require('@asefux/common');

const Base = require('./base');
const BankOfCanada = require('./bank-of-canada');
const DanmarkNationalBank = require('./danmark-national-bank');
const BankOfEstonia = require('./eesti-pank');
const BankOfSweden = require('./bank-of-sweden');
const BankOfNorway = require('./bank-of-norway');
const EuropeanCentralBank = require('./european-central-bank');
const BankOfRomania = require('./bank-of-romania');
const BankOfBulgaria = require('./bank-of-bulgaria');

const createSources = () => {
  const Sources = [
    BankOfCanada,
    DanmarkNationalBank,
    BankOfEstonia,
    BankOfSweden,
    BankOfNorway,
    EuropeanCentralBank,
    BankOfRomania,
    BankOfBulgaria,
  ];

  const sources = Sources.reduce((result, Source) => {
    const source = Source.create ? Source.create() : new Source();
    return {
      ...result,
      [source.symbol]: source,
    };
  }, {});

  sources.syncNoWait = () => {
    Object.values(sources).forEach((v) => {
      if (v && v.fetch) {
        v.fetch();
      }
    });
  };
  sources.matrix = async (digits = 8) => {
    const listOfMatrices = await Object.values(sources).reduce(async (pr, v) => {
      const prevR = await pr;
      let info = null;
      if (v && v.getMatrix) {
        info = await v.getMatrix();
        if (info) {
          prevR.push(info);
        }
      }
      return prevR;
    }, Promise.resolve([]));
    const matrix = listOfMatrices.reduce((r, m) => Object.entries(m).reduce((bases, [base, prices]) => {
      if (!bases[base]) {
        return {
          ...bases,
          [base]: Object.entries(prices).reduce((r, [quote, price]) => ({
            ...r,
            [quote]: [bn(price).toFixed(digits)],
          }), {}),
        };
      }
      return {
        ...bases,
        [base]: Object.entries(prices).reduce((pairs, [quote, price]) => {
          if (!pairs[quote]) {
            return { ...pairs, [quote]: [bn(price).toFixed(digits)] };
          }
          // return pairs;
          pairs[quote].push(price);
          return pairs;
        }, bases[base]),
      };
    }, r), {});


    return Object.entries(matrix).reduce((m, [base, prices]) => ({
      ...m,
      [base]: Object.entries(prices).reduce((avg, [quote, observations]) => ({
        ...avg,
        [quote]: observations.reduce((s, p) => s.plus(p), bn(0)).dividedBy(observations.length).toFixed(digits),
      }), {}),
    }), {});
  };
  sources.rate = async (amount, base, quote = null) => {
    const matrix = await sources.matrix();
    let nbase;
    let nquote;
    let namount = bn(1);
    if (!quote) {
      nbase = toSymbolKey(amount);
      nquote = toSymbolKey(base);
      namount = bn(1);
    } else {
      nbase = toSymbolKey(base);
      nquote = toSymbolKey(quote);
      namount = bn(amount);
    }
    if (!matrix[nbase] || !matrix[nbase][nquote]) {
      return bn(0).toFixed(8);
    }
    return namount.multipliedBy(matrix[nbase][nquote]).toFixed(8);
  };
  return sources;
};

module.exports = {
  Base,
  BankOfCanada,
  DanmarkNationalBank,
  BankOfSweden,
  BankOfNorway,
  EuropeanCentralBank,
  BankOfRomania,
  BankOfBulgaria,
  createSources,
};
