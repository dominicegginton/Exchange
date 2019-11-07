'use strict'

/* IMPORT TEST */
const Users = require('../modules/user')

/* IMPORT MODULES */
const MockFS = require('mock-fs')
const FileSystem = require('fs-extra')

/* MOCK POSTGRES */
jest.mock('pg')

beforeEach( async() => {
	this.user = await new Users()
})

describe('register()', () => {

	test('register with valid user data', async done => {
		expect.assertions(2)
		const newUser = {name: 'Test', email: 'test@testing.com', password: 'password'}
		const newUserID = await this.user.register(newUser)
		expect(typeof newUserID).toBe('string')
		expect(newUserID.length).toBe(36)
		done()
	})

	test('register with duplicate email should error', async done => {
		expect.assertions(3)
		const newUser = {name: 'Test', email: 'test@testing.com', password: 'password'}
		const newUserID = await this.user.register(newUser)
		expect(typeof newUserID).toBe('string')
		expect(newUserID.length).toBe(36)
		await expect(this.user.register(newUser)).rejects.toEqual(Error('Email "test@testing.com" already registered'))
		done()
	})

	test('register with no name should error', async done => {
		expect.assertions(1)
		const newUser = {email: 'test@testing.com', password: 'password'}
		await expect(this.user.register(newUser)).rejects.toEqual(Error('name is empty'))
		done()
	})

	test('register with no email should error', async done => {
		expect.assertions(1)
		const newUser = {name: 'Test', password: 'password'}
		await expect(this.user.register(newUser)).rejects.toEqual(Error('email is empty'))
		done()
	})

	test('register with no password should error', async done => {
		expect.assertions(1)
		const newUser = {name: 'Test', email: 'test@testing.com'}
		await expect(this.user.register(newUser)).rejects.toEqual(Error('password is empty'))
		done()
	})
})

describe('login()', () => {

	beforeEach(async() => {
		const newUser = {name: 'Test', email: 'test@testing.com', password: 'password'}
		await this.user.register(newUser)
	})

	test('login with valid user data', async done => {
		expect.assertions(2)
		const userId = await this.user.login({email: 'test@testing.com', password: 'password'})
		expect(typeof userId).toBe('string')
		expect(userId.length).toBe(36)
		done()
	})

	test('login with invalid password should error', async done => {
		expect.assertions(1)
		await expect(this.user.login({email: 'test@testing.com', password: 'letmein'}))
			.rejects.toEqual(Error('Invalid password'))
		done()
	})

	test('login with invalid email should error', async done => {
		expect.assertions(1)
		await expect(this.user.login({email: 'random@testing.com', password: 'password'}))
			.rejects.toEqual(Error('Email "random@testing.com" is not registered'))
		done()
	})

	test('login with no email object should error', async done => {
		expect.assertions(1)
		await expect(this.user.login({password: 'password'})).rejects.toEqual(Error('email is empty'))
		done()
	})

	test('login with empty email should error', async done => {
		expect.assertions(1)
		await expect(this.user.login({email: '', password: 'password'})).rejects.toEqual(Error('email is empty'))
		done()
	})

	test('login with no password object should error', async done => {
		expect.assertions(1)
		await expect(this.user.login({email: 'test@testing.com'})).rejects.toEqual(Error('password is empty'))
		done()
	})

	test('login with empty password should error', async done => {
		expect.assertions(1)
		await expect(this.user.login({email: 'test@testing.com', password: ''}))
			.rejects.toEqual(Error('password is empty'))
		done()
	})
})

describe('uploadAvatar()', () => {

	beforeEach(async() => {
		const newUser = {name: 'Test', email: 'test@testing.com', password: 'password'}
		this.id = await this.user.register(newUser)
		MockFS({
			'data/avatars/': { /* EMPTY DIRECTORY */ },
			'test/': {
				'avatar1.png': Buffer.from([10, 4, 6, 7, 7, 9, 4]),
				'avatar2.jpeg': Buffer.from([54, 8, 5, 5, 7, 7, 9])
			}
		})
	})

	afterEach(() => {
		MockFS.restore()
	})

	test('upload valid PNG', async done => {
		expect.assertions(1)
		const fileName = await this.user.uploadAvatar(this.id, {path: 'test/avatar1.png', type: 'image/png', size: 1})
		expect(await FileSystem.exists(`data/avatars/${fileName}`)).toBe(true)
		done()
	})

	test('upload valid JPEG', async done => {
		expect.assertions(1)
		const fileName = await this.user.uploadAvatar(this.id, {path: 'test/avatar2.jpeg', type: 'image/jpeg', size: 1})
		expect(await FileSystem.exists(`data/avatars/${fileName}`)).toBe(true)
		done()
	})

	test('upload with size of 0 should return undefined', async done => {
		expect.assertions(1)
		const fileName = await this.user.uploadAvatar(this.id, {path: 'test/avatar2.jpeg', type: 'image/jpeg', size: 0})
		expect(typeof fileName).toBe('undefined')
		done()
	})

	test('upload with no path should error', async done => {
		expect.assertions(1)
		await expect(
			this.user.uploadAvatar(this.id,{type: 'image/png', size: 1})
		).rejects.toEqual(Error('path is empty'))
		done()
	})

	test('upload with no type should error', async done => {
		expect.assertions(1)
		await expect(
			this.user.uploadAvatar(this.id,{path: 'test/avatar1.png', size: 1})
		).rejects.toEqual(Error('type is empty'))
		done()
	})

	test('upload with no size should error', async done => {
		expect.assertions(1)
		await expect(
			this.user.uploadAvatar(this.id, {path: 'test/avatar2.jpeg', type: 'image/jpeg'})
		).rejects.toEqual(Error('size is empty'))
		done()
	})
})
