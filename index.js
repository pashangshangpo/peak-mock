/**
 * @file mock
 * @author xiaozhihua
 * @date 2018-11-23 22:58:24
 */

const Koa = require('koa')
const Router = require('koa-router')

const ParseMock = mock => {
  const Result = []

  for (let key of Object.keys(mock)) {
    let [type, path] = key.split(' ')

    if (path == null) {
      path = type
      type = 'all'
    }

    Result.push({
      type: type.toLowerCase(),
      path: path,
      data: mock[key]
    })
  }

  return Result
}

module.exports = (app, mock = {}, port = 3000) => {
  const App = app || new Koa()
  const router = new Router()

  mock = ParseMock(mock)

  for (let item of mock) {
    router[item.type](item.path, cxt => {
      cxt.body = item.data()
    })
  }

  App.use(router.routes()).listen(port)
}