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
		const data = await this.database.get(sql)
		const res = {rows: [data]}
		return res
	}

}

module.exports.Client = Client
