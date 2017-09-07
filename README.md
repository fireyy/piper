## Piper

<p align="center">
  <a href="https://piper-now.herokuapp.com" target="_blank">
    <img src="screen.png" width="700px">
    <br>
    Live Demo
  </a>
</p>

> A drag-and-drop mobile website builder base on Vue.

### Install

```shell
npm install
```

### Config

First of all，create a database `piper` in `PostgreSQL`, `MySQL`, `SQLite` or `MSSQL`.

```shell
# use MySQL
npm install mysql2

# use SQLite
npm install sqlite3

# use PostgreSQL
npm install pg pg-hstore
```

Then set up `.env` file with your:

- Database connection details
- Qiniu SDK config
- Github `CLIENT_ID` and `CLIENT_SECRET`

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

### Updating existing database

```shell
npm install sequelize-cli
npm run db:migrate
```

### Changelog

#### 1.0.5

- Login with Github base on [Passport.js](http://passportjs.org/).
- Use [Sequelize.js](http://docs.sequelizejs.com/) for Database dialects.
- Use [Axios](https://github.com/mzabriskie/axios) instead of vue-resource.
- fix issues.
