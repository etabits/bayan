'use strict'
var path = require('path')
var express = require('express')
var bodyParser = require('body-parser')

var bayanForm = require('bayan-form')

class Admin {
  constructor (opts) {
    this.models = opts.models
    this.options = opts.options
    // FIXMEPLZ
    for (var modelName in this.models) {
      // console.log(this.models[modelName])
      // this.models[modelName].bayanModel = new bayan.Schema(this.models[modelName].model.schema.obj)
      this.models[modelName].schema = this.models[modelName].connector.bayanSchema
    }
    // console.log(this.models)
    this.resLocals = {
      admin: this,
      statics: {
        css: [
          '//fonts.googleapis.com/icon?family=Material+Icons',
          'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.2/css/materialize.min.css',
          '/admin/_statics/css/style.css'
        ],
        js: [
          'https://code.jquery.com/jquery-2.1.1.min.js',
          '/js/materialize.js',
          // https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.2/js/materialize.min.js
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
    router.use('/_statics', express.static(path.join(__dirname, '../node_modules/bayan-form/public')))
    // router.use(bodyParser.urlencoded({extended: false}))
    router.use(function (req, res, next) {
      Object.assign(res.locals, self.resLocals, {
        req: {
          baseUrl: req.baseUrl
        }
      })

      next()
    })

    router.get('/', (req, res) => res.send('from router'))
    router.param('model_name', function (req, res, next, model_name) {
      res.locals.bayan = self.models[model_name]
      if (!res.locals.bayan) {
        return next(404)
      }
      next()
    })
    router.param('id', function (req, res, next, id) {
      res.locals.bayan.connector.findById(id)
      .then(function (row) {
        if (!row) {
          return next(404)
        }
        res.locals.row = row
        next()
      })
      .catch((e) => console.error(e))
    })
    router.route('/:model_name:ext(/|.json)')
      .get(this._model_index.bind(this))
    router.route('/:model_name/\\+')
      .get(this._model_add.bind(this))
      .post(this._model_update.bind(this))
    router.route('/:model_name/:id')
      .get(this._model_edit.bind(this))
      .post(this._model_update.bind(this))

    this.router = router
  }

  _model_index (req, res, next) {
    var self = this
    var conditions = Object.assign({}, res.locals.bayan.conditions || {})
    // console.log(conditions)
    res.locals.bayan.connector.find(conditions)
    .then(function (rows) {
      if (req.params.ext === '.json') {
        return res.send(rows)
      }
      self._render(req, res, {
        templateName: 'collection',
        rows
      })
    })
    .catch((e) => console.error(e))
  }

  _model_edit (req, res, next) {
    var self = this

    self._render(req, res, {
      templateName: 'edit',
      ctxt: {}
    })
  }

  _model_update (req, res, next) {
    processFiles(req, {
      upload: this.options.upload,
      filesModel: this.models.files
    }).then(function (requestData) {
      var parsedData = bayanForm.parseFormData(requestData, 'form')
      Object.assign(parsedData, res.locals.bayan.conditions || {})
      return res.locals.bayan.connector.update(res.locals.row, parsedData)
    })
    .then(function () {
      res.redirect('./')
    })
    .catch((e) => console.error(e))
  }

  _render (req, res, params) {
    res.render(this.opts.templatesPath.replace('%s', params.templateName), params)
  }

  _model_add (req, res, next) {
    var self = this

    self._render(req, res, {
      templateName: 'edit',
      ctxt: {}
    })
  }
}

function processFiles(req, opts) {
  var promises = []
  var requestData = Object.assign({}, req.body)

  for (var i = req.files.length - 1; i >= 0; i--) {
    requestData[req.files[i].fieldname] = null
    promises.push(singleFileUploader(req.files[i], opts))
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
const sha1sum = (s)=> crypto.createHash('sha1').update(s).digest("hex")
function singleFileUploader(finfo, opts) {
  finfo.sha1 = sha1sum(finfo.buffer)
  console.log(finfo, opts)

  return l([
    function (n, done) {
      fs.mkdir(`${opts.upload.root}/${finfo.sha1.substr(0, 3)}`, ()=>done())
    }, function (res, done) {
      fs.writeFile(`${opts.upload.root}/${finfo.sha1.substr(0, 3)}/${finfo.sha1.substr(3)}`, finfo.buffer, done)
    }
  ])().then(function () {
    return opts.filesModel.connector.create({
      mimeType: finfo.mimetype,
      size: finfo.size,
      sha1: finfo.sha1,
      url: `${opts.upload.rel}${finfo.sha1.substr(0, 3)}/${finfo.sha1.substr(3)}`
    })
  })
}

module.exports = Admin
