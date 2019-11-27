'use strict'

/* IMPORT MODULES */
const {Pool} = require('pg')
const Pug = require('koa-pug')
const Mail = require('../../../utils/mail')
const GenerateId = require('../../../utils/generateId')
const Validate = require('../../../utils/validate')

class Offer {
	constructor() {
		return (async() => {
			if (!Offer.pool) {
				Offer.pool = new Pool({
					user: process.env.EXCHANGE_DB_OFFER_USERNAME,
					host: process.env.EXCHANGE_DB_OFFER_HOST,
					database: process.env.EXCHANGE_DB_OFFER_DATABASE,
					password: process.env.EXCHANGE_DB_OFFER_PASSWORD,
					port: process.env.EXCHANGE_DB_OFFER_PORT,
				})
			}
			this.pug = new Pug({viewPath: './views'})
			this.database = await Offer.pool.connect()
			await this.database.query(`CREATE TABLE IF NOT EXISTS Offers
			(id varchar(36) PRIMARY KEY NOT NULL, item_id varchar(40) NOT NULL, user_id varchar(36) NOT NULL,
			offered_item_id varchar(36) NOT NULL, offered_user_id varchar(36) NOT NULL);`)
			return this
		})()
	}

	async new(newOffer) {
		try {
			this.validateNewOffer(newOffer)
			if (await this.exists(newOffer) === true) throw new Error('offer already exists')
			const id = GenerateId()
			const sql = `INSERT INTO Offers (id, item_id, user_id, offered_item_id, offered_user_id) VALUES
			('${id}', '${newOffer.item.id}', '${newOffer.user.id}', '${newOffer.offered_item.id}',
			'${newOffer.offered_user.id}');`
			await this.database.query(sql)
			await this.sendOfferEmail(newOffer)
			return id
		} catch (error) {
			throw error
		}
	}

	validateNewOffer(newOffer) {
		try {
			Validate(newOffer, ['item', 'user', 'offered_item', 'offered_user'])
			Validate(newOffer.item, ['id', 'name', 'description', 'image', 'user_id'])
			Validate(newOffer.user, ['id', 'name', 'email', 'avatar'])
			Validate(newOffer.offered_item, ['id', 'name', 'description', 'image', 'user_id'])
			Validate(newOffer.offered_user, ['id', 'name', 'email', 'avatar'])
			if (newOffer.offered_item.user_id !== newOffer.offered_user.id) {
				throw new Error('user does not own offered item')
			}
			if (newOffer.item.user_id === newOffer.offered_user.id) {
				throw new Error('can not create new offer on own item')
			}
		} catch (error) {
			throw error
		}
	}

	async sendOfferEmail(newOffer) {
		await Mail({
			to: newOffer.user.email,
			subject: `${newOffer.user.name}, you have a new offer on your ${newOffer.item.name} 😄`,
			mail_template: 'mail/offer_new',
			data: {offer: newOffer}
		})
	}

	async exists(offer) {
		const sql = `SELECT COUNT(id) as records FROM Offers WHERE
		item_id='${offer.item.id}' AND offered_item_id='${offer.offered_item.id}';`
		const result = await this.database.query(sql)
		const data = result.rows[0]
		if (Number(data.records) === 0) return false
		else return true
	}

	async getUsersReceivedOffers(userId) {
		const sql = `SELECT * FROM Offers WHERE user_id='${userId}';`
		const result = await this.database.query(sql)
		return result.rows
	}

	async reject(offerId) {
		try {
			if (!offerId) throw new Error('offerId is empty')
			const sql = `DELETE FROM Offers WHERE id = '${offerId}';`
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

module.exports = Offer
