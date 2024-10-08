# Shared storage demo

This demo shows some [Shared Storage API](https://developer.chrome.com/docs/privacy-sandbox/shared-storage/) use cases.

The following use-cases have been added:

- Creative selection by frequency
- A/B testing
- Creative rotation
- Known customer

## Live demo

Visit [https://shared-storage-demo.web.app](https://shared-storage-demo.web.app) to see the demo.

## Local development

### Setup HTTPS

The ad rendered in a fenced frame must be served from an HTTPS origin. However the Firebase emulator [does not support HTTPS localhost](https://github.com/firebase/firebase-tools/issues/1908). Therefore, we will use `nginx` to setp up a reverse proxy.

We need to setup nginx to respond to port 4437 that proxies content from port 3007.

#### Generate the certs with `mkcert`

1. Install `mkcert` by following the [instructions for your operating system](https://github.com/FiloSottile/mkcert#installation).
1. Run `mkcert -install`.
1. Create a folder to store the certificates in. In this example, we will use `mkdir ~/certs`.
1. Navigate to the certificate folder: `cd ~/certs`.
1. Run `mkcert localhost`.

> For an in-depth explanation of this section, see the ["How to use HTTPS for local development"](https://web.dev/how-to-use-local-https/) article.

#### Setup reverse proxy with [nginx](https://www.nginx.com/)

1. Install `nginx` ([Mac](https://www.google.com/search?q=install+nginx+mac), [Linux](https://www.google.com/search?q=install+nginx+linux), [Windows](https://www.google.com/search?q=install+nginx+windows)).
1. Find the `nginx` configuration file location based on your operating system (If you used `homebrew` on Mac, it is under `/Users/[USER-NAME]/homebrew/etc/nginx/nginx.conf`).
1. Add the 4437 `server` block into the `http` block in the config. Replace `[USER-NAME]` with the path that your certificate is stored in:

```nginx
http {
  # HTTPS server
  server {
    listen  4437 ssl;
    ssl_certificate  /Users/[USER-NAME]/certs/localhost.pem;
    ssl_certificate_key /Users/[USER-NAME]/certs/localhost-key.pem;

    location / {
      proxy_set_header        Host $host;
      proxy_set_header        X-Real-IP $remote_addr;
      proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header        X-Forwarded-Proto $scheme;

      proxy_pass          http://localhost:3007/;
      proxy_read_timeout  90;
    }
  }
}
```

4. Stop the `nginx` server with `nginx -s stop`
5. Restart the `nginx` server with `nginx`

The above `nginx` configuration proxies `https://localhost:4437` to `http://localhost:3007` (Content producer server).

### Setup Firebase

- Setup [Firebase tools](https://github.com/firebase/firebase-tools)

### Setup repository

- `git clone https://github.com/googlechromelabs/shared-storage-demo`
- `cd shared-storage-demo`
- `npm install`

### Start emulator

```bash
npm run dev
```

### Shared storage

To run this demo, enable the experiment flag **chrome://flags/#privacy-sandbox-enrollment-overrides**.

Then, [open Google Chrome from the command line](https://www.chromium.org/developers/how-tos/run-chromium-with-flags/) with the additional flags below to disable the need for attestations when running locally.

```
--enable-privacy-sandbox-ads-apis --disable-features=EnforcePrivacySandboxAttestations
```

And visit `http://localhost:3000` for the main page

### Deploy code

```
npm run deploy
```
