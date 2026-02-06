import { useState } from 'react'

const Header = ({ text }) => <h1>{text}</h1>

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticsLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;

  if (total === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }

  return (
    <table>
      <tbody>
        <StatisticsLine text="Good" value={good} />
        <StatisticsLine text="Neutral" value={neutral} />
        <StatisticsLine text="Bad" value={bad} />
        <StatisticsLine text="All" value={total} />
        <StatisticsLine text="Average" value={(good - bad) / total} />
        <StatisticsLine text="Positive" value={good / total * 100 + ' %'} />
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const total = good + neutral + bad;

  return (
    <div>
      <Header text="Give Feedback" />
      <Button handleClick={() => setGood(good + 1)} text="Good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="Neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="Bad" />
      <Header text="Statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App