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
          'http://fonts.googleapis.com/icon?family=Material+Icons',
          'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.2/css/materialize.min.css',
          '/admin/_statics/css/style.css'
        ],
        js: [
          'https://code.jquery.com/jquery-2.1.1.min.js',
          'http://localhost:8000/bin/materialize.js',
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
    router.use(bodyParser.urlencoded({extended: false}))
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
    var parsedData = bayanForm.parseFormData(req.body, 'form')
    Object.assign(parsedData, res.locals.bayan.conditions || {})
    // return console.log(parsedData)
    res.locals.bayan.connector.update(res.locals.row, parsedData)
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

module.exports = Admin
