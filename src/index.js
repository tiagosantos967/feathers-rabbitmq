const unhandledRejection = require('unhandled-rejection');
const debug = require('debug');
const map = require('lodash.map');
const requireDir = require('require-dir');
const events = requireDir('./events');
const publisher = require('./publisher');

const rejectionEmitter = unhandledRejection();
rejectionEmitter.on('unhandledRejection', debug('amqp:error'));

const defaultOptions = {
  original: false
};

module.exports = (userOptions) => async function () {
  const app = this;
  const opt = { ...defaultOptions, ...userOptions };
  const publish = await publisher(opt.amqp);

  map(app.services, (service) => {
    map(service._serviceEvents, (eventName) => {
      const event = events[eventName];
      if (event) event(service, publish, opt);
    });
  });
};

