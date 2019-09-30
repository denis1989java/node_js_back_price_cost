import 'mocha';
import app from '../../app';
import { Server } from 'http';
import PriceCostException from '../error/PriceCostException';
import { Messages } from '../util/Messages';
import { ForbiddenError } from 'routing-controllers';
import { UserStatus } from '../entity/UserStatus';
import { AuthorizationRequiredError } from 'routing-controllers/error/AuthorizationRequiredError';

const chai = require('chai');
const supertest = require('supertest');
const http = require('http');
const assert = chai.assert;
const HttpStatus = require('http-status-codes');

const server: Server = http.createServer(app.app);
let request: any;

const USER = {
    email: 'denis1@bk.ru',
    password: '090689',
};

const WRONG_PASSWORD_USER = {
    email: 'denis1@bk.ru',
    password: '0906891',
};

const PURCHASE_POTATOES = {
    name: 'Potatoes',
    quantity: 12,
    measuring: 1,
    price: 14.56,
    currency: 'USD',
};

const PURCHASE_CARROT = {
    name: 'Carrot',
    quantity: 28,
    measuring: 0,
    price: 1.34,
    currency: 'BYN',
};

const DISH_SALAT = {
    name: 'Salat',
};

const DISH_VEGETABLES = {
    name: 'Vegetables',
};

const DISH_VEGETABLES_UPDATE = {
    name: 'Vegetables mix',
    id: 2,
};

const WRONG_DISH_VEGETABLES_UPDATE = {
    name: 'Wrong vegetables mix',
    id: 3,
};

const INGREDIENT_POTATOES = {
    name: 'Potatoes',
    dishId: 1,
    purchaseId: 1,
    quantity: 1253,
    measuring: 1,
};

const INGREDIENT_CARROT = {
    name: 'Carrot',
    dishId: 1,
    purchaseId: 2,
    quantity: 12,
    measuring: 0,
};

const WRONG_DISH_IN_INGREDIENT = {
    name: 'Carrot',
    dishId: 3,
    purchaseId: 2,
    quantity: 12,
    measuring: 0,
};

const WRONG_PURCHASE_IN_INGREDIENT = {
    name: 'Carrot',
    dishId: 1,
    purchaseId: 4,
    quantity: 12,
    measuring: 0,
};

const USER_INFO = {
    currency: 'USD',
    birthDate: '1989-06-09',
    name: 'denis',
    surname: 'monich',
    phone: '+375296522540',
    city: 'Minsk',
    country: 'Belarus',
    street: 'Sharangovicha 33-92',
    zip: '220019',
    userId: '1',
};

const JSON_WEB_TOKEN_ERROR = 'JsonWebTokenError';
const JSON_WEB_TOKEN_ERROR_MESSAGE = 'jwt must be provided';
const AUTHORISATION_REQUIRED_ERROR_MESSAGE = 'Authorization is required for request on POST /userInfo';
const EXPIRED_AUTHORISATION_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGVuaXMxOTg5QGJrLnJ1IiwiaWF0IjoxNTY5Nzg0Mjg5LCJleHAiOjE1Njk5NTcwODl9.frLwSgNTiS8RS-82MsicB0s9MX1H3d2TdI-ALDzR6cE';

let AUTHORISATION_TOKEN: string;
let AUTHORISATION_COOKIES: any;

function getCookies(headers: any): void {
    return headers['set-cookie'][0].split(/,(?=\S)/).map((item: any) => item.split(';')[0]);
}

