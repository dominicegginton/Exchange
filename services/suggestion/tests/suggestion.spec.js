'use strict'

/* IMPORT TEST */
const Suggestion = require('../modules/suggestion')

/* IMPORT MODULES */
const Nodemailer = require('nodemailer')
const GenerateId = require('../../../utils/generateId')

/* MOCK MODULES */
jest.mock('pg')
jest.mock('nodemailer')

beforeEach(async() => {
	this.suggestion = await new Suggestion()
	this.transporter = Nodemailer.createTransport()
	this.userId = GenerateId()
	this.itemId = GenerateId()
	this.suggestedUserId = GenerateId()
	this.suggestedItemId = GenerateId()
	this.newSuggestion = {
		item: {
			id: this.itemId,
			name: 'test',
			description: 'testing',
			image: 'testing',
			user_id: this.userId
		},
		wishlist_item: {
			id: GenerateId(),
			name: 'test',
			description: 'testing',
			item_id: this.itemId,
			user_id: this.userId
		},
		user: {
			id: this.userId,
			name: 'test user',
			email: 'test@testing.com',
			avatar: 'test'
		},
		suggested_item: {
			id: this.suggestedItemId,
			name: 'test',
			description: 'testing',
			image: 'testing',
			user_id: this.suggestedUserId
		},
		suggested_wishlist_item: {
			id: GenerateId(),
			name: 'test',
			description: 'testing',
			item_id: this.suggestedItemId,
			user_id: this.suggestedUserId
		},
		suggested_user: {
			id: this.suggestedUserId,
			name: 'test user',
			email: 'test@testing.com',
			avatar: 'test'
		},
	}
})

afterEach(async() => {
	this.suggestion.tearDown()
})

