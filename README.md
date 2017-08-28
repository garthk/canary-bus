# Canary Bus

In [two minutes or less][2min], deploy an anonymous target for your [Thinkst Canarytokens][CTorg] that forwards to [Slack], [Honeycomb], or whatever else you have in mind.

[2min]: #two-minute-deployment-on-glitch
[CTorg]: https://canarytokens.org/generate
[Slack]: https://slack.com/
[Honeycomb]: https://honeycomb.io/
[Glitch]: https://glitch.com

## Two Minute Deployment on Glitch

[Glitch] runs your JavaScript for free as long as you don't mind anyone on the Internet being able to read your source code. It's not the best for the OPSEC if you're a black hat, but you're a white hat hacker just trying to prove your gym saw your request to cancel your membership.

* Start in the Glitch editor for [`canary-bus`][editme]

* Click **Remix this** just above the **Canary Bus** title

* Fill in `.env` with your [Environment Variables][envars]

* Click **Show Live** to visit your site, e.g. `https://wut.glitch.me`

* [Create a web hook Canarytoken][CTorg] aimed at `https://wut.glitch.me/SECRET`

* Test it

Note:

* [You don't need an account if you only need five days][restrictions] and can keep your browser cookies that long.

* Your `.env` needs `SECRET` and at least one `NOTIFY_*` to be useful.

* Your `.env` is the one file that Glitch *doesn't* let everybody read; do [let them know][fgsec] if you prove otherwise eh?

[editme]: https://glitch.com/edit/#!/canary-bus?path=README.md:1:0
[restrictions]: https://glitch.com/faq#restrictions
[envars]: #environment-variables
[fgsec]: http://www.fogcreek.com/security/

## Customisation

* To change the domain name on Glitch, click your project name in the upper left corner, then select and edit the name below it.

* To change the site's appearance for a thin veneer of respectability, edit `public/index.html`.

## Re-use

If you're sorted on catching web hooks, deployment, and a suitable masquerade, but want some quick and dirty notification code:

* At a prompt:

  `npm install --save @garthk/canary-bus`

* In your code:

  ```
  const bus = require('@garthk/canary-bus').auto();
  // get a payload from a canary token webhook
  bus.notify(payload);
  ```

The `notify` method returns a `Promise` for `null`. It'll wait for Slack, but not Honeycomb.

## Environment Variables

* The shortest useful environment in `.env` file format is:

  ```
  SECRET=SECRET
  NOTIFY_SLACK=https://hooks.slack.com/services/4615/nope/f3c3eeb919a8
  ```

* `SECRET` is mandatory, and gives the webhook path segment after `/` to which you'll send your Canarytoken alerts.

  All other envars are optional.

* `TMI` will, if `true`, expose this `README` file as the web server's index. By default, the web server's index will be whatever you put in `public/index.html`.

* `NOTIFY_SLACK` takes a Slack webhook URL.

* `NOTIFY_HONEYCOMB` takes a [Honeycomb] write key. Honeycomb is my favourite telemetry destination ever. Unlike your usual time series databases, Honeycomb is _utterly unfussed_ by high cardinality data, e.g. Canarytoken IDs, the IP addresses of the machines setting them off, user agents, whatevs.
