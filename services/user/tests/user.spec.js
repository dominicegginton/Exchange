'use strict'

/* IMPORT TEST */
const Users = require('../modules/user')

/* IMPORT MODULES */
const MockFS = require('mock-fs')
const Sharp = require('sharp')

/* MOCK MODULES */
jest.mock('pg')
jest.mock('sharp')

beforeEach( async() => {
	this.user = await new Users()
})

afterEach(async() => {
	this.user.tearDown()
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

	test('register with no name object should error', async done => {
		expect.assertions(1)
		const newUser = {email: 'test@testing.com', password: 'password'}
		await expect(this.user.register(newUser)).rejects.toEqual(Error('name is empty'))
		done()
	})

	test('register with empty name should error', async done => {
		expect.assertions(1)
		const newUser = {name: '', email: 'test@testing.com', password: 'password'}
		await expect(this.user.register(newUser)).rejects.toEqual(Error('name is empty'))
		done()
	})

	test('register with no email object should error', async done => {
		expect.assertions(1)
		const newUser = {name: 'Test', password: 'password'}
		await expect(this.user.register(newUser)).rejects.toEqual(Error('email is empty'))
		done()
	})

	test('register with empty email should error', async done => {
		expect.assertions(1)
		const newUser = {name: 'Test', email: '', password: 'password'}
		await expect(this.user.register(newUser)).rejects.toEqual(Error('email is empty'))
		done()
	})

	test('register with no password object should error', async done => {
		expect.assertions(1)
		const newUser = {name: 'Test', email: 'test@testing.com'}
		await expect(this.user.register(newUser)).rejects.toEqual(Error('password is empty'))
		done()
	})

	test('register with empty password should error', async done => {
		expect.assertions(1)
		const newUser = {name: 'Test', email: 'test@testing.com', password: ''}
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
				'avatar2.jpeg': Buffer.from([54, 8, 5, 5, 7, 7, 9]),
				'avatar3.jpeg': Buffer.from([])
			}
		})
	})

	afterEach(() => {
		MockFS.restore()
	})

	test('upload avatar image as valid PNG', async done => {
		expect.assertions(3)
		const fileName = await this.user.uploadAvatar(this.id, {path: 'test/avatar1.png', type: 'image/png'})
		expect(Sharp().resize).toHaveBeenCalledWith({width: 200, height: 200})
		expect(Sharp().png).toHaveBeenCalled()
		expect(Sharp().toFile).toHaveBeenCalledWith(`data/avatars/${fileName}`)
		done()
	})

	test('upload  avatar image as valid JPEG', async done => {
		expect.assertions(3)
		const fileName = await this.user.uploadAvatar(this.id, {path: 'test/avatar2.jpeg', type: 'image/jpeg'})
		expect(Sharp().resize).toHaveBeenCalledWith({width: 200, height: 200})
		expect(Sharp().png).toHaveBeenCalled()
		expect(Sharp().toFile).toHaveBeenCalledWith(`data/avatars/${fileName}`)
		done()
	})

	test('upload avatar image with size of 0 should error', async done => {
		expect.assertions(1)
		await expect(
			this.user.uploadAvatar(this.id, {path: 'test/avatar3.jpeg', type: 'image/jpeg'})
		).rejects.toEqual(Error('image size too small'))
		done()
	})

	test('upload avatar image where path does not exist should error', async done => {
		expect.assertions(1)
		await expect(
			this.user.uploadAvatar(this.id, {path: 'test/avatar4.jpeg', type: 'image/jpeg'})
		).rejects.toEqual(Error('image not found'))
		done()
	})

	test('upload avatar image with no path should error', async done => {
		expect.assertions(1)
		await expect(
			this.user.uploadAvatar(this.id,{type: 'image/png'})
		).rejects.toEqual(Error('path is empty'))
		done()
	})

	test('upload avatar image with empty path should error', async done => {
		expect.assertions(1)
		await expect(
			this.user.uploadAvatar(this.id,{path: '', type: 'image/png'})
		).rejects.toEqual(Error('path is empty'))
		done()
	})

	test('upload avatar image with no type should error', async done => {
		expect.assertions(1)
		await expect(
			this.user.uploadAvatar(this.id,{path: 'test/avatar1.png'})
		).rejects.toEqual(Error('type is empty'))
		done()
	})

	test('upload avatar image with empty type should error', async done => {
		expect.assertions(1)
		await expect(
			this.user.uploadAvatar(this.id,{path: 'test/avatar1.png', type: ''})
		).rejects.toEqual(Error('type is empty'))
		done()
	})
})

describe('getDetails()', () => {

	beforeEach(async() => {
		const newUser = {name: 'Test', email: 'test@testing.com', password: 'password'}
		this.userId = await this.user.register(newUser)
	})

	test('get details for valid user', async done => {
		expect.assertions(4)
		const userDetails = await this.user.getDetails(this.userId)
		expect(typeof userDetails).toBe('object')
		expect(userDetails.name).toBe('Test')
		expect(userDetails.email).toBe('test@testing.com')
		expect(userDetails.avatar).toBe(null)
		done()
	})

	test('get details for valid user when more than one user is registered', async done => {
		expect.assertions(4)
		const newUser = {name: 'Foo', email: 'foo@testing.com', password: 'password'}
		const newUserId = await this.user.register(newUser)
		const userDetails = await this.user.getDetails(newUserId)
		expect(typeof userDetails).toBe('object')
		expect(userDetails.name).toBe('Foo')
		expect(userDetails.email).toBe('foo@testing.com')
		expect(userDetails.avatar).toBe(null)
		done()
	})

	test('get details for invalid user id should error', async done => {
		expect.assertions(1)
		await expect(this.user.getDetails('invlaid-id')).rejects.toEqual(Error('Invalid user id'))
		done()
	})
})
