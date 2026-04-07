const { test, describe, after, beforeEach, before } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const helper = require('./helpers/test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let user = null
let token = null

before(async () => {
  await User.deleteMany({})
  await User.insertOne(helper.initialUser)
  users = await helper.usersInDb()
  user = users[0]
  token = await helper.getTokenForUser(user)
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs.map(blog => ({ ...blog, user: user.id.toString() })))
})

after(async () => {
  await mongoose.connection.close()
})

describe('GET /api/blogs', async () => {
  test('blogs are returned as json', async () => {
    const blogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(blogs.body.length, helper.initialBlogs.length)
  })

  test('unique identifier property of the blog posts is named id', async () => {
    const blogs = await api.get('/api/blogs')

    blogs.body.forEach(blog => {
      assert.ok(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })
})

describe('POST /api/blogs', async () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'New Blog',
      url: 'http://example.com/new-blog',
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.title, newBlog.title)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert.ok(titles.includes(newBlog.title))
  })

  test('if likes property is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'Blog without likes',
      url: 'http://example.com/blog-without-likes',
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  test('blog without title is not added', async () => {
    const newBlog = {
      url: 'http://example.com/blog-without-title',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'Blog without URL',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('blog cannot be added without token', async () => {
    const newBlog = {
      title: 'Blog without token',
      url: 'http://example.com/blog-without-token',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('DELETE /api/blogs/:id', async () => {
  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const ids = blogsAtEnd.map(b => b.id)
    assert.ok(!ids.includes(blogToDelete.id))
  })

  test('blog cannot be deleted without token', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('PUT /api/blogs/:id', async () => {
  test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      title: 'Updated Title',
      author: 'Updated Author',
      url: 'http://example.com/updated-blog',
      likes: 10,
      user: user.id
    }

    const expectedBlog = {
      ...updatedBlog,
      id: blogToUpdate.id,
      user: {
        username: user.username,
        name: user.name,
        id: user.id
      }
    }

    const result = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)

    const blogsAtEnd = await helper.blogsInDb()
    const updated = blogsAtEnd.find(b => b.id === blogToUpdate.id)

    assert.deepEqual(result.body, expectedBlog)
  })
  
  test('updating a non-existing blog returns 404', async () => {
    const nonExistingId = await helper.nonExistingId()

    const updatedBlog = {
      title: 'Updated Title',
      author: 'Updated Author',
      url: 'http://example.com/updated-blog',
      likes: 10,
      user: user.id,
    }

    await api
      .put(`/api/blogs/${nonExistingId}`)
      .send(updatedBlog)
      .expect(404)
  })
})