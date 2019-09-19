import 'reflect-metadata';
import {Action, useContainer as routingUseContainer, useExpressServer} from 'routing-controllers';
import {Container} from 'typedi';
import {createConnection, getConnection, useContainer as ormUseContainer} from 'typeorm';
import {UserController} from './controllers/UserController';
import {UserInfoController} from './controllers/UserInfoController';
import {LoginController} from './controllers/LoginController';
import {RegistrationController} from './controllers/RegistrationController';
import * as express from 'express';
import * as session from 'express-session';
import TokenUtil from './util/TokenUtil';
import DateUtil from './util/DateUtil';
import {TokenValidationDTO} from './dto/TokenValidationDTO';
import {Currency} from './entity/Currency';
import CommonRequest from './repository/CommonRequest';
import {CurrencyRatesRequestDTO} from './dto/CurrencyRatesRequestDTO';
import {CurrencyController} from './controllers/CurrencyController';
import {PurchaseController} from './controllers/PurchaseController';
import {MeasuringController} from "./controllers/MeasuringController";
import {DishController} from "./controllers/DishController";
import {IngredientController} from "./controllers/IngredientController";

require('dotenv').config();
const cron = require('node-cron');
const winston = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'combined.log', level: 'info'}),
    ],
});

routingUseContainer(Container);
ormUseContainer(Container);
createConnection();

const app = express();

app.use(session({secret: process.env.LOGIN_SECRET, saveUninitialized: true}));

useExpressServer(app, {
    controllers: [
        UserController,
        UserInfoController,
        LoginController,
        RegistrationController,
        CurrencyController,
        PurchaseController,
        MeasuringController,
        DishController,
        IngredientController
    ],
    authorizationChecker: async (action: Action) => {
        const token = action.request.headers['authorization'];
        const secret = action.request.headers['secret'];
        const sessionUser = action.request.session.user;
        const result: TokenValidationDTO = await TokenUtil.validate(token, secret);
        return (
            token &&
            secret &&
            sessionUser &&
            result &&
            sessionUser.email === result.user &&
            (await DateUtil.isDateExpired(new Date(result.exp)))
        );
    },
    currentUserChecker: async (action: Action) => {
        return action.request.session.user;
    },
});

async function initializeCurrencies(): Promise<Currency[]> {
    logger.info('Currencies initialization started');
    const currenciesJSON: { [index: string]: string } = await CommonRequest.get(process.env.CURRENCIES_NAMES_URL);
    let currencies: Currency[] = Object.keys(currenciesJSON).map((key: string) => {
        return new Currency(key, currenciesJSON[key]);
    });
    const currencyRepository = await getConnection().getRepository(Currency);
    currencies = await currencyRepository.save(currencies);
    logger.info('Currencies initialization finish');
    return currencies;
}

//1 0 * * 1-7
const updateCurrencies = cron.schedule(
    '1 * * * * *',
    async () => {
        logger.info('Currencies updating started');
        const currencyRatesResponseDTO: CurrencyRatesRequestDTO = await CommonRequest.get(
            process.env.CURRENCIES_RATES_URL,
        );
        const currencyRepository = await getConnection().getRepository(Currency);
        const currencies: Currency[] = await currencyRepository.find();
        await currencies.map(currency => {
            currency.rate = currencyRatesResponseDTO.rates[currency.code];
            currencyRepository.update(currency.id, currency);
        });
        logger.info('Currencies updating finished');
    },
    {
        scheduled: true,
    },
);

module.exports = app.listen(3000, async function () {
    logger.info('Server started');
    await initializeCurrencies();
    await updateCurrencies.start();
});
