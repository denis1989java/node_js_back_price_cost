import 'mocha';
import * as chai from 'chai';
import * as app from '../app';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);
/*const expect = chai.expect;
const assert = chai.assert;*/
describe('Describe the basic nature of what are the series of test cases here', () => {
    it('Get', done => {
        chai.request(app)
            .post('/login')
            .send({
                email: 'denis1989@bk.ru',
                password: '090689',
            })
            .then(() => {
                //chai.assert(res.body.displayname).to.eql('name'); // assertion expression which will be true if "displayname" equal to "name"
                // chai.expect(res.status).to.eql(200);// expression which will be true if response status equal to 200
                done();
            });
    }).timeout(6000);
});

describe('Describe the basic nature of what are the series of test cases here', () => {
    it('Get', done => {
        chai.request(app)
            .get('/users')
            .then(() => {
                //chai.assert(res.body.displayname).to.eql('name'); // assertion expression which will be true if "displayname" equal to "name"
                // chai.expect(res.status).to.eql(200);// expression which will be true if response status equal to 200
                done();
            });
    }).timeout(6000);
});
