import server from './app';

module.exports = server.app.listen(3000, async function() {
    await server.initializeCurrencies();
    await server.updateCurrenciesJob.start();
    server.logger.info('server started');
});
