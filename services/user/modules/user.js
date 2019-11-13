'use strict'

/* IMPORT MODULES */
const {Client} = require('pg')
const Bcrypt = require('bcrypt-promise')
const Mime = require('mime-types')
const FileSystem = require('fs-extra')
const Sharp = require('sharp')
const GenerateId = require('../../../utils/generateId')
const Validate = require('../../../utils/validate')

const slatRounds = 10

class User {
	constructor() {
		return (async() => {
			this.database = new Client({
				user: process.env.EXCHANGE_DB_USER_USERNAME,
				host: process.env.EXCHANGE_DB_USER_HOST,
				database: process.env.EXCHANGE_DB_USER_DATABASE,
				password: process.env.EXCHANGE_DB_USER_PASSWORD,
				port: process.env.EXCHANGE_DB_USER_PORT,
			})
			await this.database.connect()
			await this.database.query(`CREATE TABLE IF NOT EXISTS Users 
			(id varchar(36) PRIMARY KEY NOT NULL, name varchar(40) NOT NULL, email varchar(40) NOT NULL, 
			password varchar(100) NOT NULL, avatar varchar(100));`)
			return this
		})()
	}

	async register(newUser) {
		try {
			Validate(newUser, ['name', 'email', 'password'])
			if(await this.exists(newUser.email) === true) throw new Error(`Email "${newUser.email}" already registered`)
			const id = GenerateId()
			newUser.password = await Bcrypt.hash(newUser.password, slatRounds)
			const sql = `INSERT INTO Users (id, name, email, password)
			VALUES('${id}', '${newUser.name}', '${newUser.email}' , '${newUser.password}');`
			await this.database.query(sql)
			return id
		} catch (error) {
			throw error
		}
	}

	async login(userAuthentication) {
		try {
			Validate(userAuthentication, ['email', 'password'])
			if (await this.exists(userAuthentication.email) === false) {
				throw new Error(`Email "${userAuthentication.email}" is not registered`)
			}
			const sql = `SELECT id, password FROM Users WHERE email = '${userAuthentication.email}';`
			const result = await this.database.query(sql)
			const data = result.rows[0]
			if (await Bcrypt.compare(userAuthentication.password, data.password) === false) {
				throw new Error('Invalid password')
			} else return data.id
		} catch (error) {
			throw error
		}
	}

	async uploadAvatar(userId, avatar) {
		try {
			Validate(avatar, ['path', 'type'])
			const {path, type} = avatar
			if (!await FileSystem.exists(path)) throw new Error('image not found')
			const fileStats = await FileSystem.stat(path)
			if (fileStats.size === 0) throw new Error('image size too small')
			const fileExtension = Mime.extension(type)
			const fileName = `${GenerateId()}.${fileExtension}`
			const avatarSize = {width: 200, height: 200}
			await FileSystem.ensureDir('data/avatars/')
			await Sharp(path).resize(avatarSize).png().toFile(`data/avatars/${fileName}`)
			const sql = `UPDATE Users SET avatar='${fileName}' WHERE id='${userId}'`
			await this.database.query(sql)
			return fileName
		} catch (error) {
			throw error
		}
	}

	async getDetails(userId) {
		try {
			const sql = `SELECT * FROM Users WHERE id = '${userId}'`
			const result = await this.database.query(sql)
			if (!!result.rows[0]) return result.rows[0]
			else throw new Error('Invalid user id')
		} catch (error) {
			throw error
		}
	}

	async exists(email) {
		const sql = `SELECT COUNT(id) as records FROM Users WHERE email='${email}';`
		const result = await this.database.query(sql)
		const data = result.rows[0]
		if (Number(data.records) === 0) return false
		else return true
	}

}

module.exports = User
