const __ = require("../constants");
const models = require("../models");

module.exports = class {
  constructor() {
    this.url = '/page/:id';
  }

  async delete(ctx) {
    let { id } = ctx.params;

    await models.pages.update(
      {
        is_delete: 1
      },
      {
        where: {
          id: id
        }
      }
    );

    await models.changelog.create({
      action: 3,
      page_id: id,
      items: null,
      create_by: ctx.state.user.id
    });

    ctx.body = {
      message: "Delete success"
    };
  }

  async get(ctx) {
    let { id } = ctx.params;

    let result = await models.pages.findAll(
      {
        where: {
          is_delete: 0,
          id: id
        }
      }
    );

    let page = result[0];
    if (!page)
      throw {
        status: 404,
        name: "PAGES_NOT_FOUND",
        message: "page is not found"
      };

    try {
      if (page.items) page.items = JSON.parse(page.items);
      if (page.config) page.config = JSON.parse(page.config);
    } catch (error) {
      throw {
        status: 500,
        name: "JSON_PARSE_ERROR",
        message: "json parse error"
      };
    }

    ctx.body = page;
  }

  async put(ctx) {
    let { id } = ctx.params;
    let { body } = ctx.request;
    let change = Object.create(null);
    let count = ["title", "config", "items"].reduce((count, name) => {
      if (!(name in body)) return count;
      change[name] = body[name];
      return count + 1;
    }, 0);

    if (count === 0)
      throw {
        status: 400,
        name: "ERR",
        message: "require `title` or/and `items` in request body"
      };

    change.title = change.title.trim();

    if (!change.title)
      throw { status: 400, name: "ERROR_PARAMS", message: "Title 不能为空" };

    if ("items" in change) {
      change.items = JSON.stringify(change.items);
      if (change.items.length > __.VALUE_MAX_LENGTH) throw __.VALUE_TOO_LONG;
    }
    if ("config" in change) {
      change.config = JSON.stringify(change.config);
    }

    let [page] = await models.pages.findAll({
      attributes: ['is_delete', 'items'],
      where: {
        id: id
      }
    })

    if (!page || page.is_delete)
        throw {
          status: 404,
          name: "PAGE_NOT_FOUND",
          message: "page is not found"
        };

    await models.pages.update(
      change,
      {
        where: {
          id: id
        }
      }
    );

    let changed = ["title", "config", "items"].reduce((changed, name) => {
      return page[name] !== change[name] ? changed + 1 : changed;
    }, 0);
    if (changed > 0) {
      await models.changelog.create({
        action: 2,
        page_id: id,
        items: change.items,
        create_by: ctx.state.user.id
      });
    }

    ctx.body = {
      message: "Save success"
    };
  }
};
