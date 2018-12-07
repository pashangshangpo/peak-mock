# 简介

mock 服务

## 使用示例

```
const Mock = require('peak-mock')

Mock(
  null, // 默认 new Koa()
  Mock.GetMockData('./mock'), // mock的数据
  3001
)
```

./mock/index.js

```
module.exports = {
  '/api/list': ctx => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: {
            list: [1, 2, 3]
          },
          code: 200
        })
      }, 3000)
    })
  },
  'get /api/a/:b': ctx => {
    return {
      data: {
        a: 1,
        params: ctx.params.b
      },
      code: 200
    }
  },
  'get /test/:login': ctx => {
    let login = ctx.params.login

    if (login === 'true') {
      return {
        data: {
          user: '张三'
        },
        code: 200
      }
    }

    return {
      data: {},
      code: 401,
      msg: '未登录'
    }
  }
}
```