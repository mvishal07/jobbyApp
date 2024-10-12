import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const EmploymentType = ({onChangeEmployment}) => {
  const onClickCheckbox = event => {
    const {value, checked} = event.target
    onChangeEmployment(value, checked)
  }

  return (
    <div className="EmploymentType-container">
      <h1 className="employment">Type of Employment</h1>
      {employmentTypesList.map(each => (
        <li className="employment-list" key={each.employmentTypeId}>
          <input
            type="checkbox"
            id={each.employmentTypeId}
            value={each.employmentTypeId}
            onChange={onClickCheckbox}
          />
          <label htmlFor={each.employmentTypeId}>{each.label}</label>
        </li>
      ))}
    </div>
  )
}

export default EmploymentType
