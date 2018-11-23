/**
 * @file mock
 * @author xiaozhihua
 * @date 2018-11-23 22:58:24
 */

const Fs = require('fs')
const Path = require('path')
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

const MockData = (router, mock) => {
  mock = ParseMock(mock)

  for (let item of mock) {
    router[item.type](item.path, cxt => {
      cxt.body = item.data(cxt)
    })
  }
}

const RequireContext = path => {
  let result = []
  let files = Fs.readdirSync(path)

  for (let fileName of files) {
    let ext = Path.extname(fileName)

    if (ext) {
      result.push(`${path}/${fileName}`)
    }
    else {
      result = result.concat(RequireAll(`${path}/${fileName}`))
    }
  }

  return result
}

const GetMockData = mockPath => {
  let mockData = {}

  RequireContext(mockPath).map(path => {
    mockData = {
      ...mockData,
      ...require(path)
    }
  })

  return mockData
}

module.exports = (app, mock = {}, port = 3000) => {
  const App = app || new Koa()
  const router = new Router()

  MockData(router, mock)

  App.use(router.routes()).listen(port)
}

module.exports.GetMockData = GetMockData