import axios from 'axios'

export default {
  page: {
    getData(id) {
      return axios
        .get('page/'+id)
    },
    updateData(id, data) {
      return axios
        .put('page/'+id, data)
    },
    /**
     * 保存 design
     * @returns {*}
     */
    saveData(data) {
      return axios
        .put('pages', data)
    },
    removeData(id) {
      return axios
        .delete('page/'+id)
    }
  },
  pages: {
    getData(data) {
      return axios
        .get('pages', {
          params: data
        })
    }
  },
  users: {
    getData() {
      return axios
        .get('users')
    }
  },
  changelog: {
    /**
     * 获取所有 changelog
     * @returns {*}
     */
    getAll(params) {
      return axios
        .get('changelogs', {
          params: params
        })
    },
    /**
     * 获取最新的 changelog
     * @returns {*}
     */
    getRecent() {
      return axios
        .get('changelogs', {
          params: {
            size: 5,
            page: 1
          }
        })
    }
  },
  /**
   * 发布项目
   * @returns {Promise}
   */
  publish(id, data) {
    return axios
        .put('publish/'+id, data)
  },
  /**
   * 获取 制作中和已发布 的项目
   * @returns {Promise}
   */
  count() {
    return axios
        .get('count')
  },
  /**
   * 注销
   * @returns {Promise}
   */
  logout() {
    return axios
        .get('logout')
  }
}
