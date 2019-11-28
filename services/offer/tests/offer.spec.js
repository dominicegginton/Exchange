'use strict'

/* IMPORT TEST */
const Offer = require('../modules/offer')

/* IMPORT MODULES */
const Nodemailer = require('nodemailer')
const GenerateId = require('../../../utils/generateId')

/* MOCK MODULES */
jest.mock('nodemailer')

beforeEach(async() => {
	this.offer = await new Offer()
	this.transporter = Nodemailer.createTransport()
	this.userId = GenerateId()
	this.offeredUserId = GenerateId()
	this.newOffer = {
		item: {
			id: GenerateId(),
			name: 'test',
			description: 'testing',
			image: 'testing',
			user_id: this.userId
		},
		user: {
			id: this.userId,
			name: 'test user',
			email: 'test@testing.com',
			avatar: 'test'
		},
		offered_item: {
			id: GenerateId(),
			name: 'foo',
			description: 'foo testing',
			image: 'testing',
			user_id: this.offeredUserId
		},
		offered_user: {
			id: this.offeredUserId,
			name: 'foo',
			email: 'foo@testing.com',
			avatar: 'test'
		}
	}
})

afterEach(async() => {
	this.offer.tearDown()
})

describe('new()', () => {

	test('add new offer with valid data', async done => {
		expect.assertions(3)
		const newOfferId = await this.offer.new(this.newOffer)
		expect(typeof newOfferId).toBe('string')
		expect(newOfferId.length).toBe(36)
		expect(this.transporter.sendMail).toHaveBeenCalled()
		done()
	})

	test('add new duplicate offer should error', async done => {
		expect.assertions(3)
		const newOfferId = await this.offer.new(this.newOffer)
		expect(typeof newOfferId).toBe('string')
		expect(newOfferId.length).toBe(36)
		await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('offer already exists'))
		done()
	})

	test('add offer with item that user does no own should error', async done => {
		this.newOffer.offered_item.user_id = GenerateId()
		await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('user does not own offered item'))
		done()
	})

	test('add offer on own item should error', async done => {
		expect.assertions(1)
		this.newOffer.item.user_id = this.newOffer.offered_user.id
		await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('can not create new offer on own item'))
		done()
	})

	describe('data validation', () => {
		describe('item object', () => {
			test('no item object should error', async done => {
				delete this.newOffer.item
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('item is empty'))
				done()
			})
			test('no item id object should error', async done => {
				delete this.newOffer.item.id
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('id is empty'))
				done()
			})
			test('empty item id object should error', async done => {
				this.newOffer.item.id = ''
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('id is empty'))
				done()
			})
			test('no item name object should error', async done => {
				delete this.newOffer.item.name
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('name is empty'))
				done()
			})
			test('empty item name object should error', async done => {
				this.newOffer.item.name = ''
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('name is empty'))
				done()
			})

			test('no item description object should error', async done => {
				delete this.newOffer.item.description
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('description is empty'))
				done()
			})
			test('empty item description object should error', async done => {
				this.newOffer.item.description = ''
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('description is empty'))
				done()
			})
			test('no item image object should error', async done => {
				delete this.newOffer.item.image
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('image is empty'))
				done()
			})
			test('empty item image object should error', async done => {
				this.newOffer.item.image = ''
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('image is empty'))
				done()
			})
			test('no item user_id object should error', async done => {
				delete this.newOffer.item.user_id
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('user_id is empty'))
				done()
			})
			test('empty item user_id object should error', async done => {
				this.newOffer.item.user_id = ''
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('user_id is empty'))
				done()
			})
		})
		describe('user object', () => {
			test('no user object should error', async done => {
				delete this.newOffer.user
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('user is empty'))
				done()
			})
			test('no user id object should error', async done => {
				delete this.newOffer.user.id
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('id is empty'))
				done()
			})
			test('empty user id object should error', async done => {
				this.newOffer.user.id = ''
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('id is empty'))
				done()
			})
			test('no user name object should error', async done => {
				delete this.newOffer.user.name
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('name is empty'))
				done()
			})
			test('empty user name object should error', async done => {
				this.newOffer.user.name = ''
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('name is empty'))
				done()
			})
			test('no user email object should error', async done => {
				delete this.newOffer.user.email
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('email is empty'))
				done()
			})
			test('empty user email object should error', async done => {
				this.newOffer.user.email = ''
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('email is empty'))
				done()
			})
			test('no user avatar object should error', async done => {
				delete this.newOffer.user.avatar
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('avatar is empty'))
				done()
			})
			test('empty user avatar object should error', async done => {
				this.newOffer.user.avatar = ''
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('avatar is empty'))
				done()
			})
		})
		describe('offered_item object', () => {
			test('no offered_item object should error', async done => {
				delete this.newOffer.offered_item
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('offered_item is empty'))
				done()
			})
			test('no offered_item id object should error', async done => {
				delete this.newOffer.offered_item.id
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('id is empty'))
				done()
			})
			test('empty offered_item id object should error', async done => {
				this.newOffer.offered_item.id = ''
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('id is empty'))
				done()
			})
			test('no offered_item name object should error', async done => {
				delete this.newOffer.offered_item.name
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('name is empty'))
				done()
			})
			test('empty offered_item name object should error', async done => {
				this.newOffer.offered_item.name = ''
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('name is empty'))
				done()
			})
			test('no offered_item description object should error', async done => {
				delete this.newOffer.offered_item.description
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('description is empty'))
				done()
			})
			test('empty offered_item description object should error', async done => {
				this.newOffer.offered_item.description = ''
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('description is empty'))
				done()
			})
			test('no offered_item image object should error', async done => {
				delete this.newOffer.offered_item.image
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('image is empty'))
				done()
			})
			test('empty offered_item image object should error', async done => {
				this.newOffer.offered_item.image = ''
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('image is empty'))
				done()
			})
			test('no offered_item user_id object should error', async done => {
				delete this.newOffer.offered_item.user_id
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('user_id is empty'))
				done()
			})
			test('empty offered_item user_id object should error', async done => {
				this.newOffer.offered_item.user_id = ''
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('user_id is empty'))
				done()
			})
		})
		describe('offered_user object', () => {
			test('no user object should error', async done => {
				delete this.newOffer.offered_user
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('offered_user is empty'))
				done()
			})
			test('no offered_user id object should error', async done => {
				delete this.newOffer.offered_user.id
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('id is empty'))
				done()
			})
			test('empty offered_user id object should error', async done => {
				this.newOffer.offered_user.id = ''
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('id is empty'))
				done()
			})
			test('no offered_user name object should error', async done => {
				delete this.newOffer.offered_user.name
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('name is empty'))
				done()
			})
			test('empty offered_user name object should error', async done => {
				this.newOffer.offered_user.name = ''
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('name is empty'))
				done()
			})
			test('no offered_user email object should error', async done => {
				delete this.newOffer.offered_user.email
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('email is empty'))
				done()
			})
			test('empty offered_user email object should error', async done => {
				this.newOffer.offered_user.email = ''
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('email is empty'))
				done()
			})
			test('no offered_user avatar object should error', async done => {
				delete this.newOffer.offered_user.avatar
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('avatar is empty'))
				done()
			})
			test('empty offered_user avatar object should error', async done => {
				this.newOffer.offered_user.avatar = ''
				await expect(this.offer.new(this.newOffer)).rejects.toEqual(Error('avatar is empty'))
				done()
			})
		})
	})
})

