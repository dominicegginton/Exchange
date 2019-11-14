'use strict'

/* IMPORT MODULES */
const {Client} = require('pg')
const GenerateId = require('../../../utils/generateId')
const Validate = require('../../../utils/validate')

class Wishlist {
	constructor() {
		return (async() => {
			this.database = new Client({
				user: process.env.EXCHANGE_DB_WISHLIST_USERNAME,
				host: process.env.EXCHANGE_DB_WISHLIST_HOST,
				database: process.env.EXCHANGE_DB_WISHLIST_DATABASE,
				password: process.env.EXCHANGE_DB_WISHLIST_PASSWORD,
				port: process.env.EXCHANGE_DB_WISHLIST_PORT,
			})
			await this.database.connect()
			await this.database.query(`CREATE TABLE IF NOT EXISTS Wishlists
			(id varchar(36) PRIMARY KEY NOT NULL, name varchar(40) NOT NULL,
			description varchar(500) NOT NULL, item_id varchar(36) NOT NULL, user_id varchar(36) NOT NULL);`)
			return this
		})()
	}
}

module.exports = Wishlist
