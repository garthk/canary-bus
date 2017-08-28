const SlackHook = require('./slack');
const HoneycombHook = require('./honeycomb');

/** Generator yielding hooks configured via the process environment */
function *environmental(env) {
  env = env || process.env;

  if (process.env.NOTIFY_SLACK) {
    console.log('# Slack configured');
    yield new SlackHook(process.env.NOTIFY_SLACK);
  }

  if (process.env.NOTIFY_HONEYCOMB) {
    console.log('# Honeycomb configured');
    yield new HoneycombHook(process.env.NOTIFY_HONEYCOMB);
  }
};
//HONEY_WRITE_KEY
module.exports = {
  SlackHook,
  environmental,
};
