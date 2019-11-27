'use strict'

const Nodemailer = require('nodemailer')
const Pug = require('koa-pug')
const Validate = require('./validate')

const mail = async(newMail) => {
	try {
		Validate(newMail, ['to', 'subject', 'mail_template'])
		const pug = new Pug({viewPath: './views'})
		const mail = {
			from: '"Exchange" <mail@exchange.com>',
			to: newMail.to,
			subject: newMail.subject,
			html: await pug.render(newMail.mail_template, newMail.data)
		}
		const transporter = Nodemailer.createTransport({service: 'gmail', port: 25, secure: true,
			auth: {user: process.env.EXCHANGE_GMAIL_USERNAME, pass: process.env.EXCHANGE_GMAIL_PASSWORD}
		})
		await transporter.sendMail(mail)
	} catch (error) {
		throw error
	}
}

module.exports = mail