describe('new()', () => {

	test('add new suggestion with valid data', async done => {
		expect.assertions(3)
		const newSuggestionId = await this.suggestion.new(this.newSuggestion)
		expect(typeof newSuggestionId).toBe('string')
		expect(newSuggestionId.length).toBe(36)
		expect(this.transporter.sendMail).toHaveBeenCalled()
		done()
	})

	test('add new duplicate suggestion should return original suggestion_id', async done => {
		expect.assertions(5)
		const newSuggestionId = await this.suggestion.new(this.newSuggestion)
		expect(typeof newSuggestionId).toBe('string')
		expect(newSuggestionId.length).toBe(36)
		const newSuggestionIdDuplicate = await this.suggestion.new(this.newSuggestion)
		expect(typeof newSuggestionIdDuplicate).toBe('string')
		expect(newSuggestionIdDuplicate.length).toBe(36)
		expect(newSuggestionId).toBe(newSuggestionIdDuplicate)
		done()
	})

	test('add new suggestion for own item should error', async done => {
		expect.assertions(1)
		this.newSuggestion.suggested_item.user_id = this.newSuggestion.item.user_id
		await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(
			Error('can not create suggestion for own item'))
		done()
	})

	describe('data validation', () => {
		describe('item object', () => {
			test('no item object should error', async done => {
				delete this.newSuggestion.item
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('item is empty'))
				done()
			})
			test('no item id object should error', async done => {
				delete this.newSuggestion.item.id
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('id is empty'))
				done()
			})
			test('empty item id object should error', async done => {
				this.newSuggestion.item.id = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('id is empty'))
				done()
			})
			test('no item name object should error', async done => {
				delete this.newSuggestion.item.name
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('name is empty'))
				done()
			})
			test('empty item name object should error', async done => {
				this.newSuggestion.item.name = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('name is empty'))
				done()
			})
			test('no item description object should error', async done => {
				delete this.newSuggestion.item.description
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('description is empty'))
				done()
			})
			test('empty item description object should error', async done => {
				this.newSuggestion.item.description = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('description is empty'))
				done()
			})
			test('no item image object should error', async done => {
				delete this.newSuggestion.item.image
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('image is empty'))
				done()
			})
			test('empty item image object should error', async done => {
				this.newSuggestion.item.image = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('image is empty'))
				done()
			})
			test('no item user_id object should error', async done => {
				delete this.newSuggestion.item.user_id
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('user_id is empty'))
				done()
			})
			test('empty item user_id object should error', async done => {
				this.newSuggestion.item.user_id = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('user_id is empty'))
				done()
			})
		})
		describe('wishlist_item object', () => {
			test('no wishlist_item object should error', async done => {
				delete this.newSuggestion.wishlist_item
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('wishlist_item is empty'))
				done()
			})
			test('no wishlist_item id object should error', async done => {
				delete this.newSuggestion.wishlist_item.id
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('id is empty'))
				done()
			})
			test('empty wishlist_item id object should error', async done => {
				this.newSuggestion.wishlist_item.id = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('id is empty'))
				done()
			})
			test('no wishlist_item name object should error', async done => {
				delete this.newSuggestion.wishlist_item.name
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('name is empty'))
				done()
			})
			test('empty wishlist_item name object should error', async done => {
				this.newSuggestion.wishlist_item.name = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('name is empty'))
				done()
			})
			test('no wishlist_item description object should error', async done => {
				delete this.newSuggestion.wishlist_item.description
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('description is empty'))
				done()
			})
			test('empty wishlist_item description object should error', async done => {
				this.newSuggestion.wishlist_item.description = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('description is empty'))
				done()
			})
			test('no wishlist_item item_id object should error', async done => {
				delete this.newSuggestion.wishlist_item.item_id
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('item_id is empty'))
				done()
			})
			test('empty wishlist_item item_id object should error', async done => {
				this.newSuggestion.wishlist_item.item_id = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('item_id is empty'))
				done()
			})
			test('no wishlist_item user_id object should error', async done => {
				delete this.newSuggestion.wishlist_item.user_id
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('user_id is empty'))
				done()
			})
			test('empty wishlist_item user_id object should error', async done => {
				this.newSuggestion.wishlist_item.user_id = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('user_id is empty'))
				done()
			})
		})
		describe('user object', () => {
			test('no user object should error', async done => {
				delete this.newSuggestion.user
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('user is empty'))
				done()
			})
			test('no user id object should error', async done => {
				delete this.newSuggestion.user.id
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('id is empty'))
				done()
			})
			test('empty user id object should error', async done => {
				this.newSuggestion.user.id = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('id is empty'))
				done()
			})
			test('no user name object should error', async done => {
				delete this.newSuggestion.user.name
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('name is empty'))
				done()
			})
			test('empty user name object should error', async done => {
				this.newSuggestion.user.name = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('name is empty'))
				done()
			})
			test('no user email object should error', async done => {
				delete this.newSuggestion.user.email
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('email is empty'))
				done()
			})
			test('empty user email object should error', async done => {
				this.newSuggestion.user.email = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('email is empty'))
				done()
			})
			test('no user avatar object should error', async done => {
				delete this.newSuggestion.user.avatar
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('avatar is empty'))
				done()
			})
			test('empty user avatar object should error', async done => {
				this.newSuggestion.user.avatar = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('avatar is empty'))
				done()
			})
		})
		describe('suggested_item object', () => {
			test('no suggested_item object should error', async done => {
				delete this.newSuggestion.suggested_item
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('suggested_item is empty'))
				done()
			})
			test('no suggested_item id object should error', async done => {
				delete this.newSuggestion.suggested_item.id
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('id is empty'))
				done()
			})
			test('empty suggested_item id object should error', async done => {
				this.newSuggestion.suggested_item.id = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('id is empty'))
				done()
			})
			test('no suggested_item name object should error', async done => {
				delete this.newSuggestion.suggested_item.name
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('name is empty'))
				done()
			})
			test('empty suggested_item name object should error', async done => {
				this.newSuggestion.suggested_item.name = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('name is empty'))
				done()
			})
			test('no suggested_item description object should error', async done => {
				delete this.newSuggestion.suggested_item.description
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('description is empty'))
				done()
			})
			test('empty suggested_item description object should error', async done => {
				this.newSuggestion.suggested_item.description = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('description is empty'))
				done()
			})
			test('no suggested_item image object should error', async done => {
				delete this.newSuggestion.suggested_item.image
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('image is empty'))
				done()
			})
			test('empty suggested_item image object should error', async done => {
				this.newSuggestion.suggested_item.image = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('image is empty'))
				done()
			})
			test('no suggested_item user_id object should error', async done => {
				delete this.newSuggestion.suggested_item.user_id
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('user_id is empty'))
				done()
			})
			test('empty suggested_item user_id object should error', async done => {
				this.newSuggestion.suggested_item.user_id = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('user_id is empty'))
				done()
			})
		})
		describe('suggested_wishlist_item object', () => {
			test('no suggested_wishlist_item object should error', async done => {
				delete this.newSuggestion.suggested_wishlist_item
				await expect(this.suggestion.new(this.newSuggestion)).rejects
					.toEqual(Error('suggested_wishlist_item is empty'))
				done()
			})
			test('no suggested_wishlist_item id object should error', async done => {
				delete this.newSuggestion.suggested_wishlist_item.id
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('id is empty'))
				done()
			})
			test('empty suggested_wishlist_item id object should error', async done => {
				this.newSuggestion.suggested_wishlist_item.id = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('id is empty'))
				done()
			})
			test('no suggested_wishlist_item name object should error', async done => {
				delete this.newSuggestion.suggested_wishlist_item.name
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('name is empty'))
				done()
			})
			test('empty suggested_wishlist_item name object should error', async done => {
				this.newSuggestion.suggested_wishlist_item.name = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('name is empty'))
				done()
			})
			test('no suggested_wishlist_item description object should error', async done => {
				delete this.newSuggestion.suggested_wishlist_item.description
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('description is empty'))
				done()
			})
			test('empty suggested_wishlist_item description object should error', async done => {
				this.newSuggestion.suggested_wishlist_item.description = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('description is empty'))
				done()
			})
			test('no suggested_wishlist_item item_id object should error', async done => {
				delete this.newSuggestion.suggested_wishlist_item.item_id
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('item_id is empty'))
				done()
			})
			test('empty suggested_wishlist_item item_id object should error', async done => {
				this.newSuggestion.suggested_wishlist_item.item_id = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('item_id is empty'))
				done()
			})
			test('no suggested_wishlist_item user_id object should error', async done => {
				delete this.newSuggestion.suggested_wishlist_item.user_id
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('user_id is empty'))
				done()
			})
			test('empty suggested_wishlist_item user_id object should error', async done => {
				this.newSuggestion.suggested_wishlist_item.user_id = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('user_id is empty'))
				done()
			})
		})
		describe('suggested_user object', () => {
			test('no suggested_user object should error', async done => {
				delete this.newSuggestion.suggested_user
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('suggested_user is empty'))
				done()
			})
			test('no suggested_user id object should error', async done => {
				delete this.newSuggestion.suggested_user.id
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('id is empty'))
				done()
			})
			test('empty suggested_user id object should error', async done => {
				this.newSuggestion.suggested_user.id = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('id is empty'))
				done()
			})
			test('no suggested_user name object should error', async done => {
				delete this.newSuggestion.suggested_user.name
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('name is empty'))
				done()
			})
			test('empty suggested_user name object should error', async done => {
				this.newSuggestion.suggested_user.name = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('name is empty'))
				done()
			})
			test('no suggested_user email object should error', async done => {
				delete this.newSuggestion.suggested_user.email
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('email is empty'))
				done()
			})
			test('empty suggested_user email object should error', async done => {
				this.newSuggestion.suggested_user.email = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('email is empty'))
				done()
			})
			test('no suggested_user avatar object should error', async done => {
				delete this.newSuggestion.suggested_user.avatar
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('avatar is empty'))
				done()
			})
			test('empty suggested_user avatar object should error', async done => {
				this.newSuggestion.suggested_user.avatar = ''
				await expect(this.suggestion.new(this.newSuggestion)).rejects.toEqual(Error('avatar is empty'))
				done()
			})
		})
	})
})

