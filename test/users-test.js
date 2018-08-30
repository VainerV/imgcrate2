const chai = require("chai");
const chaiHttp = require("chai-http");
const should = require("chai").should();
const faker = require('faker');
const { app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL } = require('../config'); // importing DB
const { User } = require('../models/userModel')
const expect = chai.expect;
chai.use(chaiHttp);


describe('Users test API', function () {
    // sead db with the uses info 
    function seedUsersData() {
        const seedData = [];
        for (let i = 1; i <= 10; i++) {
            seedData.push({
                author: {
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),

                },
                email: faker.internet.email(),
                uniqueUserName: faker.internet.userName()
            });
        }
        console.log(seedData);
        return User.insertMany(seedData);

    }


    before(function () {
        return runServer(TEST_DATABASE_URL);
    });


    beforeEach(function(){
        return seedUsersData();
    })

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