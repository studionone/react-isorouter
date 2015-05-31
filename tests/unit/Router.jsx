var mocha = require('mocha'),
    chai = require('chai'),
    sinon = require('sinon'),
    rewire = require('rewire');

var expect = chai.expect;

describe('lib/Router', function() {
    before(function() {
        this.sandbox = sinon.sandbox.create();
    });

    after(function() {
        this.sandbox.restore();
    });

    it('should initialise correctly', function() {
        expect(false).to.equal(true);
    });
});