describe('getDetails()', () => {

	beforeEach(async() => {
		this.suggestionId = await this.suggestion.new(this.newSuggestion)
	})

	test('get details should return valid data for suggestion', async done => {
		expect.assertions(6)
		const suggestionDetails = await this.suggestion.getDetails(this.suggestionId)
		expect(suggestionDetails.item_id).toBe(this.newSuggestion.item.id)
		expect(suggestionDetails.user_id).toBe(this.newSuggestion.user.id)
		expect(suggestionDetails.wishlist_item_id).toBe(this.newSuggestion.wishlist_item.id)
		expect(suggestionDetails.suggested_item_id).toBe(this.newSuggestion.suggested_item.id)
		expect(suggestionDetails.suggested_user_id).toBe(this.newSuggestion.suggested_user.id)
		expect(suggestionDetails.suggested_wishlist_item_id).toBe(this.newSuggestion.suggested_wishlist_item.id)
		done()
	})

	test('get details with suggestion id that does not exist should error', async done => {
		expect.assertions(1)
		await expect(this.suggestion.getDetails(GenerateId())).rejects.toEqual(Error('suggestion does not exist'))
		done()
	})

	test('get details with no suggestion id should error', async done => {
		expect.assertions(1)
		await expect(this.suggestion.getDetails()).rejects.toEqual(Error('suggestionId is empty'))
		done()
	})

	test('get details with empty suggestion id should error', async done => {
		expect.assertions(1)
		await expect(this.suggestion.getDetails('')).rejects.toEqual(Error('suggestionId is empty'))
		done()
	})
})

