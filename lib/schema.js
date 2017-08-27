const joi = require('joi');

/** Schema for HTTPS URI */
const https_uri = joi.string().uri({ scheme: ['https'] });

/** Example report payload */
const EXAMPLE = {
  manage_url: 'https://example.com/nope',
  memo: "test event",
  additional_data: {
    src_ip: '8.8.8.8',
    useragent: 'curl/7.54.0',
    referer: null,
    location: null
    },
  "channel": "HTTP",
  "time": "2017-08-26 05:13:43"
};

/** Schema for report payload */
const payload = joi.object({
  manage_url: joi.string().uri({ scheme: ['http', 'https'] }),
  memo: joi.string(),
  additional_data: joi.object({
    src_ip: joi.string().ip(),
    useragent: joi.string(),
    referer: joi.string().allow(null),
    location: joi.string().allow(null),
  }),
  channel: joi.string(),
  time: joi.string(),
})
.unknown(false)
.example(EXAMPLE)
.description('canary webhook payload');

/** Schema for reporting hook */
const hook = joi.object({
  report: joi.func(),
})
.unknown(true)
.description('canary bus hook');

module.exports = {
  EXAMPLE,
  https_uri,
  payload,
  hook,
};
