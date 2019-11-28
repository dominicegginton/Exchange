'use strict'

const Puppeteer = require('puppeteer')
const Shell = require('shelljs')
const { configureToMatchImageSnapshot } = require('jest-image-snapshot')

const viewport = {
	width: 1500,
	height: 2000
}

const toMatchImageSnapshot = configureToMatchImageSnapshot({
	customDiffConfig: { threshold: 2 },
	noColors: true,
})
expect.extend({ toMatchImageSnapshot })

beforeAll( async() => {
	this.browser = await Puppeteer.launch({headless: true})
	this.page = await this.browser.newPage()
	this.page.emulate({
		viewport: viewport,
		userAgent: ''
	})
})

afterAll( async() => {
	this.browser.close()
	await Shell.exec('./scripts/clean_acceptance_tests')
})

beforeEach(async() => {
	await Shell.exec('./scripts/before_each_acceptance_tests')
	await this.page.waitFor(2000)
	this.testUserOne = {
		name: 'Foo',
		email: 'foo@testing.com',
		password: 'password',
		avatar: './acceptance/media/avatar_blue.png'
	}
	this.testUserTwo = {
		name: 'Boo',
		email: 'boo@testing.com',
		password: 'letmein',
		avatar: './acceptance/media/avatar_orange.png'
	}
	this.testItemOne = {
		name: 'Sofa',
		description: 'Sofa test item',
		image: './acceptance/media/sofa.jpg',
		wishlistItem: {
			name: 'Record',
			description: 'Test record wishlist item'
		}
	}
	this.testItemTwo = {
		name: 'Record Player',
		description: 'Record player test item',
		image: './acceptance/media/record_player.jpg',
		wishlistItem: {
			name: 'Sofa',
			description: 'Test sofa wishlist item'
		}
	}
})

afterEach(async() => {
	await this.page.goto('http://localhost:4040/user/logout', { timeout: 30000, waitUntil: 'load' })
	await this.page.waitForSelector('#search')
	await Shell.exec('./scripts/after_each_acceptance_tests')
})

describe('Register User', () => {
	test('register user with valid data should redirect to login page', async done => {
		await this.page.goto('http://localhost:4040/user/register', { timeout: 30000, waitUntil: 'load' })
		await expect(this.page.title()).resolves.toBe('Exchange - Register')
		await this.page.type('input[name=name]', this.testUserOne.name)
		await this.page.type('input[name=email]', this.testUserOne.email)
		await this.page.type('input[name=password]', this.testUserOne.password)
		const upload = await this.page.$('input[type=file]')
		await upload.uploadFile(this.testUserOne.avatar)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await expect(this.page.title()).resolves.toBe('Exchange - Login')
		const image = await this.page.screenshot()
		expect(image).toMatchImageSnapshot()
		done()
	})

	test('register user with no name should cause input warning', async done => {
		await this.page.goto('http://localhost:4040/user/register', { timeout: 30000, waitUntil: 'load' })
		await this.page.type('input[name=name]', '')
		await this.page.type('input[name=email]', this.testUserOne.email)
		await this.page.type('input[name=password]', this.testUserOne.password)
		const upload = await this.page.$('input[type=file]')
		await upload.uploadFile(this.testUserOne.avatar)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await expect(this.page.title()).resolves.toBe('Exchange - Register')
		const image = await this.page.screenshot()
		expect(image).toMatchImageSnapshot()
		done()
	})

	test('register user with no email should cause input warning', async done => {
		await this.page.goto('http://localhost:4040/user/register', { timeout: 30000, waitUntil: 'load' })
		await this.page.type('input[name=name]', this.testUserOne.name)
		await this.page.type('input[name=email]', '')
		await this.page.type('input[name=password]', this.testUserOne.password)
		const upload = await this.page.$('input[type=file]')
		await upload.uploadFile(this.testUserOne.avatar)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await expect(this.page.title()).resolves.toBe('Exchange - Register')
		const image = await this.page.screenshot()
		expect(image).toMatchImageSnapshot()
		done()
	})

	test('register user with no password should cause input warning', async done => {
		await this.page.goto('http://localhost:4040/user/register', { timeout: 30000, waitUntil: 'load' })
		await this.page.type('input[name=name]', this.testUserOne.name)
		await this.page.type('input[name=email]', this.testUserOne.email)
		await this.page.type('input[name=password]', '')
		const upload = await this.page.$('input[type=file]')
		await upload.uploadFile(this.testUserOne.avatar)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await expect(this.page.title()).resolves.toBe('Exchange - Register')
		const image = await this.page.screenshot()
		expect(image).toMatchImageSnapshot()
		done()
	})

	test('register user with no avatar should cause input warning', async done => {
		await this.page.goto('http://localhost:4040/user/register', { timeout: 30000, waitUntil: 'load' })
		await this.page.type('input[name=name]', this.testUserOne.name)
		await this.page.type('input[name=email]', this.testUserOne.email)
		await this.page.type('input[name=password]', this.testUserOne.password)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await expect(this.page.title()).resolves.toBe('Exchange - Register')
		const image = await this.page.screenshot()
		expect(image).toMatchImageSnapshot()
		done()
	})
})

