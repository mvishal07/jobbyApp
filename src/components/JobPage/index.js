import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import Jobs from '../Jobs'
import Profile from '../Profile'
import EmploymentType from '../EmploymentType'
import SalaryRange from '../SalaryRange'
import './index.css'

class JobPage extends Component {
  state = {
    selectedEmploymentTypes: [],
    selectedSalary: '',
  }

  onChangeEmployment = (value, checked) => {
    this.setState(prevState => {
      const {selectedEmploymentTypes} = prevState
      const newSelectedEmploymentTypes = checked
        ? [...selectedEmploymentTypes, value]
        : selectedEmploymentTypes.filter(type => type !== value)
      return {selectedEmploymentTypes: newSelectedEmploymentTypes}
    })
  }

  onChangeSalary = selectedSalary => {
    this.setState({selectedSalary})
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }

    const {selectedEmploymentTypes, selectedSalary} = this.state

    return (
      <>
        <Header />
        <div className="job-page-container">
          <div className="left-container">
            <Profile />
            <hr />
            <EmploymentType onChangeEmployment={this.onChangeEmployment} />
            <hr />
            <SalaryRange onChangeSalary={this.onChangeSalary} />
          </div>
          <div className="jobs">
            <Jobs
              selectedEmploymentTypes={selectedEmploymentTypes}
              selectedSalary={selectedSalary}
            />
          </div>
        </div>
      </>
    )
  }
}

export default JobPage