describe('getSuggestions()', () => {

	beforeEach(async() => {
		this.itemId = GenerateId()
		this.newSuggestion.item.id = this.itemId
		await this.suggestion.new(this.newSuggestion)
	})

	test('get suggestion should return one suggestion for valid item id', async done => {
		expect.assertions(3)
		const itemSuggestions = await this.suggestion.getSuggestions(this.itemId)
		expect(typeof itemSuggestions).toBe('object')
		expect(itemSuggestions.length).toBe(1)
		expect(itemSuggestions[0].item_id).toBe(this.itemId)
		done()
	})

	test('get suggestion for item with no suggestions should return empty objects', async done => {
		expect.assertions(1)
		const itemSuggestions = await this.suggestion.getSuggestions(GenerateId())
		expect(itemSuggestions.length).toBe(0)
		done()
	})

	test('get suggestion should return multiple suggestion objects for item', async done => {
		expect.assertions(2)
		this.newSuggestion.suggested_item.id = GenerateId()
		await this.suggestion.new(this.newSuggestion)
		const itemSuggestions = await this.suggestion.getSuggestions(this.itemId)
		expect(typeof itemSuggestions).toBe('object')
		expect(itemSuggestions.length).toBe(2)
		done()
	})

	test('get suggestion should return correct item id for given item id', async done => {
		expect.assertions(3)
		const itemSuggestions = await this.suggestion.getSuggestions(this.suggestedItemId)
		expect(typeof itemSuggestions).toBe('object')
		expect(itemSuggestions.length).toBe(1)
		expect(itemSuggestions[0].item_id).toBe(this.suggestedItemId)
		done()
	})

	test('get suggestion with no itemId object should error', async done => {
		expect.assertions(1)
		await expect(this.suggestion.getSuggestions()).rejects.toEqual(Error('itemId is empty'))
		done()
	})

	test('get suggestion with empty itemId object should error', async done => {
		expect.assertions(1)
		await expect(this.suggestion.getSuggestions('')).rejects.toEqual(Error('itemId is empty'))
		done()
	})
})

describe('remove()', () => {

	beforeEach(async() => {
		this.suggestionId = await this.suggestion.new(this.newSuggestion)
	})

	test('remove should delete record of suggestion', async done => {
		expect.assertions(2)
		expect(await this.suggestion.remove(this.suggestionId)).toBe(true)
		const itemSuggestions = await this.suggestion.getSuggestions(this.itemId)
		expect(itemSuggestions.length).toBe(0)
		done()
	})

	test('remove with no suggestionId object should error', async done => {
		expect.assertions(1)
		await expect(this.suggestion.remove()).rejects.toEqual(Error('suggestionId is empty'))
		done()
	})

	test('remove with empty suggestionId object should error', async done => {
		expect.assertions(1)
		await expect(this.suggestion.remove('')).rejects.toEqual(Error('suggestionId is empty'))
		done()
	})
})

describe('delete()', () => {

	test('delete should delete record of suggestion', async done => {
		expect.assertions(2)
		expect(await this.suggestion.delete(this.suggestionId)).toBe(true)
		const itemSuggestions = await this.suggestion.getSuggestions(this.itemId)
		expect(itemSuggestions.length).toBe(0)
		done()
	})

	test('delete with no wishlistId object should error', async done => {
		expect.assertions(1)
		await expect(this.suggestion.delete()).rejects.toEqual(Error('wishlistId is empty'))
		done()
	})

	test('delete with empty wishlistId object should error', async done => {
		expect.assertions(1)
		await expect(this.suggestion.delete('')).rejects.toEqual(Error('wishlistId is empty'))
		done()
	})
})
