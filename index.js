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

  find (conditions) {
    return this.model.find(conditions).limit(100)
  }
  findById (id) {
    var ret = this.model.findById(id)
    var pathsToPopulate = []

    for (var path in this.bayanSchema.$.attributesByPath) {
      if (this.bayanSchema.$.attributesByPath[path].$.ref) {
        pathsToPopulate.push(path.replace(/\.0\./g, '.'))
      }
    }
    if (pathsToPopulate.length) ret = ret.populate(pathsToPopulate.join(' '))
    return ret
  }
  update (row, data) {
    // console.log(data)
    // return
    if (!row) {
      return this.model.create(data)
    }
    return this.model.findByIdAndUpdate(row._id, {
      $set: data
    })
  }

  static attrFrom (attr) {
    if (typeof attr === 'object') {
      if (Array.isArray(attr)) {
        attr = attr.slice(0) // copying
        // console.log('>>>', attr)
        if (attr[0].type && attr[0].type.name === 'ObjectId' && typeof attr[0].ref === 'string') {
          attr = Object.assign({}, attr[0], {
            type: [String],
            ref: attr[0].ref
            // path: {populate: true}
          })
        }
      } else {
        attr = Object.assign({}, attr)// copying
      }
    }

    // we have a type and we have metas
    if (typeof attr.type !== 'undefined' && typeof attr.$ !== 'undefined') {
      for (var key in attr) {
        if (key === '$') continue
        attr.$[key] = attr[key]
        delete attr[key]
      }
    }
    return attr
  }

  static schemaFrom (mongooseModel) {
    // console.log(schema)
    return new bayan.Schema(mongooseModel.schema.obj, {
      modelName: mongooseModel.modelName,
      attributeTransformer: MongooseConnector.attrFrom
    })
  }
}

module.exports = MongooseConnector
