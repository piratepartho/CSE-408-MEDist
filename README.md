## Install the project

```bash
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
```

- if `Error: listen EADDRINUSE: address already in use :::3000` occures, run the following command

```bash
npx kill-port 3000
```
- then run the project again