describe('Login User', () => {
	beforeEach(async() => {
		await this.page.goto('http://localhost:4040/user/register', { timeout: 30000, waitUntil: 'load' })
		await this.page.type('input[name=name]', this.testUserOne.name)
		await this.page.type('input[name=email]', this.testUserOne.email)
		await this.page.type('input[name=password]', this.testUserOne.password)
		const upload = await this.page.$('input[type=file]')
		await upload.uploadFile(this.testUserOne.avatar)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
	})

	test('login user with valid details should redirect to home page', async done => {
		await this.page.goto('http://localhost:4040/user/login', { timeout: 30000, waitUntil: 'load' })
		await expect(this.page.title()).resolves.toBe('Exchange - Login')
		await this.page.type('input[name=email]', this.testUserOne.email)
		await this.page.type('input[name=password]', this.testUserOne.password)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await expect(this.page.title()).resolves.toBe('Exchange')
		const image = await this.page.screenshot()
		expect(image).toMatchImageSnapshot()
		await this.page.goto('http://localhost:4040/user/logout', { timeout: 30000, waitUntil: 'load' })
		await this.page.waitFor(500)
		await expect(this.page.title()).resolves.toBe('Exchange')
		done()
	})

	test('login user with non registered email should display error', async done => {
		await this.page.goto('http://localhost:4040/user/login', { timeout: 30000, waitUntil: 'load' })
		await expect(this.page.title()).resolves.toBe('Exchange - Login')
		await this.page.type('input[name=email]', 'test@testing.com')
		await this.page.type('input[name=password]', this.testUserOne.password)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await expect(this.page.title()).resolves.toBe('Exchange - Login')
		expect(await this.page.$eval('#error', e => e.innerText)).toBe('Email \"test@testing.com"\ is not registered')
		const image = await this.page.screenshot()
		expect(image).toMatchImageSnapshot()
		done()
	})

	test('login user with incorrect password should display error', async done => {
		await this.page.goto('http://localhost:4040/user/login', { timeout: 30000, waitUntil: 'load' })
		await expect(this.page.title()).resolves.toBe('Exchange - Login')
		await this.page.type('input[name=email]', this.testUserOne.email)
		await this.page.type('input[name=password]', 'letmein')
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await expect(this.page.title()).resolves.toBe('Exchange - Login')
		expect(await this.page.$eval('#error', e => e.innerText)).toBe('Invalid password')
		const image = await this.page.screenshot()
		expect(image).toMatchImageSnapshot()
		done()
	})
})

