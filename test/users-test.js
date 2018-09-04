const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require('mongoose');
const should = require("chai").should();
const faker = require('faker');
const { app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL } = require('../config'); // importing DB
const User = require('../models/user')
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
        //  console.log(seedData);
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
                res.body.should.be.a('array');
                res.body.should.have.lengthOf.at.least(1);

                res.body.forEach(function (user) {
                    user.should.be.a('object');
                    user.should.include.keys('name', 'userName', 'email');
                });

                resUser = res.body[0];
                console.log("ID OF RETERNED OBJECT", resUser.id);
                //  console.log(resUser)   /// name: undefined undefined... not geting assigned
                return User.findById(resUser.id);

            })
            .then(user => {  /// user is null/ empty object 
                //console.log(user);
                resUser.name.should.equal(user.name);
                resUser.userName.should.equal(user.userName);
                resUser.email.should.equal(user.email);

            });

    });  // End test check for right keys.


    describe('POST endpoint', function () {

        it('should add a new user', function () {

            const newUser = {

                user: {
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                },
                userName: faker.internet.userName(),
                email: faker.internet.email()
            };
            // console.log(newUser);
            return chai.request(app)
                .post('/users')
                .send(newUser)
                .then(function (res) {
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.include.keys('id', 'name', 'userName', 'email');
                    res.body.name.should.equal(`${newUser.user.firstName} ${newUser.user.lastName}`);
                    res.body.id.should.not.be.null;
                    //     res.body.user.should.equal(
                    //         `${newUser.user.firstName} ${newUser.user.lastName}`);
                    res.body.userName.should.equal(newUser.userName);
                    res.body.email.should.equal(newUser.email);
                    return User.findById(res.body.id);
                })
                .then(function (user) {
                   // console.log(user)
                    newUser.user.firstName.should.equal(user.user.firstName);
                    newUser.user.lastName.should.equal(user.user.lastName);
                    newUser.userName.should.equal(user.userName);
                    newUser.email.should.equal(user.email);
                });
        });
    }); // End post user test


    describe('DELETE  endpoint', function () {

        it('Delete end point by ID', function () {
            let user;
            return User
                .findOne()
                .then(function (_user) {
                    user = _user;
                    return chai.request(app).delete(`/users/${user.id}`);
                })
                .then(function (res) {
                    expect(res).to.have.status(204);
                    return User.findById(user.id);
                })
                .then(function (_user) {
                    expect(_user).to.be.null;   //// should not exist

                });

        });
    });


    describe('PUT user end point', function () {
        it('Updating user info by ID', function () {



            const updateUserData = {

                user: {
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                },
                userName: faker.internet.userName(),
                email: faker.internet.email()
            };

            return User
                .findOne()
                .then(user => {
                    updateUserData.id = user.id;

                    return chai.request(app)
                        .put(`/users/${user.id}`)
                        .send(updateUserData);
                })
                .then(res => {
                    res.should.have.status(204);
                    return User.findById(updateUserData.id);
                })
                .then(user => {
                    updateUserData.user.firstName.should.equal(user.user.firstName);
                    updateUserData.user.lastName.should.equal(user.user.lastName);
                    updateUserData.userName.should.equal(user.userName);
                    updateUserData.email.should.equal(user.email);
                });


        });


    });



})  // Closig user testing 