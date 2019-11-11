'use strict'

/* IMPORT TEST */
const Item = require('../modules/item')

const GenerateId = require('../../../utils/generateId')

/* MOCK POSTGRES */
jest.mock('pg')

beforeEach( async() => {
	this.item = await new Item()
})

describe('new()', () => {

	test('add new item with valid data', async done => {
		expect.assertions(2)
		const newItem = {name: 'test', description: 'testing', userId: GenerateId()}
		const newItemId = await this.item.new(newItem)
		expect(typeof newItemId).toBe('string')
		expect(newItemId.length).toBe(36)
		done()
	})

	test('add new item with no name object should error', async done => {
		expect.assertions(1)
		const newItem = {description: 'testing', userId: GenerateId()}
		await expect(this.item.new(newItem)).rejects.toEqual(Error('name is empty'))
		done()
	})

	test('add new item with empty name should error', async done => {
		expect.assertions(1)
		const newItem = {name: '', description: 'testing', userId: GenerateId()}
		await expect(this.item.new(newItem)).rejects.toEqual(Error('name is empty'))
		done()
	})

	test('add new item with no description object should error', async done => {
		expect.assertions(1)
		const newItem = {name: 'test', userId: GenerateId()}
		await expect(this.item.new(newItem)).rejects.toEqual(Error('description is empty'))
		done()
	})

	test('add new item with empty description should error', async done => {
		expect.assertions(1)
		const newItem = {name: 'test', description: '', userId: GenerateId()}
		await expect(this.item.new(newItem)).rejects.toEqual(Error('description is empty'))
		done()
	})

	test('add new item with no userId object should error', async done => {
		expect.assertions(1)
		const newItem = {name: 'test', description: 'testing'}
		await expect(this.item.new(newItem)).rejects.toEqual(Error('userId is empty'))
		done()
	})

	test('add new item with empty userId should error', async done => {
		expect.assertions(1)
		const newItem = {name: 'test', description: 'testing', userId: ''}
		await expect(this.item.new(newItem)).rejects.toEqual(Error('userId is empty'))
		done()
	})
})
