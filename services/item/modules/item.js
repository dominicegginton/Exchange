'use strict'

/* IMPORT MODULES */
const {Client} = require('pg')
const Mime = require('mime-types')
const FileSystem = require('fs-extra')
const GenerateId = require('../../../utils/generateId')
const Validate = require('../../../utils/validate')

class Item {
	constructor() {
		return (async() => {
			this.database = new Client({
				user: process.env.ITEM_DB_USER,
				host: process.env.ITEM_DB_HOST,
				database: process.env.ITEM_DB_DATABASE,
				password: process.env.ITEM_DB_PASSWORD,
				port: process.env.ITEM_DB_PORT,
			})
			await this.database.connect()
			await this.database.query(`CREATE TABLE IF NOT EXISTS Items
			(id varchar(36) PRIMARY KEY NOT NULL, name varchar(40) NOT NULL,
			description varchar(500) NOT NULL, image varchar(100), userId varchar(36) NOT NULL);`)
			return this
		})()
	}

	async new(newItem) {
		try {
			Validate(newItem, ['name', 'description', 'userId'])
			const id = GenerateId()
			const sql = `INSERT INTO Items (id, name, description, userId) VALUES
			('${id}', '${newItem.name}', '${newItem.description}', '${newItem.userId}');`
			await this.database.query(sql)
			return id
		} catch (error) {
			throw error
		}
	}

	async uploadImage(itemId, image) {
		try {
			Validate(image, ['path', 'type', 'size'])
			if (image.size === 0) return
			const {path, type} = image
			const fileExtension = Mime.extension(type)
			const fileName = `${GenerateId()}.${fileExtension}`
			await FileSystem.copy(path, `data/images/${fileName}`)
			const sql = `UPDATE Items SET image='${fileName}' WHERE id='${itemId}'`
			await this.database.query(sql)
			return fileName
		} catch (error) {
			throw error
		}
	}
}

module.exports = Item
