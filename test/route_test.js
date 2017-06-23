//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../bin/www');

let should = chai.should();
var expect = chai.expect;

chai.use(chaiHttp);

// Mocha self-test
describe('Mocha', function () {
    // Test spec (unit tests)
    it('should run the test with npm', function () {
        expect(true).to.be.ok; // -> ok truthy value
    });
});



// GET request to '/'
describe('/', function () {
    before((done) => {
        console.log("before");
        done();
    });

    // joe@smith.com:password -> am9lQHNtaXRoLmNvbTpwYXNzd29yZA==
    //it('should respond with the authenticated user', function () {
    //    chai.request(server)
    //        .get('/api/users')
    //        .set('Authorization', 'Basic am9lQHNtaXRoLmNvbTpwYXNzd29yZA==')
    //        .end(function (err, res) {
    //            expect(
    //                { _id: "57029ed4795118be119cc437",
    //                    fullName: 'Joe Smith',
    //                    emailAddress: 'joe@smith.com',
    //                    password: '$2a$10$nwVKZmtZhgE9k/wu9BdHJOIE6lXhpxKh1sK0RvmO1hl8DkhZ0.wGi',
    //                    __v: 0 }
    //            ).to.equal(res.body);
    //            done();
    //        });
    //});

    it('should return 200 - OK', function (done) {
        chai.request(server)
            .get('/')
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            })
    });
});