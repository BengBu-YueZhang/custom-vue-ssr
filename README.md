## 💡项目说明

本项目是基于[vue-hackernews-2.0](https://github.com/vuejs/vue-hackernews-2.0)基础上的自定义修改。将webpack升级到了4.x版本。并提供了Koa2版本的服务端版本。

- [express + webpack4](https://github.com/BengBu-YueZhang/custom-vue-ssr)
- [koa2 + webpack4](https://github.com/BengBu-YueZhang/custom-vue-ssr/tree/koa)

## 🚀开始

```shell

# 本地开发
# 1. 构建ServerBundle以及ClientBundle
npm run build:dev
# 2. 本地开发
npm run dev

# 生产环境使用
# 1. 构建ServerBundle以及ClientBundle
npm run build:prod
# 2. 本地预览
npm run start
# 3. 线上启动
npm run line
```

## 💻预览

![QQ20190818-204910@2x.png](https://i.loli.net/2019/08/18/7Q3khjbH2CfN5ps.png)

![QQ20190818-204925@2x.png](https://i.loli.net/2019/08/18/xPN7BAkpVe96KJy.png)

## 🧭参考

[vue ssr指南](https://ssr.vuejs.org/zh/guide/bundle-renderer.html#%E4%BD%BF%E7%94%A8%E5%9F%BA%E6%9C%AC-ssr-%E7%9A%84%E9%97%AE%E9%A2%98)
[vue-hackernews-2.0](https://github.com/vuejs/vue-hackernews-2.0/blob/master/package.json)