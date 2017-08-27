const Libhoney = require('libhoney').default;
const joi = require('joi');
const uuid = require('uuid');
const url = require('url');
const os = require('os');

const MINUTE_MS = 60000;

/** A hook to report events via Honeycomb, an awesome telemetry service */
class HoneycombHook {
  constructor(writeKey, dataset) {
    writeKey = joi.attempt(writeKey, joi.string());
    dataset = joi.attempt(dataset, joi.string().default('canaries'));
    const hny = this.hny = new Libhoney({ writeKey, dataset });
    hny.addField('instance.hostname', os.hostname());
    hny.addField('instance.uuid', uuid.v4());
    this.chirp();
  }
  
  async report(payload) {
    const { manage_url, memo, additional_data, channel } = payload;
    const { token } = url.parse(manage_url, true).query;
    const { src_ip, useragent, referer, location } = additional_data;
    const datum = {
      token,
      memo,
      channel,
      src_ip,
      useragent,
      referer,
      location
    };
    console.error(datum);
    const event = this.hny.newEvent().add(datum);
    this.hny.sendEvent(event);
  }
  
  /** Indicte ongoing good health */
  chirp() {
    const event = this.hny.newEvent().add({
      alive: true,
    });
    this.hny.sendEvent(event);
    setTimeout(() => this.chirp(), MINUTE_MS);
  }
}

module.exports = HoneycombHook;
