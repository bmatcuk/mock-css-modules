require('harmony-reflect');

function handler(module, filename) {
  module.exports = new Proxy({}, {
    get: function(target, property, receiver) {
      // Without this, __esModule will return "__esModule" which will confuse
      // babel into thinking this module was built with ES6 exports since it's
      // "truthy". So, in this one special case, we return a value (false).
      if (property === '__esModule') return false;
      return property;
    }
  });
};

function registerHandlers(extensions) {
  if (extensions.constructor !== Array)
    extensions = [extensions];
  extensions.forEach(function(ext) {
    require.extensions[ext] = handler;
  });
}

registerHandlers('.css');
module.exports = {
  register: registerHandlers
};

