//Tests fro users

const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require('mongoose');
const should = require("chai").should();
const faker = require('faker');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL } = require('../config'); // importing DB
const User = require('../models/user')
const expect = chai.expect;
chai.use(chaiHttp);
let token = "";

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
                userName: faker.internet.userName(),
            });
        }

        let authUser = {
            user: {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),

            },
            userName: faker.internet.userName(),
            email: "alex@yahoo.com",
            password: bcrypt.hashSync("password", 10),
        }
        seedData.push(authUser);
        return User.insertMany(seedData)


    }

    const userCredentials = {
        email: 'alex@yahoo.com',
        password: 'password'
    }

    before(function () {
        runServer(TEST_DATABASE_URL);
        return chai
            .request(app)
            .post('/login')
            .send(userCredentials)
            .end(function (err, response) {
                expect(response.statusCode).to.equal(200);
                token = response.token;
                done();
            });
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
                .post("/login")
                .then(function (res) {

                })
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
                //  console.log(resUser)  
                return User.findById(resUser.id);

            })
            .then(user => {  
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
    }); // delete 


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


    });  // put



    describe('POST signup endpoint', function () {

        it('should add a new user', function () {

            const newUser = {

                user: {
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                },
                userName: faker.internet.userName(),
                email: faker.internet.email(),
                password: faker.internet.password()
            };
            //   console.log("NewUse result",newUser);
            return chai.request(app)
                .post('/users/signup')
                .send(newUser)
                .then(function (res) {
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    // console.log(res.body);
                    res.body.should.include.keys('id', 'name', 'userName', 'email');
                    res.body.name.should.equal(`${newUser.user.firstName} ${newUser.user.lastName}`);
                    res.body.id.should.not.be.null;
                    //res.body.password.should.equal(newUser.password);
                    res.body.userName.should.equal(newUser.userName);
                    res.body.email.should.equal(newUser.email);
                    return User.findById(res.body.id);
                })
                .then(function (user) {
                    //   //     console.log("user result",user)
                    newUser.user.firstName.should.equal(user.user.firstName);
                    newUser.user.lastName.should.equal(user.user.lastName);
                    newUser.userName.should.equal(user.userName);
                    newUser.email.should.equal(user.email);
                    // newUser.password.should.equal(user.password);  ??? problem to use faker and hash for pass word
                });
        });
    }); // End post user sign up test


  /// future addition
    // describe('POST login endpoint', function () {

    //     it('Should login user', function () {
    //         let hash = bcrypt.hashSync('password', 10);
    //         const loginUser = {
    //             email: "alex@yahoo.com",
    //             password: bcrypt.compareSync('password' , hash),/// wont match to bcrypt hash
    //         };
    //         return chai.request(app)
    //             .post('/users/login')
    //             .send(loginUser)
    //             .then(function (res) {
    //                 res.should.have.status(200);
    //                 res.should.be.json;
    //                 res.should.be.a('Object');
    //                 res.body.should.include.keys('email', 'password');
    //                 // res.body.id.should.not.be.null;
    //                 // res.body.email.should.equal(loginUser.email);
    //                 // res.body.password.should.equal(loginUser.password);
    //                 return User.findById(res.body.id);
    //             })
    //             .then(function (user) {

    //                 loginUser.email.should.equal(user.email);
    //                 loginUser.password.should.equal(user.password);
    //             });
    //     })
    // })

})  // Closig user testing 