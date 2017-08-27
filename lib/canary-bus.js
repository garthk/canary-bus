const joi = require('joi');
const schema = require('./schema');

/** A collection of canary reporting hooks */
class CanaryBus {
  constructor() {
    this.hooks = [];
  }
  
  /** Add a hook i.e. class with `.report` */
  add(hook) {
    hook = joi.attempt(hook, schema.hook);
    this.hooks.push(hook);
  }
  
  /** Report an event via the hooks */
  async report(payload) {
    payload = joi.attempt(payload, schema.payload);
    for (let hook of this.hooks) {
      await hook.report(payload);
    }
  }
}

module.exports = CanaryBus;
