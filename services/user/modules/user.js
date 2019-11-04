'use strict'

/* IMPORT MODULES */
const {Client} = require('pg')
const Bcrypt = require('bcrypt-promise')
const GenerateId = require('../../../utils/generateId')
const Validate = require('../../../utils/validate')

const slatRounds = 10

class User {
	constructor() {
		return (async() => {
			this.database = new Client({
				user: process.env.USER_DB_USER,
				host: process.env.USER_DB_HOST,
				database: process.env.USER_DB_DATABASE,
				password: process.env.USER_DB_PASSWORD,
				port: process.env.USER_DB_PORT,
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
			if(await this.exists(newUser.email) === true) throw new Error('user already exists')
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

	async exists(email) {
		const sql = `SELECT COUNT(id) as records FROM Users WHERE email='${email}';`
		const result = await this.database.query(sql)
		const data = result.rows[0]
		if (Number(data.records) === 0) return false
		else return true
	}

}

module.exports = User
