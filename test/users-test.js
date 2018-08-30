const chai = require("chai");
const chaiHttp = require("chai-http");
const should = require("chai").should();

const { app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL } = require('../config'); // importing DB
const userModel = require('../models/userModel');
const expect = chai.expect;
chai.use(chaiHttp);


describe('Users test API', function () {

    

    before(function () {
        return runServer();
    });


    after(function () {
        return closeServer();
    });


    describe('Get test', function () {
        it('Return status code 200 and and array of users', function () {
            return chai
                .request(app)
                .get("/users")
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.not.be.empty;
                    expect(res.body).to.be.an('array');
                    expect(res.body[0]).to.be.an('object');

                })
                .catch(function (err) {
                    console.log(err)
                })
        })
    })  // Closing IT Get test describe 

    it('User model schema test', function () {

        return chai
            .request(app)
            .get("/users")
            .then(function (res) {
               

            })
            .catch(function (err) {
                console.log(err)
            })


    })  // Closing User model Schema test

})  // Closig user testing 