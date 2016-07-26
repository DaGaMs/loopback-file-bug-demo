'use strict';
process.env.NODE_ENV='testing';

var server = require('../server/server')
  , chai   = require('chai')
  , path   = require('path')
  , should = chai.should()
  , assert = chai.assert
  , async  = require('async')
  , _      = require('lodash')
  , boot   = require('loopback-boot');

var request, listener;

describe("file API", () => {
  // Set up
  before( (done) => {
    boot(server, path.resolve(__dirname, '../server'), (err, res) => {
      if (err)
        done(err);
      else {
        listener = server.start();
        request = require('supertest')('http://0.0.0.0:3000');
        request.json = function (verb, url) {
          return this[verb](url)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/);
        };
        done();
      }
    });
  });
  // Finally
  after( (done) => {
    listener.close(done);
  });
  
  describe("on GET", () => {
    it("should return an empty list", (done) => {
      request.get('/api/files')
      .expect(200)
      .end((err, res) => {
        res.should.have.property('body');
        var files = res.body;
        files.should.be.an.array;
        files.should.be.empty;
        done(err);
      });
    });
  });
  describe("on POST", () => {
    var thisDate;
    
    it("should create a new file", (done) => {
      thisDate = new Date();
      request.json('post', '/api/files')
      .send({created: thisDate, path: "/path/to/testfile.txt"})
      .expect(200)
      .end((err, res) => {
        console.log(res.body);
        done(err);
      });
    });
  });
});
