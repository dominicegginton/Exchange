'use strict'

/* IMPORT MODULES */
const {Pool} = require('pg')
const Mime = require('mime-types')
const FileSystem = require('fs-extra')
const Sharp = require('sharp')
const GenerateId = require('../../../utils/generateId')
const Validate = require('../../../utils/validate')

class Item {
	constructor() {
		return (async() => {
			if (!Item.pool) {
				Item.pool = new Pool({
					user: process.env.EXCHANGE_DB_ITEM_USERNAME,
					host: process.env.EXCHANGE_DB_ITEM_HOST,
					database: process.env.EXCHANGE_DB_ITEM_DATABASE,
					password: process.env.EXCHANGE_DB_ITEM_PASSWORD,
					port: process.env.EXCHANGE_DB_ITEM_PORT,
				})
			}
			this.database = await Item.pool.connect()
			await this.database.query(`CREATE TABLE IF NOT EXISTS Items
			(id varchar(36) PRIMARY KEY NOT NULL, name varchar(40) NOT NULL,
			description varchar(500) NOT NULL, image varchar(100), user_id varchar(36) NOT NULL);`)
			return this
		})()
	}

	async new(newItem) {
		try {
			Validate(newItem, ['name', 'description', 'user_id'])
			const id = GenerateId()
			const sql = `INSERT INTO Items (id, name, description, user_id) VALUES
			('${id}', '${newItem.name}', '${newItem.description}', '${newItem.user_id}');`
			await this.database.query(sql)
			return id
		} catch (error) {
			throw error
		}
	}

	async uploadImage(itemId, image) {
		try {
			Validate(image, ['path', 'type'])
			const {path, type} = image
			if (!await FileSystem.exists(path)) throw new Error('image not found')
			const fileStats = await FileSystem.stat(path)
			if (fileStats.size === 0) throw new Error('image size too small')
			const fileExtension = Mime.extension(type)
			const fileName = `${GenerateId()}.${fileExtension}`
			const imageSize = {width: 900, height: 500}
			await FileSystem.ensureDir('data/images/')
			await Sharp(path).resize(imageSize).png().toFile(`data/images/${fileName}`)
			const sql = `UPDATE Items SET image='${fileName}' WHERE id='${itemId}'`
			await this.database.query(sql)
			return fileName
		} catch (error) {
			throw error
		}
	}

	async getDetails(itemId) {
		try {
			const sql = `SELECT * FROM Items WHERE id='${itemId}'`
			const result = await this.database.query(sql)
			if (!!result.rows[0]) return result.rows[0]
			else throw new Error('Invalid item id')
		} catch (error) {
			throw error
		}
	}

	async getUsersItems(userId) {
		const sql = `SELECT * FROM Items WHERE user_id='${userId}';`
		const result = await this.database.query(sql)
		return result.rows
	}

	async getItems(search) {
		if (!search) {
			const sql = 'SELECT * FROM Items'
			const result = await this.database.query(sql)
			return result.rows
		} else {
			const searchWords = search.toUpperCase().split(' ')
			const searchItems = []
			for (let i = 0; i < searchWords.length; i++) {
				const sql = `SELECT * FROM Items WHERE UPPER(name) LIKE '%${searchWords[i]}%' 
					OR UPPER(description) LIKE '%${searchWords[i]}%';`
				const result = await this.database.query(sql)
				result.rows.forEach(item => searchItems.push(item))
			}
			const removeDuplicates = items => [...new Set(items.map(item => JSON.stringify(item)))]
				.map(x => JSON.parse(x))
			return removeDuplicates(searchItems)
		}
	}

	async tearDown() {
		this.database.release()
	}
}

module.exports = Item
