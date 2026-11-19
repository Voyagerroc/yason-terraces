# Contributing

This showcase is a self-contained `index.html` bundle. Open it in a browser
as documented in the README, then run the source integrity checks with
Node.js 24:

```sh
node test/verify_integrity.mjs
```

For container changes, also build/run the Docker image and check the actual
HTTP response. The CI container job and GitHub Pages publication have
different hosting boundaries; passing a source check is not a live audit.

Keep a PR focused. Describe the resulting behavior and commands actually
run. For visual changes, attach a real desktop/mobile screenshot and note
keyboard/reduced-motion checks or untested cases. Screenshots represent
the software presentation, not proof of a built property.

Do not commit personal enquiry/booking records, credentials or private
provider configuration. Report vulnerabilities through [SECURITY.md](SECURITY.md).
Deployment and factual/legal claims require their own verification.

The CI Docker smoke job polls the loopback endpoint at most 30 times, with a one-second request timeout and one-second delay (up to about 60 seconds). It prints container logs/state on failure and removes the container on every exit path after startup. This checks the actual built image, not a production host.
