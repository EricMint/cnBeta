'use strict';

const co = require('../lib/co');
const regeneratorRuntime = require('../lib/runtime');
const slice = Array.prototype.slice;

function compose(middleware) {
  return function* callmiddlewares() {
    let next = function * noop() {
    };

    let i = middleware.length;

    while (i--) {
      const args = slice.call(arguments);
      args.splice(0, 0, next);
      next = middleware[i].apply(this, args);
    }

    return yield* next;
  };
}

// function* noop() {}

function Application() {
  this.middleware = [];
}

const app = Application.prototype;

app.use = function (fn) {
  if (!(fn && 'GeneratorFunction' == fn.constructor.name))
    throw new Error('app.use() requires a generator function');

  this.middleware.push(fn);
  return this;
};

app.handler = function (handlerfn) {
  if (!(handlerfn && 'GeneratorFunction' == handlerfn.constructor.name))
    throw new Error('handler function must be a generator function');

  const middlewares = this.middleware.slice();
  middlewares.push(handlerfn);
  const fn = co.wrap(compose(middlewares));
  const self = this;

  return function () {
    const args = slice.call(arguments);
    const lastArg = args[args.length - 1];
    let callback;
    if (lastArg && 'Function' == lastArg.constructor.name) {
      callback = lastArg;
    }
    fn.apply(this, args).then(() => {
      if (callback) {
        callback(null, 'done');
      }
    }).catch((err) => {
      if (callback) {
        callback(err);
      }
    });
  }
};

module.exports = new Application();
