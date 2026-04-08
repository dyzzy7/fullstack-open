
const LoginForm = ({ username, password, handleUsernameChange, handlePasswordChange, handleLogin }) => {
  return (
    <form onSubmit={handleLogin}>
        <div>
            <label>
                username
                <input
                type="text"
                value={username}
                name="Username"
                onChange={({ target }) => handleUsernameChange(target.value)}
                />
            </label>
        </div>
            <div>
            <label>
                password
                <input
                type="password"
                value={password}
                name="Password"
                onChange={({ target }) => handlePasswordChange(target.value)}
                />
            </label>
        </div>
        <div>
            <button type="submit">login</button>
        </div>
    </form>
  )
}

export default LoginForm