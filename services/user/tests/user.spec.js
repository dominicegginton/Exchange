'use strict'

/* IMPORT TEST */
const Users = require('../modules/user')

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
		await expect(this.user.register(newUser)).rejects.toEqual(Error('user already exists'))
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
