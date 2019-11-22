'use strict'

const SQLite = require('sqlite-async')

class Client {

	constructor() {
		return (async() => {
			this.database = await SQLite.open(':memory:')
			return this
		})()
	}

	async query(sql) {
		const data = await this.database.all(sql)
		return {rows: data}
	}

	async release() {
		this.database = null
	}

}

class Pool {

	constructor() {
		return this
	}

	async connect() {
		return await new Client()
	}
}

module.exports.Client = Client
module.exports.Pool = Pool