describe('getUsersReceivedOffers()', () => {

	beforeEach(async() => {
		this.userId = GenerateId()
		this.newOffer.item.user_id = this.userId
		this.newOffer.user.id = this.userId
		await this.offer.new(this.newOffer)
	})

	test('get users received offers should return offers objects', async done => {
		expect.assertions(3)
		const userOffers = await this.offer.getUsersReceivedOffers(this.userId)
		expect(typeof userOffers).toBe('object')
		expect(userOffers.length).toBe(1)
		expect(userOffers[0].user_id).toBe(this.userId)
		done()
	})

	test('get users received offers for user with no offers should return empty objects', async done => {
		expect.assertions(1)
		const userOffers = await this.offer.getUsersReceivedOffers(GenerateId(0))
		expect(userOffers.length).toBe(0)
		done()
	})

	test('get users received offers should return multiple offers objects', async done => {
		expect.assertions(2)
		this.newOffer.item.id = GenerateId()
		await this.offer.new(this.newOffer)
		const userOffers = await this.offer.getUsersReceivedOffers(this.userId)
		expect(typeof userOffers).toBe('object')
		expect(userOffers.length).toBe(2)
		done()
	})
})

describe('reject()', () => {

	beforeEach(async() => {
		this.offerId = await this.offer.new(this.newOffer)
	})

	test('reject with valid offerId should delete offer for user', async done => {
		expect.assertions(2)
		expect(await this.offer.reject(this.offerId)).toBe(true)
		const userOffers = await this.offer.getUsersReceivedOffers(this.userId)
		expect(userOffers.length).toBe(0)
		done()
	})

	test('reject with no offerId should error', async done => {
		expect.assertions(1)
		await expect(this.offer.reject()).rejects.toEqual(Error('offerId is empty'))
		done()
	})

	test('reject with empty offerId should error', async done => {
		expect.assertions(1)
		await expect(this.offer.reject('')).rejects.toEqual(Error('offerId is empty'))
		done()
	})
})
