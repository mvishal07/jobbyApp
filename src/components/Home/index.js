import './index.css'
import Cookies from 'js-cookie'
import {Redirect, Link, withRouter} from 'react-router-dom'
import Header from '../Header'

const Home = props => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }

  return (
    <div>
      <div className="home-container">
        <Header />

        <h1 className="heading">
          Find The Job That <br />
          Fits Your Life
        </h1>
        <p className="sub-heading">
          Millions of people are searching for jobs, salary <br />
          information, company reviews. Find the job that fits your <br />
          abilities and potential.
        </p>
        <Link to="/jobs">
          <button className="find-btn">Find Jobs</button>
        </Link>
      </div>
    </div>
  )
}
export default withRouter(Home)
