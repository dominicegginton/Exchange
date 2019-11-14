'use strict'

const SQLite = require('sqlite-async')

class Client {

	constructor() {
		return this
	}

	async connect() {
		this.database = await SQLite.open(':memory:')
	}

	async query(sql) {
		const data = await this.database.all(sql)
		return {rows: data}
	}

}

module.exports.Client = Client
