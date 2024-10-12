import './index.css'

import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class Profile extends Component {
  state = {
    userDetails: {},

    isLoading: true,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getUserDetails()
  }

  getUserDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/profile'

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
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        userDetails: updatedData,
        isLoading: false,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onRetry = () => {
    this.getUserDetails()
  }

  renderFailure = () => (
    <div className="failure-view">
      <button className="retry-btn" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  renderPage = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfile()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoading()
      default:
        return null
    }
  }

  renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfile = () => {
    const {userDetails, isLoading} = this.state
    const {name, profileImageUrl, shortBio} = userDetails
    return (
      <div className="profile-card">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="name">{name}</h1>
        <p className="bio">{shortBio}</p>
      </div>
    )
  }

  render() {
    return <>{this.renderPage()}</>
  }
}
export default Profile