describe('Add Item', () => {
	beforeEach(async() => {
		await this.page.goto('http://localhost:4040/user/register', { timeout: 30000, waitUntil: 'load' })
		await this.page.type('input[name=name]', this.testUserOne.name)
		await this.page.type('input[name=email]', this.testUserOne.email)
		await this.page.type('input[name=password]', this.testUserOne.password)
		const upload = await this.page.$('input[type=file]')
		await upload.uploadFile(this.testUserOne.avatar)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await this.page.goto('http://localhost:4040/user/login', { timeout: 30000, waitUntil: 'load' })
		await this.page.type('input[name=email]', this.testUserOne.email)
		await this.page.type('input[name=password]', this.testUserOne.password)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
	})

	test('add item with valid data should redirect to item page', async done => {
		await this.page.goto('http://localhost:4040/item/new', { timeout: 30000, waitUntil: 'load' })
		await expect(this.page.title()).resolves.toBe('Exchange - New Item')
		await this.page.type('input[name=name]', this.testItemOne.name)
		await this.page.type('textarea[name=description]', this.testItemOne.description)
		const upload = await this.page.$('input[type=file]')
		await upload.uploadFile(this.testItemOne.image)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await expect(this.page.title()).resolves.toBe(`Exchange - ${this.testItemOne.name}`)
		const image = await this.page.screenshot()
		expect(image).toMatchImageSnapshot()
		done()
	})

	test('add item with no name should cause input warning', async done => {
		await this.page.goto('http://localhost:4040/item/new', { timeout: 30000, waitUntil: 'load' })
		await expect(this.page.title()).resolves.toBe('Exchange - New Item')
		await this.page.type('input[name=name]', '')
		await this.page.type('textarea[name=description]', this.testItemOne.description)
		const upload = await this.page.$('input[type=file]')
		await upload.uploadFile(this.testItemOne.image)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await expect(this.page.title()).resolves.toBe('Exchange - New Item')
		const image = await this.page.screenshot()
		expect(image).toMatchImageSnapshot()
		done()
	})

	test('add item with no description should cause input warning', async done => {
		await this.page.goto('http://localhost:4040/item/new', { timeout: 30000, waitUntil: 'load' })
		await expect(this.page.title()).resolves.toBe('Exchange - New Item')
		await this.page.type('input[name=name]', this.testItemOne.name)
		await this.page.type('textarea[name=description]', '')
		const upload = await this.page.$('input[type=file]')
		await upload.uploadFile(this.testItemOne.image)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await expect(this.page.title()).resolves.toBe('Exchange - New Item')
		const image = await this.page.screenshot()
		expect(image).toMatchImageSnapshot()
		done()
	})

	test('add item with no description should cause input warning', async done => {
		await this.page.goto('http://localhost:4040/item/new', { timeout: 30000, waitUntil: 'load' })
		await expect(this.page.title()).resolves.toBe('Exchange - New Item')
		await this.page.type('input[name=name]', this.testItemOne.name)
		await this.page.type('textarea[name=description]', this.testItemOne.description)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await expect(this.page.title()).resolves.toBe('Exchange - New Item')
		const image = await this.page.screenshot()
		expect(image).toMatchImageSnapshot()
		done()
	})
})

describe('Add Wishlist Item', () => {
	beforeEach(async() => {
		await this.page.goto('http://localhost:4040/user/register', { timeout: 30000, waitUntil: 'load' })
		await this.page.type('input[name=name]', this.testUserOne.name)
		await this.page.type('input[name=email]', this.testUserOne.email)
		await this.page.type('input[name=password]', this.testUserOne.password)
		const upload = await this.page.$('input[type=file]')
		await upload.uploadFile(this.testUserOne.avatar)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await this.page.goto('http://localhost:4040/user/login', { timeout: 30000, waitUntil: 'load' })
		await this.page.type('input[name=email]', this.testUserOne.email)
		await this.page.type('input[name=password]', this.testUserOne.password)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await this.page.goto('http://localhost:4040/item/new', { timeout: 30000, waitUntil: 'load' })
		await this.page.type('input[name=name]', this.testItemOne.name)
		await this.page.type('textarea[name=description]', this.testItemOne.description)
		const uploadTwo = await this.page.$('input[type=file]')
		await uploadTwo.uploadFile(this.testItemOne.image)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
	})

	test('add wishlist item with valid data should redirect to item page and display item', async done => {
		await expect(this.page.title()).resolves.toBe(`Exchange - ${this.testItemOne.name}`)
		await this.page.click('#new_wishlist_item')
		await this.page.waitForSelector('input[name=name]')
		await expect(this.page.title()).resolves.toBe('Exchange - New Wishlist Item')
		await this.page.type('input[name=name]', this.testItemOne.wishlistItem.name)
		await this.page.type('textarea[name=description]', this.testItemOne.wishlistItem.description)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await expect(this.page.title()).resolves.toBe(`Exchange - ${this.testItemOne.name}`)
		const image = await this.page.screenshot()
		expect(image).toMatchImageSnapshot()
		done()
	})

	test('add wishlist item with no name should display warning', async done => {
		await expect(this.page.title()).resolves.toBe(`Exchange - ${this.testItemOne.name}`)
		await this.page.click('#new_wishlist_item')
		await this.page.waitForSelector('input[name=name]')
		await expect(this.page.title()).resolves.toBe('Exchange - New Wishlist Item')
		await this.page.type('input[name=name]', '')
		await this.page.type('textarea[name=description]', this.testItemOne.wishlistItem.description)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await expect(this.page.title()).resolves.toBe('Exchange - New Wishlist Item')
		const image = await this.page.screenshot()
		expect(image).toMatchImageSnapshot()
		done()
	})

	test('add wishlist item with no name should display warning', async done => {
		await expect(this.page.title()).resolves.toBe(`Exchange - ${this.testItemOne.name}`)
		await this.page.click('#new_wishlist_item')
		await this.page.waitForSelector('input[name=name]')
		await expect(this.page.title()).resolves.toBe('Exchange - New Wishlist Item')
		await this.page.type('input[name=name]', this.testItemOne.wishlistItem.name)
		await this.page.type('textarea[name=description]', '')
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await expect(this.page.title()).resolves.toBe('Exchange - New Wishlist Item')
		const image = await this.page.screenshot()
		expect(image).toMatchImageSnapshot()
		done()
	})
})

