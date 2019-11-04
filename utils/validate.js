'use strict'

const validate = (object, validation) => {
	try {
		const objectKeys = Object.keys(object)
		const validator = (valid, key) => {
			if (!objectKeys.includes(key) || object[key].length === 0) throw Error(`${key} is empty`)
			valid = true
			return valid
		}
		return validation.reduce(validator, true)
	} catch (error) {
		throw error
	}
}

module.exports = validate
