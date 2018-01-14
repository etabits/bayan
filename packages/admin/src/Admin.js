'use strict'
const path = require('path')
const express = require('express')
const bayanForm = require('bayan-form')
const qs = require('qs')

class Admin {
  constructor (opts) {
    this.models = opts.models
    this.options = opts.options
    // FIXMEPLZ
    for (var modelName in this.models) {
      // console.log(this.models[modelName])
      // this.models[modelName].bayanModel = new bayan.Schema(this.models[modelName].model.schema.obj)
      this.models[modelName] = Object.assign({
        schema: this.models[modelName].connector.bayanSchema,
        rowActions: []
      }, this.models[modelName])
    }
    // console.log(this.models)
    this.resLocals = {
      admin: this,
      statics: {
        css: [
          'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-alpha.3/css/materialize.min.css',
          '//fonts.googleapis.com/icon?family=Material+Icons',
          '/admin/_statics/css/style.css'
        ],
        js: [
          'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-alpha.3/js/materialize.min.js',
          '/admin/_statics/js/script.js' // - should not be this static, /admin
        ]
      }
    }

    this.opts = {}
    this.opts.templatesPath = path.resolve(__dirname, '../views/', '%s.pug')
    this.setupRouter()
  }

  setupRouter () {
    var self = this
    var router = express.Router({
      caseSensitive: true,
      strict: true
    })
    router.use('/_statics', express.static(path.resolve(path.dirname(require.resolve('bayan-form')), 'public')))
    router.use(function (req, res, next) {
      Object.assign(res.locals, self.resLocals, {
        req: {
          baseUrl: req.baseUrl
        }
      })

      next()
    })

    router.get('/', function (req, res, next) {
      self._render(req, res, {
        templateName: 'index'
      })
    })
    router.param('model_name', function (req, res, next, model_name) {
      res.locals.bayan = self.models[model_name]
      if (!res.locals.bayan) {
        return next(404)
      }
      res.locals.conditions = Object.assign({}, res.locals.bayan.conditions || {}, req.query.c)
      next()
    })
    router.param('id', function (req, res, next, id) {
      res.locals.bayan.connector.findById(id)
      .then(function (row) {
        if (!row) {
          return next(404)
        }
        res.locals.row = row
        res.locals.title = row.title
        next()
      })
      .catch((e) => console.error(e))
    })
    router.route('/:model_name:ext(/|.json)')
      .get(this._model_index.bind(this))
    router.route('/:model_name/\\+')
      .get(this._model_edit.bind(this))
      .post(this._model_update.bind(this))
    router.route('/:model_name/:id')
      .get(this._model_edit.bind(this))
      .post(this._model_update.bind(this))

    this.router = router
  }

  _model_index (req, res, next) {
    var self = this
    res.locals.bayan.connector.find(res.locals.conditions, {q: req.query.q})
    .then(function (rows) {
      if (req.params.ext === '.json') {
        return res.send(rows)
      }
      self._render(req, res, {
        templateName: 'collection',
        rows,
        title: res.locals.bayan.title
      })
    })
    .catch((e) => console.error(e))
  }

  _model_edit (req, res, next) {
    var self = this
    res.locals.formOpts = {
      prefix: 'form',
      skipFields: Object.keys(res.locals.conditions)
    }

    self._render(req, res, {
      templateName: 'edit',
      hasFiles: !!self.options.upload,
      ctxt: {}
    })
  }

  _model_update (req, res, next) {
    processFiles(req, {
      upload: this.options.upload,
      filesModel: this.models.files
    }).then(function (requestData) {
      var parsedData = bayanForm.parseFormData(requestData, 'form')
      Object.assign(parsedData, res.locals.conditions || {})
      return res.locals.bayan.connector.update(res.locals.row, parsedData)
    })
    .then(function () {
      res.redirect(createUrl(req, './'))
    })
    .catch((e) => console.error(e))
  }

  _render (req, res, params) {
    res.locals.createUrl = (url, opts) => createUrl(req, url, opts)
    res.render(this.opts.templatesPath.replace('%s', params.templateName), params)
  }

}

function createUrl (req, url, opts) {
  return url + '?' + qs.stringify({
    c: req.query.c
  })
}

function processFiles (req, opts) {
  var promises = []
  var requestData = Object.assign({}, req.body)

  if (!req.files) {
    return Promise.resolve(requestData)
  }

  for (var i = 0; i < req.files.length; ++i) {
    requestData[req.files[i].fieldname] = null
    promises.push((opts.upload.handler || singleFileUploader)(req.files[i], opts))
  }

  return Promise.all(promises).then(function (results) {
    for (var i = req.files.length - 1; i >= 0; i--) {
      if (!requestData[req.files[i].fieldname]) {
        requestData[req.files[i].fieldname] = results[i].id
      } else {
        if (!Array.isArray(requestData[req.files[i].fieldname])) {
          requestData[req.files[i].fieldname] = [requestData[req.files[i].fieldname]]
        }
        requestData[req.files[i].fieldname].push(results[i].id)
      }
    }
    return requestData
  })
}

const l = require('l')
const fs = require('fs')
const crypto = require('crypto')
const sha1sum = (s) => crypto.createHash('sha1').update(s).digest('hex')
function singleFileUploader (finfo, opts) {
  finfo.sha1 = sha1sum(finfo.buffer)

  return l([
    function (done) {
      fs.mkdir(`${opts.upload.root}/${finfo.sha1.substr(0, 3)}`, () => done())
    }, function (done) {
      fs.writeFile(`${opts.upload.root}/${finfo.sha1.substr(0, 3)}/${finfo.sha1.substr(3)}`, finfo.buffer, done)
    }
  ])().then(function () {
    return opts.filesModel.connector.create({
      mimeType: finfo.mimetype,
      size: finfo.size,
      sha1: finfo.sha1,
      originalName: finfo.originalname,
      url: `${opts.upload.rel}${finfo.sha1.substr(0, 3)}/${finfo.sha1.substr(3)}`,
      storage: `${opts.upload.root}/${finfo.sha1.substr(0, 3)}/${finfo.sha1.substr(3)}`,
    })
  })
}

module.exports = Admin
