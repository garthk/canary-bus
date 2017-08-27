const util = require('util');
const slack = require('@slack/client');
const joi = require('joi');
const schema = require('../schema');

/** A hook to report events via Slack */
class SlackHook {
  constructor(webhook_url) {
    webhook_url = joi.attempt(webhook_url, schema.https_uri);
    const webhook = new slack.IncomingWebhook(webhook_url);
    this.send = util.promisify(webhook.send).bind(webhook);
  }
  
  async report(payload) {
    const { manage_url, memo, additional_data, channel } = payload;
    const { src_ip, useragent, referer, location } = additional_data;
    const att = {
      fallback: `${src_ip} tripped ${channel} (<${manage_url}|manage hook>)`,
      pretext: `${src_ip} knock over ${channel}`,
      text: memo,
      author_name: 'A little birdy',
      author_link: manage_url,
      fields: [{
        title: 'useragent',
        value: useragent,
        short: false
       }, {
        title: 'referer',
        value: referer,
        short: false
       }, {
        title: 'location',
        value: location,
        short: false
       }],
    };
    att.fields = att.fields.filter(f => f.value !== null);
    await this.send({ attachments: [ att ] });
  }
}

module.exports = SlackHook;
