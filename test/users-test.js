const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require('mongoose');
const should = require("chai").should();
const faker = require('faker');
const { app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL } = require('../config'); // importing DB
const { User } = require('../models/user')
const expect = chai.expect;
chai.use(chaiHttp);


describe('Users test API', function () {
    // sead db with the uses info 
    function seedUsersData() {
        const seedData = [];
        for (let i = 1; i <= 10; i++) {
            seedData.push({
                user: {
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),

                },
                email: faker.internet.email(),
                userName: faker.internet.userName()
            });
        }
        console.log(seedData);
        return User.insertMany(seedData)


    }


    before(function () {
        return runServer(TEST_DATABASE_URL);
    });


    beforeEach(function () {
        return seedUsersData();
    })

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });


    /// tear down DB working 
    function tearDownDb() {
        return new Promise((resolve, reject) => {
            console.warn('Deleting database');
            mongoose.connection.dropDatabase()
                .then(result => resolve(result))
                .catch(err => reject(err));
        });
    }



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

    it('Should return the number of users', function () {

        return chai
            .request(app)
            .get("/users")
            .then(_res => {
                res = _res;
                res.status.should.equal(200);
                res.body.should.have.lengthOf.at.least(1);
                return User.count();

            }).then(count => {
                expect(res.body).have.lengthOf(count);

            })
            .catch(function (err) {
                console.log("err")
            })


    })  // Closing Number of users test;

    it("Should check users with right keys", function () {

        let resUser;
        return chai.request(app)
            .get('/users')
            .then(res => {
                res.status.should.equal(200)
                res.should.be.json;
              //   res.body.should.be.a('array');
               //  res.body.should.have.lengthOf.at.least(1);

                // res.body.forEach(function (user) {
                //     user.should.be.a('object');
                //     user.should.include.keys('name', 'userName', 'email');
                //     // console.log(res.body[0]);


                // });
            })

    });


})  // Closig user testing 