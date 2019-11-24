'use strict'

/* IMPORT TEST */
const Item = require('../modules/item')

/* IMPORT MODULES */
const MockFS = require('mock-fs')
const Sharp = require('sharp')
const GenerateId = require('../../../utils/generateId')

/* MOCK MODULES */
jest.mock('pg')
jest.mock('sharp')

beforeEach( async() => {
	this.item = await new Item()
})

afterEach(async() => {
	this.item.tearDown()
})

describe('new()', () => {

	test('add new item with valid data', async done => {
		expect.assertions(2)
		const newItem = {name: 'test', description: 'testing', user_id: GenerateId()}
		const newItemId = await this.item.new(newItem)
		expect(typeof newItemId).toBe('string')
		expect(newItemId.length).toBe(36)
		done()
	})

	test('add new item with no name object should error', async done => {
		expect.assertions(1)
		const newItem = {description: 'testing', user_id: GenerateId()}
		await expect(this.item.new(newItem)).rejects.toEqual(Error('name is empty'))
		done()
	})

	test('add new item with empty name should error', async done => {
		expect.assertions(1)
		const newItem = {name: '', description: 'testing', user_id: GenerateId()}
		await expect(this.item.new(newItem)).rejects.toEqual(Error('name is empty'))
		done()
	})

	test('add new item with no description object should error', async done => {
		expect.assertions(1)
		const newItem = {name: 'test', user_id: GenerateId()}
		await expect(this.item.new(newItem)).rejects.toEqual(Error('description is empty'))
		done()
	})

	test('add new item with empty description should error', async done => {
		expect.assertions(1)
		const newItem = {name: 'test', description: '', user_id: GenerateId()}
		await expect(this.item.new(newItem)).rejects.toEqual(Error('description is empty'))
		done()
	})

	test('add new item with no userId object should error', async done => {
		expect.assertions(1)
		const newItem = {name: 'test', description: 'testing'}
		await expect(this.item.new(newItem)).rejects.toEqual(Error('user_id is empty'))
		done()
	})

	test('add new item with empty userId should error', async done => {
		expect.assertions(1)
		const newItem = {name: 'test', description: 'testing', user_id: ''}
		await expect(this.item.new(newItem)).rejects.toEqual(Error('user_id is empty'))
		done()
	})
})

describe('uploadImage()', () => {

	beforeEach(async() => {
		const newItem = {name: 'test', description: 'testing', user_id: GenerateId()}
		this.id = await this.item.new(newItem)
		MockFS({
			'data/images/': { /* EMPTY DIRECTORY */ },
			'test/': {
				'image1.png': Buffer.from([10, 4, 6, 7, 7, 9, 4]),
				'image2.jpeg': Buffer.from([54, 8, 5, 5, 7, 7, 9]),
				'image3.jpeg': Buffer.from([])
			}
		})
	})

	afterEach(() => {
		MockFS.restore()
	})

	test('upload image as valid PNG', async done => {
		expect.assertions(3)
		const fileName = await this.item.uploadImage(this.id, {path: 'test/image1.png', type: 'image/png'})
		expect(Sharp().resize).toHaveBeenCalledWith({width: 900, height: 500})
		expect(Sharp().png).toHaveBeenCalled()
		expect(Sharp().toFile).toHaveBeenCalledWith(`data/images/${fileName}`)
		done()
	})

	test('upload image as valid JPEG', async done => {
		expect.assertions(3)
		const fileName = await this.item.uploadImage(this.id, {path: 'test/image2.jpeg', type: 'image/jpeg'})
		expect(Sharp().resize).toHaveBeenCalledWith({width: 900, height: 500})
		expect(Sharp().png).toHaveBeenCalled()
		expect(Sharp().toFile).toHaveBeenCalledWith(`data/images/${fileName}`)
		done()
	})
	test('upload image with size of 0 should error', async done => {
		expect.assertions(1)
		await expect(
			this.item.uploadImage(this.id, {path: 'test/image3.jpeg', type: 'image/jpeg'})
		).rejects.toEqual(Error('image size too small'))
		done()
	})

	test('upload image where path does not exist should error', async done => {
		expect.assertions(1)
		await expect(
			this.item.uploadImage(this.id, {path: 'test/image4.jpeg', type: 'image/jpeg'})
		).rejects.toEqual(Error('image not found'))
		done()
	})

	test('upload image with no path should error', async done => {
		expect.assertions(1)
		await expect(
			this.item.uploadImage(this.id,{type: 'image/png'})
		).rejects.toEqual(Error('path is empty'))
		done()
	})

	test('upload image with empty path should error', async done => {
		expect.assertions(1)
		await expect(
			this.item.uploadImage(this.id,{path: '', type: 'image/png'})
		).rejects.toEqual(Error('path is empty'))
		done()
	})

	test('upload image with no type should error', async done => {
		expect.assertions(1)
		await expect(
			this.item.uploadImage(this.id,{path: 'test/image1.png'})
		).rejects.toEqual(Error('type is empty'))
		done()
	})

	test('upload image with empty type should error', async done => {
		expect.assertions(1)
		await expect(
			this.item.uploadImage(this.id,{path: 'test/image1.png', type: ''})
		).rejects.toEqual(Error('type is empty'))
		done()
	})
})

