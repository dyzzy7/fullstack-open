const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const favorite = blogs.reduce((prev, current) => {
    return (prev.likes > current.likes) ? prev : current
  })

  return favorite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const blogCounts = {}

  blogs.forEach(blog => {
    blogCounts[blog.author] = (blogCounts[blog.author] || 0) + 1
  })

  const mostProlific = Object.keys(blogCounts).reduce((prev, current) => {
    return (blogCounts[prev] > blogCounts[current]) ? prev : current
  })

  return { author: mostProlific, blogs: blogCounts[mostProlific] }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const likeCounts = {}

  blogs.forEach(blog => {
    likeCounts[blog.author] = (likeCounts[blog.author] || 0) + blog.likes
  })

  const mostLiked = Object.keys(likeCounts).reduce((prev, current) => {
    return (likeCounts[prev] > likeCounts[current]) ? prev : current
  })

  return { author: mostLiked, likes: likeCounts[mostLiked] }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}