describe('Create Offer', () => {
	beforeEach(async() => {
		await this.page.goto('http://localhost:4040/user/register', { timeout: 30000, waitUntil: 'load' })
		await this.page.type('input[name=name]', this.testUserOne.name)
		await this.page.type('input[name=email]', this.testUserOne.email)
		await this.page.type('input[name=password]', this.testUserOne.password)
		const upload = await this.page.$('input[type=file]')
		await upload.uploadFile(this.testUserOne.avatar)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await this.page.goto('http://localhost:4040/user/login', { timeout: 30000, waitUntil: 'load' })
		await this.page.type('input[name=email]', this.testUserOne.email)
		await this.page.type('input[name=password]', this.testUserOne.password)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await this.page.goto('http://localhost:4040/item/new', { timeout: 30000, waitUntil: 'load' })
		await this.page.type('input[name=name]', this.testItemOne.name)
		await this.page.type('textarea[name=description]', this.testItemOne.description)
		const uploadTwo = await this.page.$('input[type=file]')
		await uploadTwo.uploadFile(this.testItemOne.image)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		this.itemId = this.page.url().split('/')[5]

		await this.page.goto('http://localhost:4040/user/logout', { timeout: 30000, waitUntil: 'load' })
		await this.page.waitForSelector('#search')

		await this.page.goto('http://localhost:4040/user/register', { timeout: 30000, waitUntil: 'load' })
		await this.page.type('input[name=name]', this.testUserTwo.name)
		await this.page.type('input[name=email]', this.testUserTwo.email)
		await this.page.type('input[name=password]', this.testUserTwo.password)
		const uploadThree = await this.page.$('input[type=file]')
		await uploadThree.uploadFile(this.testUserTwo.avatar)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await this.page.goto('http://localhost:4040/user/login', { timeout: 30000, waitUntil: 'load' })
		await this.page.type('input[name=email]', this.testUserTwo.email)
		await this.page.type('input[name=password]', this.testUserTwo.password)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
	}, 20000)

	test('User with no items can no see item offer form', async done => {
		await this.page.goto(`http://localhost:4040/item/details/${this.itemId}`, { timeout: 30000, waitUntil: 'load' })
		await expect(this.page.title()).resolves.toBe(`Exchange - ${this.testItemOne.name}`)
		const image = await this.page.screenshot()
		expect(image).toMatchImageSnapshot()
		done()
	})

	test('User should be able to create offer on item', async done => {
		await this.page.goto('http://localhost:4040/item/new', { timeout: 30000, waitUntil: 'load' })
		await this.page.type('input[name=name]', this.testItemTwo.name)
		await this.page.type('textarea[name=description]', this.testItemTwo.description)
		const uploadFour = await this.page.$('input[type=file]')
		await uploadFour.uploadFile(this.testItemTwo.image)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		this.itemIdTwo = this.page.url().split('/')[5]
		await this.page.goto(`http://localhost:4040/item/details/${this.itemId}`, { timeout: 30000, waitUntil: 'load' })
		await this.page.select('select[name=offered_item]', this.itemIdTwo)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)

		await this.page.goto('http://localhost:4040/user/logout', { timeout: 30000, waitUntil: 'load' })
		await this.page.waitForSelector('#search')

		await this.page.goto('http://localhost:4040/user/login', { timeout: 30000, waitUntil: 'load' })
		await this.page.type('input[name=email]', this.testUserOne.email)
		await this.page.type('input[name=password]', this.testUserOne.password)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await this.page.goto('http://localhost:4040/user/', { timeout: 30000, waitUntil: 'load' })
		const image = await this.page.screenshot()
		expect(image).toMatchImageSnapshot()
		done()
	})
})

