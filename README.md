# @asefux/exchange-rates

gather exchange-rates from muiltiplie national banks


## Usage

```javascript
const ExchangeRates = require('@asefux/exchange-rates');

const exchangeRates = ExchangeRates();

exchangeRates.matrix()
.then((ratesMatrix)=>{
        console.log(JSON.stringify(ratesMatrix, null, 2));
});

exchangeRates.rate(10, 'eur', 'usd').then(console.log); // will output how much USD is 10 EUR



```
Rates matrix of this format

```javascript

{
        [base]: {
                [quote]: price
        }
}
// how much quote would you get for 1 unit of base
```

## Sources

- [x] [Bank of Canada / Banqueu du Canada](https://www.bankofcanada.ca/)
- [x] [Danmark National Bank](http://www.nationalbanken.dk/en)
- [x] [Bank of Estonia / Eesti Pank](https://eestipank.ee/en)
- [x] [Bank of Sweden / Sveriges Riksbank](https://www.riksbank.se/en-gb/)
- [x] [Bank of Norway / Norges Bank](https://www.norges-bank.no/en/)
- [x] [European Central Bank](https://ecb.europa.eu)
- [x] [Bank of Romania / Banca Nationala a Romaniei](https://www.bnro.ro/Home.aspx)
- [x] [Bank of Bulgaria](http://www.bnb.bg/?toLang=_EN)
- [ ] [Bank of Hungary / Magyar Nemzeti Bank](https://www.mnb.hu/en/)
- [ ] [Bank of Netherlands / De Nederlandsche Bank](https://www.dnb.nl/en/)
- [ ] [Bank of England](https://www.bankofengland.co.uk/)
- [ ] [Bank of France / Banque de France](https://www.banque-france.fr/en)
- [ ] [Bank of Spain / Banco de Espana](https://www.bde.es/bde/en/)
- [ ] [Bank of Portugal / Banco de Portugal](https://www.bportugal.pt/en)
- [ ] [Bank of Italy / Banca d'Italia](https://www.bancaditalia.it/)
- [ ] [Bank of Germany / Deutsche Bundesbank](https://www.bundesbank.de/en/)
- [ ] [Bank of Slovenia / Banka Slovenije](https://www.bsi.si/en/)
- [ ] [Bank of Czech Republic / Ceska Narodni Banka](https://www.cnb.cz/en/index.html)
- [ ] [Bank of Lithuania / Lietuvos Bankas](https://www.lb.lt/)
- [ ] [Bank of Latvia / Latvijas Banka](https://www.bank.lv/en/)
- [ ] [Bank of Slovakia / Narodna Banka Slovenska](https://www.nbs.sk/en/home)
- [ ] [Bank of Poland / Narodowy Bank Polski](https://www.nbp.pl/)
- [ ] [Bank of Croatia / Hrvatska Narodna Banka](https://www.hnb.hr/home)
- [ ] [Bank of Serbia ](https://www.nbs.rs/internet/english)
- [ ] [Bank of Greece](https://www.bankofgreece.gr/en/homepage)
- [ ] [Bank of Ireland / Banc Ceannais na heireann](https://www.centralbank.ie/)
- [ ] [Bank of Malta / Bank Centrali ta'Malta](https://www.centralbankmalta.org/)
- [ ] [Bank of Cyprus](https://www.centralbank.cy/en/home)
- [ ] [Bank of Luxembourg / Banque Centrale du Luxembourg](http://www.bcl.lu/en/index.html)
- [ ] [Bank of Belgium / Banque Nationale de Belgique / Bank van Belgie](https://www.nbb.be/en)
- [ ] [Bank of Austria / Oesterreichische Nationalbank](https://www.oenb.at/en/)
- [ ] [Bank of Bosnia and Herzegovina / Centralna Banka Bosne I Hergegovine](https://www.cbbh.ba/?lang=en)
- [ ] [Bank of Australia](https://www.rba.gov.au/)
- [ ] [Bank of Albania / Banka e Shqiperise](https://www.bankofalbania.org/home/)
- [ ] [Bank of Armenia ](https://www.cba.am/en/sitepages/default.aspx)
- [ ] [Bank of Belarus](http://www.nbrb.by/engl/)
- [ ] [Bank of Argentina / Banco Central de la Republica Argentina](http://www.bcra.gob.ar/default.asp)
- [ ] [Central Bank of Brasil / Banco Central Do Brasil](https://www.bcb.gov.br/en)
- [ ] [Bank of Chile / Banco Central de Chile](https://www.bcentral.cl/en/web/banco-central)

---

- [ ] [Bank of Finland / Suomen Pankki](https://www.suomenpankki.fi/en/) - same as ECB

- [ ] [Others](https://www.bis.org/cbanks.htm)



# Changes

| Version     |   Changes       |
|-------------|-----------------|
| 1.0.0       | initial code    |
| 1.0.1       | update api      |
| 1.1.0       | Bank of Bulgaria|
| 1.1.1       | on weekends get rates of last working day|
