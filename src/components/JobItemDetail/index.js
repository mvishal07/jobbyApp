import './index.css'
import {BsStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {FaSuitcase, FaExternalLinkAlt} from 'react-icons/fa'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetail extends Component {
  state = {
    jobDetails: {},
    skills: [],
    lifeAtCompany: {},
    similarJobsList: [],
    isLoading: true,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()

      const updatedData = {
        companylogourl: data.job_details.company_logo_url,
        employmenttype: data.job_details.employment_type,
        jobdescription: data.job_details.job_description,
        packagePerAnnum: data.job_details.package_per_annum,
        companywebsiteurl: data.job_details.company_website_url,
        location: data.job_details.location,
        rating: data.job_details.rating,
        title: data.job_details.title,
        id: data.job_details.id,
      }
      this.setState({
        jobDetails: updatedData,
        isLoading: false,
        apiStatus: apiStatusConstants.success,
      })

      const similarJobs = data.similar_jobs.map(each => ({
        companylogourlSimilarjobs: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescriptionSimilarjobs: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({similarJobsList: similarJobs})

      const updateSkills = data.job_details.skills.map(each => ({
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({skills: updateSkills})

      const updateLife = {
        imageUrl: data.job_details.life_at_company.image_url,
        description: data.job_details.life_at_company.description,
      }
      this.setState({lifeAtCompany: updateLife})
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onRetry = () => {
    this.getJobDetails()
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

  renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderPage = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetails()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoading()
      default:
        return null
    }
  }

  renderJobDetails = () => {
    const {jobDetails} = this.state
    const {
      id,
      companylogourl,
      employmenttype,
      jobdescription,
      packagePerAnnum,
      companywebsiteurl,
      location,
      rating,
      title,
    } = jobDetails
    const {lifeAtCompany} = this.state
    const {imageUrl, description} = lifeAtCompany
    return (
      <div className="">
        <div className="job-detail-card">
          <div className="row1">
            <img
              src={companylogourl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="title-card">
              <h1 className="title">{title}</h1>
              <div className="rating-card">
                <BsStarFill className="star" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="row-2">
            <div className="location">
              <MdLocationOn className="location-icon" />
              <p className="loc">{location}</p>
            </div>
            <div className="job-type">
              <FaSuitcase className="job-icon" />
              <p className="job">{employmenttype}</p>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>
          <hr />
          <div className="row3">
            <h2 className="desc">Description</h2>
            <a href={companywebsiteurl}>
              Visit
              <FaExternalLinkAlt className="link-logo" />
            </a>
          </div>

          <p className="description">{jobdescription}</p>
          {this.renderSkills()}
          <h2 className="desc">Life at Company</h2>

          <div className="life">
            <p className="description">{description}</p>
            <img src={imageUrl} alt="company" className="company" />
          </div>
        </div>
        {this.renderSimilarJobs()}
      </div>
    )
  }

  renderSkills = () => {
    const {skills} = this.state
    return (
      <>
        <h2 className="skills">Skills</h2>
        <ul className="skills-list">
          {skills.map(each => (
            <li key={each.name} className="skill-card">
              <img src={each.imageUrl} alt={each.name} className="skill-logo" />
              <p className="skill">{each.name}</p>
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderSimilarJobs = () => {
    const {similarJobsList} = this.state
    console.log(similarJobsList)
    return (
      <div className="similar-jobs">
        <h1 className="similar-job-heading">Similar Jobs</h1>
        <ul className="similar-job-list">
          {similarJobsList.map(eachJob => (
            <li className="similar-job-card" key={eachJob.id}>
              <div className="row1">
                <img
                  src={eachJob.companylogourlSimilarjobs}
                  alt="similar job company logo"
                  className="company-logo"
                />
                <div className="title-card">
                  <h1 className="title">{eachJob.title}</h1>
                  <div className="rating-card">
                    <BsStarFill className="star" />
                    <p className="rating">{eachJob.rating}</p>
                  </div>
                </div>
              </div>
              <div className="row-2">
                <div className="location">
                  <MdLocationOn className="location-icon" />
                  <p className="loc">{eachJob.location}</p>
                </div>
                <div className="job-type">
                  <FaSuitcase className="job-icon" />
                  <p className="job">{eachJob.employmentType}</p>
                </div>
              </div>

              <h2 className="desc">Description</h2>
              <p className="description">{eachJob.jobDescriptionSimilarjobs}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  render() {
    return (
      <div className="job-detail-container">
        <Header />
        {this.renderPage()}
      </div>
    )
  }
}
export default JobItemDetail
