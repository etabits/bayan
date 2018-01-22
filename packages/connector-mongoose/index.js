'use strict'
var bayan = require('bayan-core')

class MongooseConnector {
  constructor (obj) {
    if (typeof obj.schema !== 'undefined') { // instanceof mongoose.Schema
      this.model = obj
      this.mongooseSchema = this.model.schema
      this.bayanSchema = MongooseConnector.schemaFrom(this.model)
    } else { // FIXMEPLZ
      // this.bayanSchema = bayanSchema
      // this.schema = new mongoose.Schema(this.bayanSchema.$.attributes)
      // this.model = mongoose.model(this.bayanSchema.$.opts.modelName, this.schema) // FIXMEPLZ
    }
  }

  find (conditions, opts) {
    // FIXMEPLZ loop all string fields or those with a flag?
    if (opts.q) {
      conditions.$or = [
        {_$label: new RegExp(opts.q, 'i')},
        {_$search: new RegExp(opts.q, 'i')}
      ]
    }
    return this.model.find(conditions).limit(100)
  }
  findById (id) {
    var ret = this.model.findById(id)
    var pathsToPopulate = []

    for (var path in this.bayanSchema.$.attributesByPath) {
      if (this.bayanSchema.$.attributesByPath[path].$.ref) {
        pathsToPopulate.push(path.replace(/\.0\./g, '.').replace(/\.0$/, ''))
      }
    }

    if (pathsToPopulate.length) ret = ret.populate(pathsToPopulate.join(' '))
    return ret
  }

  create (data) {
    return this.update(null, data)
  }

  update (row, data) {
    // console.log(data)
    // return
    if (!row) {
      return this.model.create(data)
    }
    Object.assign(row, data)
    // return console.log(row, data, row.save)
    return row.save()
  }

  static attrFrom (attr) {
    // we have a type and we have metas
    if (typeof attr.type !== 'undefined' && typeof attr.$ !== 'undefined') {
      for (var key in attr) {
        if (key === '$') continue
        // If it is already set inside $, it takes priority
        attr.$[key] = attr.$[key] || attr[key]
        delete attr[key]
      }
    }
    return attr
  }

  static schemaFrom (mongooseModel) {
    // console.log(schema)
    return new bayan.Schema(mongooseModel.schema.obj, {
      modelName: mongooseModel.modelName,
      hooks: [{
        type: 'pre',
        weight: -1,
        handler: MongooseConnector.attrFrom
      }]
    })
  }
}

module.exports = MongooseConnector
