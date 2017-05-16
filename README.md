# piper

<p align="center">
  <img src="screen.png" width="700px">
</p>

> A drag-and-drop mobile website builder base on Vue.

### Install

```shell
npm install
```

### Config

First of all，create a database `piper` in `Mysql`, and import `./server/schemes.sql`.

Then set up `.env` file with your `Mysql` database connection details and qiniu upload config.

```shell
cp env.sample .env
```

### Develop

```shell
npm run dev
```

### A message about px to rem

```css
// `px` is converted to `rem`
.convert {
    font-size: 16px; // converted to 1rem
}

// `Px` or `PX` is ignored by `postcss-pxtorem` but still accepted by browsers
.ignore {
    border: 1Px solid; // ignored
    border-width: 2PX; // ignored
}
```
