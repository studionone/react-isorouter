var mocha = require('mocha'),
    chai = require('chai'),
    expect = require('chai').expect,
    sinon = require('sinon'),
    rewire = require('rewire'),
    jsdom = require('mocha-jsdom'),
    testTree = require('react-test-tree'),
    React = require('react'),
    ReactAddons = require('react/addons'),
    ReactTestUtils = require('react/addons').TestUtils;

var RouterError = require('../../lib/RouterError.js');

describe('lib/Router', function() {
    var Router = rewire('../../lib/Router.js');
    var MockRoute = React.createClass({
        render: function() {
            return <div>Some fake route</div>
        }
    });

    // init jsdom
    jsdom();

    before(function() {
        this.sandbox = sinon.sandbox.create();
        this.commonHistory = this.sandbox.stub();

        this.restore = Router.__set__('_commonHistory', this.commonHistory);
    });

    after(function() {
        this.restore();
        this.sandbox.restore();
    });

    it('should throw an error if no routes are defined', function() {
        try {
            var component = testTree(<Router />);
        } catch (e) {
            expect(e).to.have.ownProperty('message');
            expect(e.message).to.equal('You must pass at least one Route to a Router');
        }
    });

    it('should throw an error if path prop is not passed in when rendering on the server', function() {
        try {
            var component = testTree(
                <Router matcher={function(url) { return 'mock'; }}>
                    <MockRoute />
                    <MockRoute />
                </Router>
            );
        } catch(e) {
            expect(e).to.have.ownProperty('message');
            expect(e.message).to.equal('No matching child with routeName `mock`');
        }
    });
});
