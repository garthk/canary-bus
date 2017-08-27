# Canary Bus
 
Runs an Express app to forward your [Thinkst Canarytoken][CTorg] notification webooks to [Slack], [Honeycomb], and — as time goes on — anything else that seems to make sense at the time. Optimised for rapid deployment so you can get back to scattering canaries everywhere.

[CTorg]: https://canarytokens.org/generate
[Slack]: https://slack.com/
[Honeycomb]: https://honeycomb.io/
[Glitch]: https://glitch.com

# Environment Variables

Example environment in `.env` file format:

    SECRET=SECRET
    TMI=true
    SLACK_WEBHOOK_URL=https://hooks.slack.com/services/4615/nope/f3c3eeb919a8
    HONEY_WRITE_KEY=4615b42fnopenopenopef3c3eeb

`SECRET` is mandatory, and gives the webhook path segment after `/` to which you'll send your Canarytoken alerts.

`TMI` will, if `true`, expose this `README` file as the web server's index. That's great for trying this out on [Glitch], but otherwise perhaps a poor life choice. If `TMI` is absent, empty, or `false`, the web server's index will be whatever you put in `public/index.html`.

`SLACK_WEBHOOK_URL` is a Slack webhook URL. You know what to do.

`HONEY_WRITE_KEY` is for [Honeycomb], my favourite telemetry destination ever. Unlike your usual time series databases, Honeycomb is utterly unfussed by high cardinality data. Like, say, your Canarytoken IDs, or the IP addresses of the machines setting them off.

# Deployment Options

In general:

* Set up a few environment variables, _especially_ `SECRET`
* Find a way to aim web requests at some JavaScript
  (yeah, eww, get over it, it's for the portability)
* [Create a web hook Canarytoken][CTorg] aimed at `https://wut.example.com/SECRET`
* Test your Canarytoken

More specifically...

## Deployment on Glitch

[Glitch] runs your JavaScript for free as long as you don't mind anyone on the Internet being able to read your source code. It's not the best for the privacy, but arguably adequate if you're just trying to prove your gym saw your request to cancel your membership.

* Visit [`canary-bus.glitch.me`](https://canary-bus.glitch.me/)
* "Remix this", registering an account on the fly
* Fill in `.env` with your [Environment Variables](#environment-variables)
* Fill in `public/index.html` with something suitably obscure
