const CanaryBus = require('./canary-bus');
const hooks = require('./hooks');

/** Automatically configure and return a CanaryBus */
function auto(env) {
  env = env || process.env;
  const bus = new CanaryBus();
  for (let hook of hooks.environmental()) {
    bus.add(hook);
  }
  return bus;
}

module.exports = {
  CanaryBus,
  auto
}