describe('Integration test', async () => {
    before(async function() {
        await app.insertCurrencies();
        request = await supertest(server);
    });

    it('login: user not exist', function(done) {
        request
            .post('/login')
            .send(USER)
            .expect(HttpStatus.FORBIDDEN)
            .then((res: any) => {
                assert.equal(res.body.name, ForbiddenError.name);
                assert.equal(res.body.message, Messages.CREDENTIALS_INVALID);
                done();
            })
            .catch((err: any) => {
                done(err);
            });
    });

    it('registration: success', function(done) {
        request
            .post('/registration')
            .send(USER)
            .expect(HttpStatus.OK)
            .then((res: any) => {
                assert.equal(res.body.id, 1);
                assert.equal(res.body.email, USER.email);
                assert.equal(res.body.status, UserStatus.REGISTERED);
                done();
            })
            .catch((err: any) => {
                done(err);
            });
    });

    it('registration: user already exist', function(done) {
        request
            .post('/registration')
            .send(WRONG_PASSWORD_USER)
            .expect(HttpStatus.FORBIDDEN)
            .then((res: any) => {
                assert.equal(res.body.name, ForbiddenError.name);
                assert.equal(res.body.message, Messages.USER_ALREADY_EXIST);
                done();
            })
            .catch((err: any) => {
                done(err);
            });
    });

    it('login: password is wrong', function(done) {
        request
            .post('/login')
            .send(WRONG_PASSWORD_USER)
            .expect(HttpStatus.FORBIDDEN)
            .then((res: any) => {
                assert.equal(res.body.name, ForbiddenError.name);
                assert.equal(res.body.message, Messages.CREDENTIALS_INVALID);
                done();
            })
            .catch((err: any) => {
                done(err);
            });
    });

    it('login: success', function(done) {
        request
            .post('/login')
            .send(USER)
            .expect(HttpStatus.OK)
            .then((res: any) => {
                assert.equal(res.body.length, 157);
                AUTHORISATION_TOKEN = res.body;
                AUTHORISATION_COOKIES = getCookies(res.headers);
                done();
            })
            .catch((err: any) => {
                done(err);
            });
    });

    it('login info: unauthorised', function(done) {
        request
            .post('/userInfo')
            .send(USER_INFO)
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then((res: any) => {
                assert.equal(res.body.name, JSON_WEB_TOKEN_ERROR);
                assert.equal(res.body.message, JSON_WEB_TOKEN_ERROR_MESSAGE);
                done();
            })
            .catch((err: any) => {
                done(err);
            });
    });

    it('login info: token expired', function(done) {
        request
            .post('/userInfo')
            .set('Cookie', AUTHORISATION_COOKIES)
            .set('Authorization', EXPIRED_AUTHORISATION_TOKEN)
            .set('secret', process.env.LOGIN_SECRET)
            .send(USER_INFO)
            .expect(HttpStatus.UNAUTHORIZED)
            .then((res: any) => {
                assert.equal(res.body.name, AuthorizationRequiredError.name);
                assert.equal(res.body.message, AUTHORISATION_REQUIRED_ERROR_MESSAGE);
                done();
            })
            .catch((err: any) => {
                done(err);
            });
    });

    it('login info: success', function(done) {
        request
            .post('/userInfo')
            .set('Cookie', AUTHORISATION_COOKIES)
            .set('Authorization', AUTHORISATION_TOKEN)
            .set('secret', process.env.LOGIN_SECRET)
            .send(USER_INFO)
            .expect(HttpStatus.OK)
            .then((res: any) => {
                assert.equal(res.body.id, 1);
                assert.equal(res.body.currency.code, USER_INFO.currency);
                assert.equal(res.body.currency.name, 'United States Dollar');
                assert.equal(res.body.currency.id, 151);
                assert.equal(res.body.birthDate, '1989-06-09T00:00:00.000Z');
                assert.equal(res.body.name, USER_INFO.name);
                assert.equal(res.body.surname, USER_INFO.surname);
                assert.equal(res.body.phone, USER_INFO.phone);
                assert.equal(res.body.city, USER_INFO.city);
                assert.equal(res.body.country, USER_INFO.country);
                assert.equal(res.body.street, USER_INFO.street);
                assert.equal(res.body.zip, USER_INFO.zip);
                done();
            })
            .catch((err: any) => {
                done(err);
            });
    });

    it('purchase potatoes: success', function(done) {
        request
            .post('/purchases')
            .set('Cookie', AUTHORISATION_COOKIES)
            .set('Authorization', AUTHORISATION_TOKEN)
            .set('secret', process.env.LOGIN_SECRET)
            .send(PURCHASE_POTATOES)
            .expect(HttpStatus.OK)
            .then((res: any) => {
                assert.equal(res.body.id, 1);
                assert.equal(res.body.name, PURCHASE_POTATOES.name);
                //assert.equal(res.body.price, 1.2133333333333334);
                done();
            })
            .catch((err: any) => {
                done(err);
            });
    });

    it('purchase carrot: success', function(done) {
        request
            .post('/purchases')
            .set('Cookie', AUTHORISATION_COOKIES)
            .set('Authorization', AUTHORISATION_TOKEN)
            .set('secret', process.env.LOGIN_SECRET)
            .send(PURCHASE_CARROT)
            .expect(HttpStatus.OK)
            .then((res: any) => {
                assert.equal(res.body.id, 2);
                assert.equal(res.body.name, PURCHASE_CARROT.name);
                //assert.equal(res.body.price, 0.02308979981557109);
                done();
            })
            .catch((err: any) => {
                done(err);
            });
    });

    it('dish salat: success', function(done) {
        request
            .post('/dishes')
            .set('Cookie', AUTHORISATION_COOKIES)
            .set('Authorization', AUTHORISATION_TOKEN)
            .set('secret', process.env.LOGIN_SECRET)
            .send(DISH_SALAT)
            .expect(HttpStatus.OK)
            .then((res: any) => {
                assert.equal(res.body.id, 1);
                assert.equal(res.body.name, DISH_SALAT.name);
                done();
            })
            .catch((err: any) => {
                done(err);
            });
    });

    it('dish salat: dish already exist', function(done) {
        request
            .post('/dishes')
            .set('Cookie', AUTHORISATION_COOKIES)
            .set('Authorization', AUTHORISATION_TOKEN)
            .set('secret', process.env.LOGIN_SECRET)
            .send(DISH_SALAT)
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then((res: any) => {
                assert.equal(res.body.name, PriceCostException.name);
                assert.equal(res.body.message, Messages.DISH_ALREADY_EXIST);
                done();
            })
            .catch((err: any) => {
                done(err);
            });
    });

    it('dish vegetables: success', function(done) {
        request
            .post('/dishes')
            .set('Cookie', AUTHORISATION_COOKIES)
            .set('Authorization', AUTHORISATION_TOKEN)
            .set('secret', process.env.LOGIN_SECRET)
            .send(DISH_VEGETABLES)
            .expect(HttpStatus.OK)
            .then((res: any) => {
                assert.equal(res.body.id, 2);
                assert.equal(res.body.name, DISH_VEGETABLES.name);
                done();
            })
            .catch((err: any) => {
                done(err);
            });
    });

    it('ingredient potatoes: success', function(done) {
        request
            .post('/ingredients')
            .set('Cookie', AUTHORISATION_COOKIES)
            .set('Authorization', AUTHORISATION_TOKEN)
            .set('secret', process.env.LOGIN_SECRET)
            .send(INGREDIENT_POTATOES)
            .expect(HttpStatus.OK)
            .then((res: any) => {
                assert.equal(res.body.id, 1);
                assert.equal(res.body.name, INGREDIENT_POTATOES.name);
                assert.equal(res.body.quantity, INGREDIENT_POTATOES.quantity);
                assert.equal(res.body.dishId, INGREDIENT_POTATOES.dishId);
                assert.equal(res.body.dishAmount, 1520.3066666666625);
                done();
            })
            .catch((err: any) => {
                done(err);
            });
    });

    it('ingredient carrot: success', function(done) {
        request
            .post('/ingredients')
            .set('Cookie', AUTHORISATION_COOKIES)
            .set('Authorization', AUTHORISATION_TOKEN)
            .set('secret', process.env.LOGIN_SECRET)
            .send(INGREDIENT_CARROT)
            .expect(HttpStatus.OK)
            .then((res: any) => {
                assert.equal(res.body.id, 2);
                assert.equal(res.body.name, INGREDIENT_CARROT.name);
                assert.equal(res.body.quantity, INGREDIENT_CARROT.quantity);
                assert.equal(res.body.dishId, INGREDIENT_CARROT.dishId);
                assert.equal(res.body.dishAmount, 1520.5837442644493);
                done();
            })
            .catch((err: any) => {
                done(err);
            });
    });

    it('ingredient: wrong dish', function(done) {
        request
            .post('/ingredients')
            .set('Cookie', AUTHORISATION_COOKIES)
            .set('Authorization', AUTHORISATION_TOKEN)
            .set('secret', process.env.LOGIN_SECRET)
            .send(WRONG_DISH_IN_INGREDIENT)
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then((res: any) => {
                assert.equal(res.body.name, PriceCostException.name);
                assert.equal(res.body.message, Messages.WRONG_DISH);
                done();
            })
            .catch((err: any) => {
                done(err);
            });
    });

    it('ingredient: wrong purchase', function(done) {
        request
            .post('/ingredients')
            .set('Cookie', AUTHORISATION_COOKIES)
            .set('Authorization', AUTHORISATION_TOKEN)
            .set('secret', process.env.LOGIN_SECRET)
            .send(WRONG_PURCHASE_IN_INGREDIENT)
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then((res: any) => {
                assert.equal(res.body.name, PriceCostException.name);
                assert.equal(res.body.message, Messages.WRONG_PURCHASE);
                done();
            })
            .catch((err: any) => {
                done(err);
            });
    });

    it('dish update vegetables: success', function(done) {
        request
            .put('/dishes')
            .set('Cookie', AUTHORISATION_COOKIES)
            .set('Authorization', AUTHORISATION_TOKEN)
            .set('secret', process.env.LOGIN_SECRET)
            .send(DISH_VEGETABLES_UPDATE)
            .expect(HttpStatus.OK)
            .then((res: any) => {
                assert.equal(res.body.id, 2);
                assert.equal(res.body.name, DISH_VEGETABLES_UPDATE.name);
                done();
            })
            .catch((err: any) => {
                done(err);
            });
    });

    it('dish update vegetables: wrong id', function(done) {
        request
            .put('/dishes')
            .set('Cookie', AUTHORISATION_COOKIES)
            .set('Authorization', AUTHORISATION_TOKEN)
            .set('secret', process.env.LOGIN_SECRET)
            .send(WRONG_DISH_VEGETABLES_UPDATE)
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then((res: any) => {
                assert.equal(res.body.name, PriceCostException.name);
                assert.equal(res.body.message, Messages.DISH_NOT_EXIST);
                done();
            })
            .catch((err: any) => {
                done(err);
            });
    });

    it('delete ingredient carrot: success', function(done) {
        request
            .delete('/ingredients/1')
            .set('Cookie', AUTHORISATION_COOKIES)
            .set('Authorization', AUTHORISATION_TOKEN)
            .set('secret', process.env.LOGIN_SECRET)
            .expect(HttpStatus.OK)
            .then((res: any) => {
                assert.equal(res.body.raw.affectedRows, 1);
                assert.equal(res.body.affected, 1);
                done();
            })
            .catch((err: any) => {
                done(err);
            });
    });

    it('get ingredients by dishId: success', function(done) {
        request
            .get('/ingredients/1')
            .set('Cookie', AUTHORISATION_COOKIES)
            .set('Authorization', AUTHORISATION_TOKEN)
            .set('secret', process.env.LOGIN_SECRET)
            .expect(HttpStatus.OK)
            .then((res: any) => {
                assert.equal(res.body.length, 1);
                assert.equal(res.body[0].id, 2);
                done();
            })
            .catch((err: any) => {
                done(err);
            });
    });

    it('delete dish salat: success', function(done) {
        request
            .delete('/dishes/1')
            .set('Cookie', AUTHORISATION_COOKIES)
            .set('Authorization', AUTHORISATION_TOKEN)
            .set('secret', process.env.LOGIN_SECRET)
            .expect(HttpStatus.OK)
            .then((res: any) => {
                assert.equal(res.body.raw.affectedRows, 1);
                assert.equal(res.body.affected, 1);
                done();
            })
            .catch((err: any) => {
                done(err);
            });
    });

    it('get ingredients by dishId: success', function(done) {
        request
            .get('/ingredients/1')
            .set('Cookie', AUTHORISATION_COOKIES)
            .set('Authorization', AUTHORISATION_TOKEN)
            .set('secret', process.env.LOGIN_SECRET)
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then((res: any) => {
                assert.equal(res.body.name, PriceCostException.name);
                assert.equal(res.body.message, Messages.WRONG_DISH);
                done();
            })
            .catch((err: any) => {
                done(err);
            });
    });

    after(async () => {
        await app.dropDB();
        server.close();
        app.logger.info('finish');
    });
});
