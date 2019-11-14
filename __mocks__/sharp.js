'use strict'

const sharp = {
	resize: jest.fn().mockReturnThis(),
  	png: jest.fn().mockReturnThis(),
  	toFile: jest.fn().mockReturnThis()
}

module.exports = jest.fn(() => sharp)
