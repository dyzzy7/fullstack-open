import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const onLogin = async event => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      setUsername('')
      setPassword('')
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
    } catch {
      setNotificationMessage('wrong credentials')
      setNotificationType('error')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 5000)
    }
  }

  const addBlog = async event => {
    event.preventDefault()

    try {
      const blogObject = {
        title,
        author,
        url
      }
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setNotificationMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setNotificationType('success')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 5000)
    } catch (error) {
      setNotificationMessage('error creating blog')
      setNotificationType('error')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 5000)
    }
  }

  if (user === null){
    return (
      <div>
        <h2>Log in to the application</h2>
        <Notification message={notificationMessage} type={notificationType} />
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={setUsername}
          handlePasswordChange={setPassword}
          handleLogin={onLogin}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
        <Notification message={notificationMessage} type={notificationType} />
        <p>{user.name} logged in</p>
        <button onClick={() => {
          setUser(null)
          window.localStorage.removeItem('loggedBlogappUser')
          blogService.setToken(null)
        }}>logout</button>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      <h2>create new</h2>
        <BlogForm
          title={title}
          author={author}
          url={url}
          onTitleChange={setTitle}
          onAuthorChange={setAuthor}
          onUrlChange={setUrl}
          createBlog={addBlog}
        />
    </div>
  )
}

export default App