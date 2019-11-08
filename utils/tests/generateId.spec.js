'use strict'

/* IMPORT TEST */
const GenerateId = require('../generateId')

describe('GenerateId()', () => {

	test('Type should be function', async done => {
		expect.assertions(1)
		expect(typeof GenerateId).toBe('function')
		done()
	})

	test('Returned ID should be type string', async done => {
		expect.assertions(1)
		expect(typeof GenerateId()).toBe('string')
		done()
	})

	test('Returned ID should be length 14', async done => {
		expect.assertions(1)
		expect(GenerateId().length).toBe(36)
		done()
	})

	test('Returned ID should be unique', async done => {
		expect.assertions(1)
		const id1 = GenerateId()
		const id2 = GenerateId()
		expect(id1).not.toBe(id2)
		done()
	})
})