describe('getDetails()', () => {

	beforeEach(async() => {
		const newItem = {name: 'test', description: 'testing', user_id: GenerateId()}
		this.item_id = await this.item.new(newItem)
	})

	test('get details for valid item', async done => {
		expect.assertions(6)
		const itemDetails = await this.item.getDetails(this.item_id)
		expect(typeof itemDetails).toBe('object')
		expect(itemDetails.name).toBe('test')
		expect(itemDetails.description).toBe('testing')
		expect(typeof itemDetails.user_id).toBe('string')
		expect(itemDetails.user_id.length).toBe(36)
		expect(itemDetails.image).toBe(null)
		done()
	})

	test('get details for valid user when more than one user is registered', async done => {
		expect.assertions(6)
		const newItem = {name: 'foo', description: 'testing another item', user_id: GenerateId()}
		const newItemId = await this.item.new(newItem)
		const itemDetails = await this.item.getDetails(newItemId)
		expect(typeof itemDetails).toBe('object')
		expect(itemDetails.name).toBe('foo')
		expect(itemDetails.description).toBe('testing another item')
		expect(typeof itemDetails.user_id).toBe('string')
		expect(itemDetails.user_id.length).toBe(36)
		expect(itemDetails.image).toBe(null)
		done()
	})

	test('get details for invalid item id should error', async done => {
		expect.assertions(1)
		await expect(this.item.getDetails('invalid-id')).rejects.toEqual(Error('Invalid item id'))
		done()
	})
})

describe('getUsersItems()', () => {

	beforeEach(async() => {
		this.user_id = GenerateId()
	})

	test('get users items should return valid item', async done => {
		expect.assertions(6)
		const newItem = {name: 'test', description: 'testing', user_id: this.user_id}
		const newItemId = await this.item.new(newItem)
		const userItems = await this.item.getUsersItems(this.user_id)
		expect(userItems.length).toBe(1)
		expect(typeof userItems[0]).toBe('object')
		expect(userItems[0].id).toBe(newItemId)
		expect(userItems[0].name).toBe('test')
		expect(userItems[0].description).toBe('testing')
		expect(userItems[0].user_id).toBe(this.user_id)
		done()
	})

	test('get users items should return valid items', async done => {
		expect.assertions(1)
		const newItem1 = {name: 'test', description: 'testing', user_id: this.user_id}
		const newItem2 = {name: 'foo', description: 'foo testing', user_id: this.user_id}
		await this.item.new(newItem1)
		await this.item.new(newItem2)
		const userItems = await this.item.getUsersItems(this.user_id)
		expect(userItems.length).toBe(2)
		done()
	})

	test('get users items should return empty array for user with no items', async done => {
		expect.assertions(1)
		const userItems = await this.item.getUsersItems(this.user_id)
		expect(userItems.length).toBe(0)
		done()
	})
})

describe('getItems()', () => {

	beforeEach(async() => {
		const newItem1 = {name: 'Test', description: 'This is a new item', user_id: this.user_id}
		const newItem2 = {name: 'Foo', description: 'This is a old item', user_id: this.user_id}
		const newItem3 = {name: 'Boo', description: 'This is a good item', user_id: this.user_id}
		await this.item.new(newItem1)
		await this.item.new(newItem2)
		await this.item.new(newItem3)
	})

	test('no search object should return all items', async done => {
		const items = await this.item.getItems()
		expect(items.length).toBe(3)
		done()
	})

	test('empty search object should return all items', async done => {
		const items = await this.item.getItems('')
		expect(items.length).toBe(3)
		done()
	})

	test('search for string in title should return objects', async done => {
		const items = await this.item.getItems('foo')
		expect(items.length).toBe(1)
		expect(items[0].name).toBe('Foo')
		expect(items[0].description).toBe('This is a old item')
		expect(items[0].user_id).toBe(this.user_id)
		done()
	})

	test('search for string that matches a item twice should return no duplicates', async done => {
		const items = await this.item.getItems('Boo boo')
		expect(items.length).toBe(1)
		expect(items[0].name).toBe('Boo')
		expect(items[0].description).toBe('This is a good item')
		expect(items[0].user_id).toBe(this.user_id)
		done()
	})

	test('search for string should be able to return multipul objects', async done => {
		const items = await this.item.getItems('test boo')
		expect(items.length).toBe(2)
		expect(items[0].name).toBe('Test')
		expect(items[0].description).toBe('This is a new item')
		expect(items[0].user_id).toBe(this.user_id)
		expect(items[1].name).toBe('Boo')
		expect(items[1].description).toBe('This is a good item')
		expect(items[1].user_id).toBe(this.user_id)
		done()
	})
})