describe('Create Suggestions', () => {
	beforeEach(async() => {
		await this.page.goto('http://localhost:4040/user/register', { timeout: 30000, waitUntil: 'load' })
		await this.page.type('input[name=name]', this.testUserOne.name)
		await this.page.type('input[name=email]', this.testUserOne.email)
		await this.page.type('input[name=password]', this.testUserOne.password)
		const upload = await this.page.$('input[type=file]')
		await upload.uploadFile(this.testUserOne.avatar)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await this.page.goto('http://localhost:4040/user/login', { timeout: 30000, waitUntil: 'load' })
		await this.page.type('input[name=email]', this.testUserOne.email)
		await this.page.type('input[name=password]', this.testUserOne.password)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await this.page.goto('http://localhost:4040/item/new', { timeout: 30000, waitUntil: 'load' })
		await this.page.type('input[name=name]', this.testItemOne.name)
		await this.page.type('textarea[name=description]', this.testItemOne.description)
		const uploadTwo = await this.page.$('input[type=file]')
		await uploadTwo.uploadFile(this.testItemOne.image)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		this.itemId = this.page.url().split('/')[5]
		await expect(this.page.title()).resolves.toBe(`Exchange - ${this.testItemOne.name}`)
		await this.page.click('#new_wishlist_item')
		await this.page.waitForSelector('input[name=name]')
		await expect(this.page.title()).resolves.toBe('Exchange - New Wishlist Item')
		await this.page.type('input[name=name]', this.testItemOne.wishlistItem.name)
		await this.page.type('textarea[name=description]', this.testItemOne.wishlistItem.description)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await expect(this.page.title()).resolves.toBe(`Exchange - ${this.testItemOne.name}`)

		await this.page.goto('http://localhost:4040/user/logout', { timeout: 30000, waitUntil: 'load' })
		await this.page.waitForSelector('#search')

		await this.page.goto('http://localhost:4040/user/register', { timeout: 30000, waitUntil: 'load' })
		await this.page.type('input[name=name]', this.testUserTwo.name)
		await this.page.type('input[name=email]', this.testUserTwo.email)
		await this.page.type('input[name=password]', this.testUserTwo.password)
		const uploadThree = await this.page.$('input[type=file]')
		await uploadThree.uploadFile(this.testUserTwo.avatar)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await this.page.goto('http://localhost:4040/user/login', { timeout: 30000, waitUntil: 'load' })
		await this.page.type('input[name=email]', this.testUserTwo.email)
		await this.page.type('input[name=password]', this.testUserTwo.password)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await this.page.goto('http://localhost:4040/item/new', { timeout: 30000, waitUntil: 'load' })
		await this.page.type('input[name=name]', this.testItemTwo.name)
		await this.page.type('textarea[name=description]', this.testItemTwo.description)
		const uploadFour = await this.page.$('input[type=file]')
		await uploadFour.uploadFile(this.testItemTwo.image)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
	}, 20000)

	test('suggestion should be generated when wishlist item is added', async done => {
		await expect(this.page.title()).resolves.toBe(`Exchange - ${this.testItemTwo.name}`)
		await this.page.click('#new_wishlist_item')
		await this.page.waitForSelector('input[name=name]')
		await expect(this.page.title()).resolves.toBe('Exchange - New Wishlist Item')
		await this.page.type('input[name=name]', this.testItemTwo.wishlistItem.name)
		await this.page.type('textarea[name=description]', this.testItemTwo.wishlistItem.description)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await expect(this.page.title()).resolves.toBe(`Exchange - ${this.testItemTwo.name}`)
		const image = await this.page.screenshot()
		expect(image).toMatchImageSnapshot()
		done()
	})

	test('suggestion should also generate on other users item', async done => {
		await expect(this.page.title()).resolves.toBe(`Exchange - ${this.testItemTwo.name}`)
		await this.page.click('#new_wishlist_item')
		await this.page.waitForSelector('input[name=name]')
		await expect(this.page.title()).resolves.toBe('Exchange - New Wishlist Item')
		await this.page.type('input[name=name]', this.testItemTwo.wishlistItem.name)
		await this.page.type('textarea[name=description]', this.testItemTwo.wishlistItem.description)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await expect(this.page.title()).resolves.toBe(`Exchange - ${this.testItemTwo.name}`)
		const image = await this.page.screenshot()
		expect(image).toMatchImageSnapshot()

		await this.page.goto('http://localhost:4040/user/logout', { timeout: 30000, waitUntil: 'load' })
		await this.page.waitForSelector('#search')

		await this.page.goto('http://localhost:4040/user/login', { timeout: 30000, waitUntil: 'load' })
		await this.page.type('input[name=email]', this.testUserOne.email)
		await this.page.type('input[name=password]', this.testUserOne.password)
		await this.page.click('button[type=submit]')
		await this.page.waitFor(500)
		await this.page.goto(`http://localhost:4040/item/details/${this.itemId}`, { timeout: 30000, waitUntil: 'load' })
		const imageTwo = await this.page.screenshot()
		expect(imageTwo).toMatchImageSnapshot()
		done()
	})
})
