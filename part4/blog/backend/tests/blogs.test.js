const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const { url } = require('node:inspector')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(helper.listWithMultipleBlogs)
})

after(async () => {
  await mongoose.connection.close()
})

describe('total likes', () => {
    test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(helper.listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list has multiple blogs, equals the sum of their likes', () => {
    const result = listHelper.totalLikes(helper.listWithMultipleBlogs)
    assert.strictEqual(result, 36)
  })
})

describe('favorite blog', () => {
  test('when list has only one blog, equals that blog', () => {
    const result = listHelper.favoriteBlog(helper.listWithOneBlog)
    assert.deepStrictEqual(result, helper.listWithOneBlog[0])
  })

  test('when list has multiple blogs, equals the blog with most likes', () => {
    const result = listHelper.favoriteBlog(helper.listWithMultipleBlogs)
    assert.deepStrictEqual(result, helper.listWithMultipleBlogs[2])
  })

  test('when list is empty, equals null', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })
})

describe('most blogs', () => {
  test('when list has only one blog, equals the author of that blog', () => {
    const result = listHelper.mostBlogs(helper.listWithOneBlog)
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', blogs: 1 })
  })

  test('when list has multiple blogs, equals the author with most blogs', () => {
    const result = listHelper.mostBlogs(helper.listWithMultipleBlogs)
    assert.deepStrictEqual(result, { author: 'Robert C. Martin', blogs: 3 })
  })

  test('when list is empty, equals null', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })
})

describe('most likes', () => {
  test('when list has only one blog, equals the author of that blog', () => {
    const result = listHelper.mostLikes(helper.listWithOneBlog)
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes: 5 })
  })

  test('when list has multiple blogs, equals the author with most likes', () => {
    const result = listHelper.mostLikes(helper.listWithMultipleBlogs)
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes: 17 })
  })

  test('when list is empty, equals null', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })
})

describe('GET /api/blogs', async () => {
  test('blogs are returned as json', async () => {
    const blogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(blogs.body.length, helper.listWithMultipleBlogs.length)
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
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.title, newBlog.title)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.listWithMultipleBlogs.length + 1)

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
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.listWithMultipleBlogs.length)
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'Blog without URL',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.listWithMultipleBlogs.length)
  })
})