'use strict'

/* IMPORT MODULES */
const {Pool} = require('pg')
const GenerateId = require('../../../utils/generateId')
const Validate = require('../../../utils/validate')

class Wishlist {
	constructor() {
		return (async() => {
			if (!Wishlist.pool) {
				Wishlist.pool = new Pool({
					user: process.env.EXCHANGE_DB_WISHLIST_USERNAME,
					host: process.env.EXCHANGE_DB_WISHLIST_HOST,
					database: process.env.EXCHANGE_DB_WISHLIST_DATABASE,
					password: process.env.EXCHANGE_DB_WISHLIST_PASSWORD,
					port: process.env.EXCHANGE_DB_WISHLIST_PORT,
				})
			}
			this.database = await Wishlist.pool.connect()
			await this.database.query(`CREATE TABLE IF NOT EXISTS Wishlists
			(id varchar(36) PRIMARY KEY NOT NULL, name varchar(40) NOT NULL,
			description varchar(500) NOT NULL, item_id varchar(36) NOT NULL, user_id varchar(36) NOT NULL);`)
			return this
		})()
	}

	async new(newItem) {
		try {
			Validate(newItem, ['name', 'description', 'item_id', 'user_id'])
			const id = GenerateId()
			const sql = `INSERT INTO Wishlists (id, name, description, item_id, user_id) VALUES
			('${id}', '${newItem.name}', '${newItem.description}', '${newItem.item_id}', '${newItem.user_id}');`
			await this.database.query(sql)
			return id
		} catch (error) {
			throw error
		}
	}

	async delete(deleteItem) {
		try {
			Validate(deleteItem, ['wishlist_item_id', 'user_id'])
			let sql = `SELECT user_id FROM Wishlists Where id='${deleteItem.wishlist_item_id}';`
			const result = await this.database.query(sql)
			const data = result.rows[0]
			if (data.user_id !== deleteItem.user_id) throw new Error('user does not own wishlist item')
			sql = `DELETE FROM Wishlists WHERE id='${deleteItem.wishlist_item_id}';`
			await this.database.query(sql)
			return true
		} catch (error) {
			throw error
		}
	}

	async getItems(itemId) {
		const sql = `SELECT * FROM Wishlists WHERE item_id='${itemId}';`
		const result = await this.database.query(sql)
		return result.rows
	}

	async tearDown() {
		this.database.release()
	}
}

module.exports = Wishlist
