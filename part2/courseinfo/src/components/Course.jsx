const Header = (props) => {
  return (
    <h2>{props.course}</h2>
  )
};

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => <Part key={part.id} part={part.name} exercises={part.exercises} />)}
    </div>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.part} {props.exercises}
    </p>
  )
};

const Sum = ({ parts }) => {
    const total = parts.reduce((sum, part) => sum + part.exercises, 0);
    return (
        <p><strong>total of {total} exercises</strong></p>
    )
};

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Sum parts={course.parts} />
    </div>
  )
};

export default Course;