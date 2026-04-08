const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const helper = require('./helpers/test_helper')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertOne(helper.initialUser)
})

after(async () => {
  await mongoose.connection.close()
})

describe('GET /api/users', async () => {
  test('users are returned as json', async () => {
    const users = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(users.body.length, 1)
  })

  test('unique identifier property of the user posts is named id', async () => {
    const users = await api.get('/api/users')

    users.body.forEach(user => {
      assert.ok(user.id)
    })
  })
})

describe('POST /api/users', async () => {
  test('a valid user can be added', async () => {
    const newUser = {
      username: 'newUser',
      password: 'newPassword'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.username, newUser.username)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, 2)

    const usernames = usersAtEnd.map(u => u.username)
    assert.ok(usernames.includes(newUser.username))
  })

  test('user with too short username is not added', async () => {
    const newUser = {
      username: 'ab',
      password: 'validPassword'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'username must be at least 3 characters long')

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, 1)
  })

  test('user with too short password is not added', async () => {
    const newUser = {
      username: 'validUsername',
      password: 'pw'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'password must be at least 3 characters long')

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, 1)
  })

  test('user with non-unique username is not added', async () => {
    const newUser = {
      username: helper.initialUser.username,
      password: 'validPassword'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, 1)
  })
})