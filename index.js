/**
 * @file mock
 * @author xiaozhihua
 * @date 2018-11-23 22:58:24
 */

const Fs = require('fs')
const Path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const Cors = require('koa2-cors')
const Proxy = require('koa-server-http-proxy')

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
    router[item.type](item.path, async (cxt, next) => {
      let data = item.data
      
      if (typeof data !== 'string') {
        data = data(cxt)

        if (data.then) {
          data = await data
        }

        if (typeof data === 'object') {
          // 方便知道这是本地返回的数据还是服务端返回的数据
          data._local_mock = true
        }
      }

      if (typeof data === 'string') {
        Proxy(cxt.req.url, {
          target: data,
          changeOrigin: true,
          onProxyRes: (proxyRes, req, res) => {
            proxyRes.statusCode = 200
          }
        })(cxt, next)
      }
      else {
        cxt.body = data
      }
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

  App.use(Cors())
  App.use(router.routes()).listen(port)
}

module.exports.GetMockData = GetMockData