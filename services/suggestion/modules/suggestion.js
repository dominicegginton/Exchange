'use strict'

/* IMPORT MODULES */
const {Pool} = require('pg')
const GenerateId = require('../../../utils/generateId')
const Mail = require('../../../utils/mail')
const Validate = require('../../../utils/validate')

class Suggestion {
	constructor() {
		return (async() => {
			if (!Suggestion.pool) {
				Suggestion.pool = new Pool({
					user: process.env.EXCHANGE_DB_SUGGESTION_USERNAME,
					host: process.env.EXCHANGE_DB_SUGGESTION_HOST,
					database: process.env.EXCHANGE_DB_SUGGESTION_DATABASE,
					password: process.env.EXCHANGE_DB_SUGGESTION_PASSWORD,
					port: process.env.EXCHANGE_DB_SUGGESTION_PORT,
				})
			}
			this.database = await Suggestion.pool.connect()
			await this.database.query(`CREATE TABLE IF NOT EXISTS Suggestions
				(id varchar(36) PRIMARY KEY NOT NULL, item_id varchar(36) NOT NULL,
				wishlist_item_id varchar(36) NOT NULL, user_id varchar(36) NOT NULL,
				suggested_item_id varchar(36) NOT NULL, suggested_wishlist_item_id varchar(36) NOT NULL,
				suggested_user_id varchar(36) NOT NULL);`)
			return this
		})()
	}

	async new(newSuggestion) {
		try {
			this.validateSuggestionObject(newSuggestion)
			const exists = await this.exists(newSuggestion)
			if (exists !== false) return exists
			const id = GenerateId()
			const sql = `INSERT INTO Suggestions (id, item_id, wishlist_item_id, user_id, suggested_item_id,
				suggested_wishlist_item_id, suggested_user_id) VALUES
				('${id}', '${newSuggestion.item.id}', '${newSuggestion.wishlist_item.id}', '${newSuggestion.user.id}',
				'${newSuggestion.suggested_item.id}', '${newSuggestion.suggested_wishlist_item.id}',
				'${newSuggestion.suggested_user.id}');`
			await this.database.query(sql)
			await this.sendSuggestionMail(newSuggestion)
			return id
		} catch (error) {
			throw error
		}
	}

	async sendSuggestionMail(newSuggestion) {
		await Mail({
			to: newSuggestion.user.email, subject: 'New Suggested Exchange',
			mail_template: 'mail/suggestion_new',
			data: {suggestion: newSuggestion}
		})
		const newSuggestionCopy = {item: newSuggestion.suggested_item, user: newSuggestion.suggested_user,
			suggested_item: newSuggestion.item, suggested_user: newSuggestion.user}
		await Mail({
			to: newSuggestionCopy.user.email, subject: 'New Suggested Exchange',
			mail_template: 'mail/suggestion_new',
			data: {suggestion: newSuggestionCopy}
		})
	}

	validateSuggestionObject(suggestion) {
		try {
			Validate(suggestion, ['item', 'wishlist_item', 'user', 'suggested_item', 'suggested_wishlist_item',
				'suggested_user'])
			Validate(suggestion.item, ['id', 'name', 'description', 'image', 'user_id'])
			Validate(suggestion.wishlist_item, ['id', 'name', 'description', 'item_id', 'user_id'])
			Validate(suggestion.user, ['id', 'name', 'email', 'avatar'])
			Validate(suggestion.suggested_item, ['id', 'name', 'description', 'image', 'user_id'])
			Validate(suggestion.suggested_wishlist_item, ['id', 'name', 'description', 'item_id', 'user_id'])
			Validate(suggestion.suggested_user, ['id', 'name', 'email', 'avatar'])
			if (suggestion.item.user_id === suggestion.suggested_item.user_id) {
				throw new Error('can not create suggestion for own item')
			}
		} catch (error) {
			throw error
		}
	}

	async exists(suggestion) {
		const sql = `SELECT id FROM Suggestions WHERE 
			(item_id = '${suggestion.item.id}' AND suggested_item_id = '${suggestion.suggested_item.id}')
			OR (item_id = '${suggestion.suggested_item.id}' AND suggested_item_id = '${suggestion.item.id}');`
		const result = await this.database.query(sql)
		const data = result.rows
		if (data.length === 0) return false
		else return data[0].id
	}

	async getDetails(suggestionId) {
		try {
			if (!suggestionId) throw new Error('suggestionId is empty')
			const sql = `SELECT * FROM Suggestions WHERE id = '${suggestionId}';`
			const result = await this.database.query(sql)
			const data = result.rows
			if (data.length === 0) throw new Error('suggestion does not exist')
			return data[0]
		} catch (error) {
			throw error
		}
	}

	async getSuggestions(itemId) {
		try {
			if (!itemId) throw new Error('itemId is empty')
			const sql = `SELECT * FROM Suggestions WHERE item_id = '${itemId}' OR suggested_item_id = '${itemId}';`
			const result = await this.database.query(sql)
			const data = result.rows
			data.forEach(suggestion => {
				if (suggestion.item_id !== itemId) {
					[suggestion['item_id'], suggestion['suggested_item_id']] = [suggestion['suggested_item_id'],
						suggestion['item_id']],
					[suggestion['user_id'], suggestion['suggested_user_id']] = [suggestion['suggested_user_id'],
						suggestion['user_id']]
				}
			})
			return data
		} catch (error) {
			throw error
		}
	}

	async remove(suggestionId) {
		try {
			if (!suggestionId) throw new Error('suggestionId is empty')
			const sql = `DELETE FROM Suggestions WHERE id = '${suggestionId}';`
			await this.database.query(sql)
			return true
		} catch (error) {
			throw error
		}
	}

	async delete(wishlistId) {
		try {
			if (!wishlistId) throw new Error('wishlistId is empty')
			const sql = `DELETE FROM Suggestions WHERE wishlist_item_id = '${wishlistId}'
				OR suggested_wishlist_item_id = '${wishlistId}';`
			await this.database.query(sql)
			return true
		} catch (error) {
			throw error
		}
	}

	async tearDown() {
		this.database.release()
	}
}

module.exports = Suggestion
