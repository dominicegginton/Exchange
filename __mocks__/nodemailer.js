'use strict'

const createTransport = () => transport

const transport = {
	sendMail: jest.fn().mockReturnThis()
}

module.exports.createTransport = createTransport
