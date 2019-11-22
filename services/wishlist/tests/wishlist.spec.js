'use strict'

/* IMPORT TEST */
const Wishlist = require('../modules/wishlist')

/* IMPORT MODULES */
const GenerateId = require('../../../utils/generateId')

/* MOCK MODULES */
jest.mock('pg')

beforeEach( async() => {
	this.wishlist = await new Wishlist()
	this.itemId = GenerateId()
})

afterEach(async() => {
	this.wishlist.tearDown()
})

describe('new()', () => {

	test('add new wishlist item with valid data', async done => {
		expect.assertions(2)
		const newItem = {name: 'test', description: 'testing', item_id: GenerateId(), user_id: GenerateId()}
		const newItemId = await this.wishlist.new(newItem)
		expect(typeof newItemId).toBe('string')
		expect(newItemId.length).toBe(36)
		done()
	})

	test('add new wishlist item with no name object should error', async done => {
		expect.assertions(1)
		const newItem = {description: 'testing', item_id: this.itemId, user_id: GenerateId()}
		await expect(this.wishlist.new(newItem)).rejects.toEqual(Error('name is empty'))
		done()
	})

	test('add new wishlist item with empty name should error', async done => {
		expect.assertions(1)
		const newItem = {name: '', description: 'testing', item_id: this.itemId, user_id: GenerateId()}
		await expect(this.wishlist.new(newItem)).rejects.toEqual(Error('name is empty'))
		done()
	})

	test('add new wishlist item with no description object should error', async done => {
		expect.assertions(1)
		const newItem = {name: 'test', item_id: this.itemId, user_id: GenerateId()}
		await expect(this.wishlist.new(newItem)).rejects.toEqual(Error('description is empty'))
		done()
	})

	test('add new wishlist item with empty description should error', async done => {
		expect.assertions(1)
		const newItem = {name: 'test', description: '', item_id: this.itemId, user_id: GenerateId()}
		await expect(this.wishlist.new(newItem)).rejects.toEqual(Error('description is empty'))
		done()
	})

	test('add new wishlist item with no itemId object should error', async done => {
		expect.assertions(1)
		const newItem = {name: 'test', description: 'testing', user_id: GenerateId()}
		await expect(this.wishlist.new(newItem)).rejects.toEqual(Error('item_id is empty'))
		done()
	})

	test('add new wishlist item with empty itemId should error', async done => {
		expect.assertions(1)
		const newItem = {name: 'test', description: 'testing', item_id: '', user_id: GenerateId()}
		await expect(this.wishlist.new(newItem)).rejects.toEqual(Error('item_id is empty'))
		done()
	})

	test('add new wishlist item with no userId object should error', async done => {
		expect.assertions(1)
		const newItem = {name: 'test', description: 'testing', item_id: GenerateId()}
		await expect(this.wishlist.new(newItem)).rejects.toEqual(Error('user_id is empty'))
		done()
	})

	test('add new wishlist item with empty userId should error', async done => {
		expect.assertions(1)
		const newItem = {name: 'test', description: 'testing', item_id: GenerateId(), user_id: ''}
		await expect(this.wishlist.new(newItem)).rejects.toEqual(Error('user_id is empty'))
		done()
	})
})

describe('delete()', () => {

	beforeEach(async() => {
		this.item_id = GenerateId()
		this.user_id = GenerateId()
		const newItem = {name: 'test', description: 'testing', item_id: this.item_id, user_id: this.user_id}
		this.wishlist_item_id = await this.wishlist.new(newItem)
	})

	test('delete valid wishlist item should return true', async done => {
		expect.assertions(1)
		const deleteItem = {wishlist_item_id: this.wishlist_item_id, user_id: this.user_id}
		expect(await this.wishlist.delete(deleteItem)).toBe(true)
		done()
	})

	test('delete wishlist item with no itemId object should error', async done => {
		expect.assertions(1)
		const deleteItem = {user_id: this.user_id}
		await expect(this.wishlist.delete(deleteItem)).rejects.toEqual(Error('wishlist_item_id is empty'))
		done()
	})

	test('delete wishlist item with empty itemId should error', async done => {
		expect.assertions(1)
		const deleteItem = {wishlist_item_id: '', user_id: this.user_id}
		await expect(this.wishlist.delete(deleteItem)).rejects.toEqual(Error('wishlist_item_id is empty'))
		done()
	})

	test('delete wishlist item with no userId object should error', async done => {
		expect.assertions(1)
		const deleteItem = {wishlist_item_id: this.wishlist_item_id}
		await expect(this.wishlist.delete(deleteItem)).rejects.toEqual(Error('user_id is empty'))
		done()
	})

	test('delete wishlist item with empty userId should error', async done => {
		expect.assertions(1)
		const deleteItem = {wishlist_item_id: this.wishlist_item_id, user_id: ''}
		await expect(this.wishlist.delete(deleteItem)).rejects.toEqual(Error('user_id is empty'))
		done()
	})

	test('delete wishlist item that does not belong to user should error', async done => {
		expect.assertions(1)
		const deleteItem = {wishlist_item_id: this.wishlist_item_id, user_id: GenerateId()}
		await expect(this.wishlist.delete(deleteItem)).rejects.toEqual(Error('user does not own wishlist item'))
		done()
	})
})

describe('getItems()', () => {

	beforeEach(async() => {
		this.item_id = GenerateId()
		this.user_id = GenerateId()
	})

	test('get wishlist items should return valid item', async done => {
		expect.assertions(7)
		const newItem = {name: 'test', description: 'testing', item_id: this.item_id, user_id: this.user_id}
		const newItemId = await this.wishlist.new(newItem)
		const wishlistItems = await this.wishlist.getItems(this.item_id)
		expect(wishlistItems.length).toBe(1)
		expect(typeof wishlistItems[0]).toBe('object')
		expect(wishlistItems[0].id).toBe(newItemId)
		expect(wishlistItems[0].name).toBe('test')
		expect(wishlistItems[0].description).toBe('testing')
		expect(wishlistItems[0].item_id).toBe(this.item_id)
		expect(wishlistItems[0].user_id).toBe(this.user_id)
		done()
	})

	test('get wishlist items should return valid items', async done => {
		expect.assertions(1)
		const newItem1 = {name: 'test', description: 'testing', item_id: this.item_id, user_id: this.user_id}
		const newItem2 = {name: 'foo', description: 'foo testing', item_id: this.item_id, user_id: this.user_id}
		await this.wishlist.new(newItem1)
		await this.wishlist.new(newItem2)
		const wishlistItems = await this.wishlist.getItems(this.item_id)
		expect(wishlistItems.length).toBe(2)
		done()
	})

	test('get wishlist items should return empty array for item with no wish list', async done => {
		expect.assertions(1)
		const wishlistItems = await this.wishlist.getItems(this.item_id)
		expect(wishlistItems.length).toBe(0)
		done()
	})
})
