'use strict'

/* IMPORT TEST */
const Validate = require('../validate')

describe('Validate()', () => {

	test('Type should be function', async done => {
		expect.assertions(1)
		expect(typeof Validate).toBe('function')
		done()
	})

	test('Valid object should return true', async done => {
		expect.assertions(1)
		const testObject = {first: '123', second: '456', third: '678'}
		expect(Validate(testObject, ['first', 'second', 'third'])).toBe(true)
		done()
	})

	test('Missing data from object should error', async done => {
		expect.assertions(1)
		const testObject = {first: '123', third: '789'}
		expect(() => {
			Validate(testObject, ['first', 'second', 'third'])
		}).toThrow(Error('second is empty'))
		done()
	})

	test('Empty data in object should error', async done => {
		expect.assertions(1)
		const testObject = {first: '', second: '456' ,third: '789'}
		expect(() => {
			Validate(testObject, ['first', 'second', 'third'])
		}).toThrow(Error('first is empty'))
		done()
	})
})
