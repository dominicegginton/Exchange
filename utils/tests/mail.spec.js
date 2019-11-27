'use strict'

/* IMPORT TEST */
const Mail = require('../mail')

/* IMPORT MODULES */
const Nodemailer = require('nodemailer')

/* MOCK MODULES */
jest.mock('nodemailer')

describe('Mail()', () => {

	test('Type should be function', async done => {
		expect.assertions(1)
		expect(typeof Mail).toBe('function')
		done()
	})

	test('missing to object should return error', async done => {
		expect.assertions(1)
		const newMail = {
			subject: 'Test Email',
			mail_template: 'new_mail',
			data: {}
		}
		expect(Mail(newMail)).rejects.toEqual(Error('to is empty'))
		done()
	})

	test('empty to object should return error', async done => {
		expect.assertions(1)
		const newMail = {
			to: '',
			subject: 'Test Email',
			mail_template: 'new_mail',
			data: {}
		}
		expect(Mail(newMail)).rejects.toEqual(Error('to is empty'))
		done()
	})

	test('missing subject object should return error', async done => {
		expect.assertions(1)
		const newMail = {
			to: 'test@testing.com',
			mail_template: 'new_mail',
			data: {}
		}
		expect(Mail(newMail)).rejects.toEqual(Error('subject is empty'))
		done()
	})

	test('empty subject object should return error', async done => {
		expect.assertions(1)
		const newMail = {
			to: 'test@testing.com',
			subject: '',
			mail_template: 'new_mail',
			data: {}
		}
		expect(Mail(newMail)).rejects.toEqual(Error('subject is empty'))
		done()
	})

	test('missing mail_template object should return error', async done => {
		expect.assertions(1)
		const newMail = {
			to: 'test@testing.com',
			subject: 'Test Email',
			data: {}
		}
		expect(Mail(newMail)).rejects.toEqual(Error('mail_template is empty'))
		done()
	})

	test('empty mail_template object should return error', async done => {
		expect.assertions(1)
		const newMail = {
			to: 'test@testing.com',
			subject: 'Test Email',
			mail_template: '',
			data: {}
		}
		expect(Mail(newMail)).rejects.toEqual(Error('mail_template is empty'))
		done()
	})

	test('should call nodemailer send mail', async done => {
		expect.assertions(1)
		const transporter = Nodemailer.createTransport()
		const newMail = {
			to: 'test@testing.com',
			subject: 'Test Email',
			mail_template: 'mail/offer_new',
			data: {offer: {offered_user: {name: 'test', email: 'test@testing.com'},
				offered_item: {name: 'Test Item'}, item: {name: 'Test Item 2'}}}
		}
		await Mail(newMail)
		expect(transporter.sendMail).toHaveBeenCalled()
		done()
	})
})
