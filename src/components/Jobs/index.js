import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {FaSuitcase, FaSearch} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    searchInput: '',
    isLoading: true,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobsList()
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.selectedEmploymentTypes !==
        this.props.selectedEmploymentTypes ||
      prevProps.selectedSalary !== this.props.selectedSalary
    ) {
      this.getJobsList()
    }
  }

  getJobsList = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {searchInput} = this.state
    const {selectedEmploymentTypes, selectedSalary} = this.props
    const employmentType = selectedEmploymentTypes.join(',')
    const api = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${selectedSalary}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(api, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.jobs.map(each => ({
        id: each.id,
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobsList: updatedData,
        isLoading: false,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  onSearch = event => {
    event.preventDefault()
    this.getJobsList()
  }

  onRetry = () => {
    this.getJobsList()
  }

  renderFailure = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-h">Oops! Something Went Wrong</h1>
      <p className="failure-p">
        We cannot seem to find the page you are looking for.
      </p>
      <button className="retry-btn" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  renderJobsList = () => {
    const {jobsList} = this.state
    return (
      <div>
        <ul className="job-container">
          {jobsList.map(each => (
            <Link to={`/jobs/${each.id}`} className="link" key={each.id}>
              <li className="job-card">
                <div className="row1">
                  <img
                    src={each.companyLogoUrl}
                    alt="company logo"
                    className="company-logo"
                  />
                  <div className="title-card">
                    <h1 className="title">{each.title}</h1>
                    <div className="rating-card">
                      <BsStarFill className="star" />
                      <p className="rating">{each.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="row-2">
                  <div className="location">
                    <MdLocationOn className="location-icon" />
                    <p className="loc">{each.location}</p>
                  </div>
                  <div className="job-type">
                    <FaSuitcase className="job-icon" />
                    <p className="job">{each.employmentType}</p>
                  </div>
                  <p className="package">{each.packagePerAnnum}</p>
                </div>
                <hr />
                <h2 className="desc">Description</h2>
                <p className="description">{each.jobDescription}</p>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    )
  }

  renderSearch = () => (
    <div>
      <form className="searchbar" onSubmit={this.onSearch}>
        <input
          type="search"
          placeholder="Search"
          className="search"
          onChange={this.onChangeSearch}
        />
        <button type="submit" data-testid="searchButton">
          <FaSearch className="search-icon" />
        </button>
      </form>
    </div>
  )

  renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderPage = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsList()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoading()
      default:
        return null
    }
  }

  render() {
    const {isLoading} = this.state
    return (
      <div>
        {this.renderSearch()}
        {this.renderPage()}
      </div>
    )
  }
}

export default Jobs
