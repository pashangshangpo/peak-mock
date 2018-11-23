/**
 * @file mock
 * @author xiaozhihua
 * @date 2018-11-23 22:58:24
 */

const Koa = require('koa')
const Router = require('koa-router')

const App = new Koa()

App.use((new Router()).routes)