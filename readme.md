**What's this?**

This is a short repo that does two things:

- Splits the daily data feed from Johns Hopkins University (CSSE) country-wise and also computes daily new cases in each type (type = confirmed | recovered | deaths)
- Shows that data in a really simple UI

**To run**

There are three parts:

- clone CSSE repo as `/data`
- host the data on a server (`/api`)
- build/run or serve the frontend (`/ui`)

**1. Clone CSSE repo as `/data`**

- In this repo's root folder: `git clone https://github.com/CSSEGISandData/COVID-19.git data`

**2. Host data on server**

- From repo's root folder: `cd api`
- Then, assuming you have Typescript installed globally, `tsc -b`
- And then, `cd dist && node index.js` <-- this will generate the JSON files required to serve country-wise data.
- Finally, get to `/api` and then host it somewhere.

Note: for a local server, you can just do `npx http-server --cors=http://localhost:3000` inside `/api`.

The `--cors` value should be any frontend URL that needs to access your local server. In this example, a React frontend (typically served at port 3000).

**3. Build/run OR serve the frontend**

- From repo's root folder: `cd ui`
- Then, `yarn` to install all deps
- Finally, `yarn serve` to serve. Or `yarn build` to build files in `dist` and then just host them somewhere.

Note: Before you build, make sure you change the API_URL in `ui/src/App.tsx`.
