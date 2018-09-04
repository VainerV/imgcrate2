const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require('mongoose');
const should = require("chai").should();
const faker = require('faker');
const { app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL } = require('../config'); // importing DB
const CommentPost = require('../models/commentpost')
const expect = chai.expect;
chai.use(chaiHttp);


describe('Comments test API', function () {


    // sead db with the comment post
    function seedUsersData() {
        const seedData = [];
        for (let i = 1; i <= 10; i++) {
            seedData.push({
                comment: faker.lorem.paragraph(),

            });
        }
        // console.log(seedData);
        return CommentPost.insertMany(seedData)


    }  // seed data

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
        it('Return status code 200 and and array of comments', function () {
            return chai
                .request(app)
                .get("/comments")
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

    it('Should return the number of comments', function () {

        return chai
            .request(app)
            .get("/comments")
            .then(_res => {
                res = _res;
                //console.log("Vdim checking status", res.satus);
                res.status.should.equal(200);
                res.body.should.have.lengthOf.at.least(1);
                return CommentPost.count();

            }).then(count => {
                expect(res.body).have.lengthOf(count);

            })
            .catch(function (err) {
                console.log("err")
            })


    })  // Closing Number of users test;

    it("Should check comment with right keys", function () {

        let resComment;
        return chai.request(app)
            .get("/comments")
            .then(res => {
                
                res.status.should.equal(200)
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.lengthOf.at.least(1);
                console.log("Vadim checking status", res.body); 
                res.body.forEach(function (comment) {
                    comment.should.be.a('object');
                    comment.should.include.keys("id", 'comment');
                });

                resComment = res.body[0];
                console.log("ID OF RETERNED OBJECT", resComment.id);
                //  console.log(resComment)   
                return CommentPost.findById(resComment.id);

            })
            .then(comment => {

                resComment.comment.should.equal(comment.comment);


            });

    });  // End test check for right keys.







}) // Comments API test