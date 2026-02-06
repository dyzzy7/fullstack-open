import { useState } from 'react'

const Header = ({ text }) => <h1>{text}</h1>

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Statistic = ({ text, value }) => (
  <span>
    {text} {value}
  </span>
)

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header text="Give Feedback" />
      <Button handleClick={() => setGood(good + 1)} text="Good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="Neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="Bad" />
      <Header text="Statistics" />
      <Statistic text="Good:" value={good} />
      <Statistic text="Neutral:" value={neutral} />
      <Statistic text="Bad:" value={bad} />
    </div>
  )
}

export default App