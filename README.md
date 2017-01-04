# piper

### Install

```shell
npm install
```

### Phantomjs

**因为公司网络的问题，安装 `prerender-spa-plugin` 插件的依赖 `phantomjs` 可能会报错，可以自己下载 [phantomjs](http://phantomjs.org/download.html) 安装**

### Run

开始开发之前，请确认安装了 `Mysql` 服务，并创建名为 `piper` 的数据库

项目的 `Mysql` 配置位于 `./server/config.js`，可供修改

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

### TODO

- [x] api server
- [x] preview mode
- [x] swipe auto get image height
- [x] publish html
- [x] prerender? => [prerender](https://github.com/chrisvfritz/prerender-spa-plugin)
- [x] 编辑器页面判断是否有数据变更
- [x] 图片上传
- [x] css 导出成文件？
- [x] 倒计时组件
- [x] 操作日志
- [x] 页面发布到CDN
- [x] webpack code split lazy load
- [x] 增加活动的一些全局属性，比如背景图，分享信息等
- [x] property 拆分的更细
- [ ] property 数据校验
- [ ] modules 数据更新的方式（目前的不对）
- [x] 添加 布局 组件，实现布局内的子元素可相对定位
- [x] 数据分页
- [x] 保存发布的时候对页面进行截图当作封面
- [ ] 用户系统／权限？接入CTX
- [ ] 更多的 modules 组件
- [ ] 更多的 property 组件
- [ ] ...

### Issues

- [x] store cache error
- [x] hot reload not work
- [x] 编辑器页面和预览页面的 rem 显示 bug
- [x] px2rem bugfix
- [x] 拖拽模块导致数据还原
- [x] webpack performance warning
- [ ] publish 后 css 重复的bug
- [ ] src 代码自动编译可能会导致 nodemoon watchr 报错
