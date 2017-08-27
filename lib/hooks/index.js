const SlackHook = require('./slack');
const HoneycombHook = require('./honeycomb');

/** Generator yielding hooks configured via the process environment */
function *environmental(env) {
  env = env || process.env;
  
  if (process.env.SLACK_WEBHOOK_URL) {
    console.log('# Slack configured');
    yield new SlackHook(process.env.SLACK_WEBHOOK_URL);
  }
  
  if (process.env.HONEY_WRITE_KEY) {
    console.log('# Honeycomb configured');
    yield new HoneycombHook(process.env.HONEY_WRITE_KEY);
  }
};
//HONEY_WRITE_KEY
module.exports = {
  SlackHook,
  environmental,
};
