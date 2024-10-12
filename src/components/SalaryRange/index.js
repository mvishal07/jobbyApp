import './index.css'

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const SalaryRange = ({onChangeSalary}) => {
  const onChangeRadio = event => {
    onChangeSalary(event.target.value)
  }

  return (
    <div className="SalaryRange-container">
      <h1 className="salary">Salary Range</h1>
      {salaryRangesList.map(each => (
        <li className="salary-list" key={each.salaryRangeId}>
          <input
            type="radio"
            id={each.salaryRangeId}
            name="salary"
            value={each.salaryRangeId}
            onChange={onChangeRadio}
          />
          <label htmlFor={each.salaryRangeId}>{each.label}</label>
        </li>
      ))}
    </div>
  )
}

export default SalaryRange
