/**
 * @file mock
 * @author xiaozhihua
 * @date 2018-11-23 22:58:24
 */

const Koa = require('koa')
const Router = require('koa-router')

module.exports = (app, mock, port = 3000) => {
  const App = app || new Koa()
  const router = new Router()

  App.use(router.routes()).listen()
}