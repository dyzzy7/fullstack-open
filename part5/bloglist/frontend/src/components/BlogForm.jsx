const BlogForm = ({ title, author, url, onTitleChange, onAuthorChange, onUrlChange, createBlog }) => {
    return (
        <form onSubmit={createBlog}>
            <div>
                <label>
                    title
                    <input
                        type="text"
                        value={title}
                        name="Title"
                        onChange={({ target }) => onTitleChange(target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    author
                    <input
                        type="text"
                        value={author}
                        name="Author"
                        onChange={({ target }) => onAuthorChange(target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    url
                    <input
                        type="text"
                        value={url}
                        name="Url"
                        onChange={({ target }) => onUrlChange(target.value)}
                    />
                </label>
            </div>
            <div>
                <button type="submit">create</button>
            </div>
        </form>
    )
}

export default BlogForm