import 'reflect-metadata';
import { Action, useContainer as routingUseContainer, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';
import { Connection, createConnection, getConnection, Repository, useContainer as ormUseContainer } from 'typeorm';
import { UserController } from './controllers/UserController';
import { UserInfoController } from './controllers/UserInfoController';
import { LoginController } from './controllers/LoginController';
import { RegistrationController } from './controllers/RegistrationController';
import * as express from 'express';
import * as session from 'express-session';
import TokenUtil from './util/TokenUtil';
import DateUtil from './util/DateUtil';
import { TokenValidationDTO } from './dto/TokenValidationDTO';
import { Currency } from './entity/Currency';
import CommonRequest from './repository/CommonRequest';
import { CurrencyRatesRequestDTO } from './dto/CurrencyRatesRequestDTO';
import { CurrencyController } from './controllers/CurrencyController';
import { PurchaseController } from './controllers/PurchaseController';
import { MeasuringController } from './controllers/MeasuringController';
import { DishController } from './controllers/DishController';
import { IngredientController } from './controllers/IngredientController';
import { User } from './entity/User';
import { Address } from './entity/Address';
import { Dish } from './entity/Dish';
import { Ingredient } from './entity/Ingredient';
import { Purchase } from './entity/Purchase';
import { UserInfo } from './entity/UserInfo';
import { format } from 'winston';
import errorMiddleware from './middleware/error.middleware';

require('dotenv').config();
const bodyParser = require('body-parser');
const fs = require('fs');
const cron = require('node-cron');
const winston = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.json(),
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log', level: 'info' }),
    ],
});

routingUseContainer(Container);
ormUseContainer(Container);

const defaultConnection = createConnection({
    name: 'default',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'test',
    synchronize: true,
    entities: [User, Address, Currency, Dish, Ingredient, Purchase, UserInfo],
    logging: true,
    logger: 'file',
});

const app = express();

app.use(session({ secret: process.env.LOGIN_SECRET, saveUninitialized: true, resave: true }));

app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);
app.use(bodyParser.json());

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
        IngredientController,
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

async function updateCurrencies(currencies: Currency[], currencyRepository: Repository<Currency>): Promise<Currency[]> {
    logger.info('Currencies updating started');
    const currencyRatesResponseDTO: CurrencyRatesRequestDTO = await CommonRequest.get(process.env.CURRENCIES_RATES_URL);
    await currencies.map(currency => {
        currency.rate = currencyRatesResponseDTO.rates[currency.code];
        currencyRepository.update(currency.id, currency);
    });
    logger.info('Currencies updating finished');
    return currencies;
}

const initializeCurrencies = async (): Promise<Currency[]> => {
    logger.info('Currencies initialization started');
    const currenciesJSON: { [index: string]: string } = await CommonRequest.get(process.env.CURRENCIES_NAMES_URL);
    let currencies: Currency[] = Object.keys(currenciesJSON).map((key: string) => {
        return new Currency(key, currenciesJSON[key]);
    });
    const currencyRepository = await getConnection().getRepository(Currency);
    currencies = await currencyRepository.save(currencies);
    logger.info('Currencies initialization finish');
    currencies = await updateCurrencies(currencies, currencyRepository);
    return currencies;
};
//1 0 * * 1-7
const updateCurrenciesJob = cron.schedule(
    '0 * * * * *',
    async () => {
        const currencyRepository = await getConnection().getRepository(Currency);
        const currencies: Currency[] = await currencyRepository.find();
        await updateCurrencies(currencies, currencyRepository);
    },
    {
        scheduled: true,
    },
);

const dropDB = async (): Promise<void> => {
    logger.info('dropping of DB started');
    const connection: Connection = await defaultConnection;
    await connection.dropDatabase();
    logger.info('dropping of DB finished');
};

const insertCurrencies = async (): Promise<void> => {
    logger.info('inserting of currencies started');
    const connection: Connection = await defaultConnection;
    const queries = fs
        .readFileSync('currencies.sql')
        .toString()
        .split('\r\n');
    await queries.map(async (query: string) => {
        await connection.query(query);
    });
    logger.info('inserting of currencies finished');
};

app.use(errorMiddleware);

const server = { app, initializeCurrencies, updateCurrenciesJob, logger, dropDB, insertCurrencies };

export default server;
