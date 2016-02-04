var expect = require('chai').expect;
var mock = require('./');

// not sure the best way to test for a Proxy, since it's completely transparent...
describe('mock-css-modules', function() {
  it('should handle CSS requires', function() {
    var test = require('./test/test.css');
    expect(test).to.be.an('object');
    expect(test.monkey).to.equal('monkey');
  });

  it('should allow me to register a single file extension', function() {
    mock.register('.sass');

    var test = require('./test/test.sass');
    expect(test).to.be.an('object');
    expect(test.bagel).to.equal('bagel');
  });

  it('should allow me to register multiple file extensions', function() {
    mock.register(['.scss', '.stylesheet']);

    var test = require('./test/test.stylesheet');
    expect(test).to.be.an('object');
    expect(test.bob).to.equal('bob');
  });

  it('should not confuse babel', function() {
    var test = require('./test/test.css');
    expect(test.__esModule).to.be.false;
  });
});

