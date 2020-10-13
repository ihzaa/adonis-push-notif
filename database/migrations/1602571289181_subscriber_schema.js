'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SubscriberSchema extends Schema {
  up () {
    this.create('subscribers', (table) => {
      table.increments()
      table.json('subscriber')
      table.timestamps()
    })
  }

  down () {
    this.drop('subscribers')
  }
}

module.exports = SubscriberSchema
