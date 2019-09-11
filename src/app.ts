import 'reflect-metadata';
import { Action, useContainer as routingUseContainer, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';
import { createConnection, useContainer as ormUseContainer } from 'typeorm';
import { UserController } from './controllers/UserController';
import { User } from './entity/User';
import { UserInfo } from './entity/UserInfo';
import { Address } from './entity/Address';
import { UserInfoController } from './controllers/UserInfoController';
import { LoginController } from './controllers/LoginController';
import { RegistrationController } from './controllers/RegistrationController';
import * as express from 'express';
import * as session from 'express-session';
import TokenUtil from './util/TokenUtil';
import DateUtil from './util/DateUtil';
import { TokenValidationDTO } from './dto/TokenValidationDTO';

require('dotenv').config();

/**
 * Setup routing-controllers to use typedi container.
 */
routingUseContainer(Container);
ormUseContainer(Container);

createConnection({
    name: 'default',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'test',
    synchronize: true,
    entities: [User, UserInfo, Address],
    logging: true,
    logger: 'file',
});

const app = express();

app.use(session({ secret: process.env.LOGIN_SECRET, saveUninitialized: true }));

useExpressServer(app, {
    /**
     * We can add options about how routing-controllers should configure itself.
     * Here we specify what controllers should be registered in our express server.
     */
    controllers: [UserController, UserInfoController, LoginController, RegistrationController],
    authorizationChecker: async (action: Action) => {
        const token = action.request.headers['authorization'];
        const secret = action.request.headers['secret'];
        const sessionUser = action.request.session.user;
        const result: TokenValidationDTO = await TokenUtil.validate(token, secret);
        console.log(token, secret, sessionUser, result)
        return (
            token &&
            secret &&
            sessionUser &&
            result &&
            sessionUser.email === result.user &&
            (await DateUtil.isDateExpired(new Date(result.exp)))
        );
    },
});

/**
 * Start the express app.
 */
module.exports = app.listen(3000);
