'use strict'

/* IMPORT TEST */
const Item = require('../modules/item')

/* IMPORT MODULES */
const MockFS = require('mock-fs')
const FileSystem = require('fs-extra')
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

describe('uploadImage()', () => {

	beforeEach(async() => {
		const newItem = {name: 'test', description: 'testing', userId: GenerateId()}
		this.id = await this.item.new(newItem)
		MockFS({
			'data/images/': { /* EMPTY DIRECTORY */ },
			'test/': {
				'image1.png': Buffer.from([10, 4, 6, 7, 7, 9, 4]),
				'image2.jpeg': Buffer.from([54, 8, 5, 5, 7, 7, 9])
			}
		})
	})

	afterEach(() => {
		MockFS.restore()
	})

	test('upload valid PNG', async done => {
		expect.assertions(1)
		const fileName = await this.item.uploadImage(this.id, {path: 'test/image1.png', type: 'image/png', size: 1})
		expect(await FileSystem.exists(`data/images/${fileName}`)).toBe(true)
		done()
	})

	test('upload valid JPEG', async done => {
		expect.assertions(1)
		const fileName = await this.item.uploadImage(this.id, {path: 'test/image2.jpeg', type: 'image/jpeg', size: 1})
		expect(await FileSystem.exists(`data/images/${fileName}`)).toBe(true)
		done()
	})

	test('upload with size of 0 should return undefined', async done => {
		expect.assertions(1)
		const fileName = await this.item.uploadImage(this.id, {path: 'test/image2.jpeg', type: 'image/jpeg', size: 0})
		expect(typeof fileName).toBe('undefined')
		done()
	})

	test('upload with no path should error', async done => {
		expect.assertions(1)
		await expect(
			this.item.uploadImage(this.id,{type: 'image/png', size: 1})
		).rejects.toEqual(Error('path is empty'))
		done()
	})

	test('upload with no type should error', async done => {
		expect.assertions(1)
		await expect(
			this.item.uploadImage(this.id,{path: 'test/avatar1.png', size: 1})
		).rejects.toEqual(Error('type is empty'))
		done()
	})

	test('upload with no size should error', async done => {
		expect.assertions(1)
		await expect(
			this.item.uploadImage(this.id, {path: 'test/avatar2.jpeg', type: 'image/jpeg'})
		).rejects.toEqual(Error('size is empty'))
		done()
	})
})
