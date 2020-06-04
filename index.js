const source = require('./src/source');
const { createSources } = source;

createSources.source = source;
module.exports = createSources;
