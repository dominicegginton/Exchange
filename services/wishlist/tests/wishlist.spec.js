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
