## Install the project

```bash
cd Medicine_Service
npm i
```

## Run the project

> in Production

```bash
npm start
```
> in Development

```bash
nodemon
npm run dev # nodemon did not work for me - partho
```

- if `Error: listen EADDRINUSE: address already in use :::3000` occures, run the following command

```bash
npx kill-port 3000
```
- then run the project again