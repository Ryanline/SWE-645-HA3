import { useEffect, useState } from 'react'
import './App.css'

const API_BASE_URL = window.APP_CONFIG?.API_BASE_URL ?? 'http://127.0.0.1:8000'

const emptyFormData = {
  firstName: '',
  lastName: '',
  streetAddress: '',
  city: '',
  state: '',
  zip: '',
  surveyDate: '',
  telephone: '',
  email: '',
  likedMost: [],
  interestSource: '',
  recommendation: '',
  raffle: '',
  comments: '',
}

function App() {
  const [activeTab, setActiveTab] = useState('new')
  const [surveys, setSurveys] = useState([])
  const [formData, setFormData] = useState(emptyFormData)
  const [selectedSurveyId, setSelectedSurveyId] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const highlightedTab = selectedSurveyId !== null ? 'view' : activeTab

  useEffect(() => {
    void fetchSurveys()
  }, [])

  const fetchSurveys = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/surveys`)
      if (!response.ok) {
        setStatusMessage('Unable to load surveys right now.')
        return
      }

      const data = await response.json()
      setSurveys(data)
    } catch {
      setStatusMessage('Unable to load surveys right now.')
    }
  }

  const resetForm = () => {
    setFormData(emptyFormData)
    setSelectedSurveyId(null)
    setIsEditMode(false)
    setStatusMessage('')
  }

  const handleNewSurveyTab = () => {
    resetForm()
    setActiveTab('new')
  }

  const handleViewTab = async () => {
    setActiveTab('view')
    setStatusMessage('')
    await fetchSurveys()
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleLikedMostChange = (event) => {
    const { value, checked } = event.target

    setFormData((current) => ({
      ...current,
      likedMost: checked
        ? [...current.likedMost, value]
        : current.likedMost.filter((item) => item !== value),
    }))
  }

  const loadSurveyIntoForm = (survey) => {
    setFormData({
      firstName: survey.first_name ?? '',
      lastName: survey.last_name ?? '',
      streetAddress: survey.street_address ?? '',
      city: survey.city ?? '',
      state: survey.state ?? '',
      zip: survey.zip_code ?? '',
      surveyDate: survey.survey_date ?? '',
      telephone: survey.telephone ?? '',
      email: survey.email ?? '',
      likedMost: survey.liked_most ? survey.liked_most.split(',').filter(Boolean) : [],
      interestSource: survey.interest_source ?? '',
      recommendation: survey.recommendation ?? '',
      raffle: survey.raffle ?? '',
      comments: survey.comments ?? '',
    })
  }

  const handleSelectSurvey = (survey) => {
    setSelectedSurveyId(survey.id)
    setIsEditMode(false)
    loadSurveyIntoForm(survey)
    setActiveTab('new')
    setStatusMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatusMessage('')

    const surveyData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      street_address: formData.streetAddress,
      city: formData.city,
      state: formData.state,
      zip_code: formData.zip,
      telephone: formData.telephone,
      email: formData.email,
      survey_date: formData.surveyDate,
      liked_most: formData.likedMost.join(',') || null,
      interest_source: formData.interestSource || null,
      recommendation: formData.recommendation || null,
      raffle: formData.raffle || null,
      comments: formData.comments || null,
    }

    try {
      const isUpdating = selectedSurveyId !== null
      const response = await fetch(
        isUpdating
          ? `${API_BASE_URL}/surveys/${selectedSurveyId}`
          : `${API_BASE_URL}/surveys`,
        {
          method: isUpdating ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(surveyData),
        },
      )

      if (!response.ok) {
        setStatusMessage('Something went wrong while saving the survey.')
        return
      }

      await response.json()
      await fetchSurveys()

      if (isUpdating) {
        setStatusMessage('Survey updated successfully.')
        setIsEditMode(false)
      } else {
        setStatusMessage('Survey submitted successfully.')
        resetForm()
      }
    } catch {
      setStatusMessage('Something went wrong while saving the survey.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSurvey = async (surveyId) => {
    setStatusMessage('')

    const response = await fetch(`${API_BASE_URL}/surveys/${surveyId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      setStatusMessage('Something went wrong while deleting the survey.')
      return
    }

    if (selectedSurveyId === surveyId) {
      resetForm()
      setActiveTab('view')
    }

    await fetchSurveys()
    setStatusMessage('Survey deleted successfully.')
  }

  const formTitle = selectedSurveyId === null
    ? 'New Student Survey'
    : isEditMode
      ? 'Edit Student Survey'
      : 'Review Student Survey'

  const formDescription = selectedSurveyId === null
    ? 'Please complete the survey below. Fields marked with * are required.'
    : isEditMode
      ? 'Update the survey details below, then save your changes.'
      : 'This survey is currently read-only. Click Edit Survey to unlock the fields.'

  const fieldsDisabled = selectedSurveyId !== null && !isEditMode

  return (
    <>
      <div className="w3-top">
        <div className="w3-bar w3-white w3-wide w3-padding w3-card">
          <a href="#survey" className="w3-bar-item w3-button">
            <b>SWE 645</b> Assignment 3
          </a>
        </div>
      </div>

      <header
        className="w3-display-container w3-content w3-wide"
        style={{ maxWidth: '1500px' }}
        id="home"
      >
        <img
          className="w3-image"
          src="/architect.jpg"
          alt="Architecture"
          width="1500"
          height="800"
        />
        <div className="w3-display-middle w3-margin-top w3-center">
          <h1 className="w3-xxlarge w3-text-white">
            <span className="w3-padding w3-black w3-opacity-min">
              <b>SWE 645</b>
            </span>{' '}
            <span className="w3-hide-small w3-text-light-grey">
              Assignment 3
            </span>
          </h1>
        </div>
      </header>

      <div className="w3-content w3-padding" style={{ maxWidth: '1564px' }}>
        <div className="w3-container w3-padding-32" id="survey">
          <div className="survey-tabs w3-border-bottom w3-border-light-grey">
            <button
              type="button"
              className={`survey-tab ${highlightedTab === 'new' ? 'is-active' : ''}`}
              onClick={handleNewSurveyTab}
            >
              New Student Survey
            </button>
            <button
              type="button"
              className={`survey-tab ${highlightedTab === 'view' ? 'is-active' : ''}`}
              onClick={() => void handleViewTab()}
            >
              View All Surveys
            </button>
          </div>

          {activeTab === 'new' ? (
            <>
              <div className="survey-header-row">
                <div>
                  <h3 className="survey-title">{formTitle}</h3>
                  <p>{formDescription}</p>
                </div>
                {selectedSurveyId !== null ? (
                  <div className="survey-actions-top">
                    <button
                      type="button"
                      className="w3-button w3-light-grey w3-border"
                      onClick={() => setIsEditMode((current) => !current)}
                    >
                      {isEditMode ? 'Cancel' : 'Edit Survey'}
                    </button>
                    <button
                      type="button"
                      className="w3-button w3-white w3-border"
                      onClick={() => void handleViewTab()}
                    >
                      Back to Surveys
                    </button>
                  </div>
                ) : null}
              </div>

              {statusMessage ? <p className="status-message">{statusMessage}</p> : null}

              <form
                className="w3-container w3-card w3-white w3-padding-16 w3-round-large"
                onSubmit={handleSubmit}
              >
                <div className="w3-row-padding">
                  <div className="w3-half">
                    <label>
                      <b>First Name *</b>
                    </label>
                    <input
                      className="w3-input w3-border"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={fieldsDisabled}
                      required
                    />
                  </div>
                  <div className="w3-half">
                    <label>
                      <b>Last Name *</b>
                    </label>
                    <input
                      className="w3-input w3-border"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={fieldsDisabled}
                      required
                    />
                  </div>
                </div>

                <div className="w3-row-padding w3-margin-top">
                  <div className="w3-half">
                    <label>
                      <b>Street Address *</b>
                    </label>
                    <input
                      className="w3-input w3-border"
                      type="text"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      disabled={fieldsDisabled}
                      required
                    />
                  </div>
                  <div className="w3-half">
                    <label>
                      <b>City *</b>
                    </label>
                    <input
                      className="w3-input w3-border"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={fieldsDisabled}
                      required
                    />
                  </div>
                </div>

                <div className="w3-row-padding w3-margin-top">
                  <div className="w3-third">
                    <label>
                      <b>State *</b>
                    </label>
                    <input
                      className="w3-input w3-border"
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      disabled={fieldsDisabled}
                      required
                    />
                  </div>
                  <div className="w3-third">
                    <label>
                      <b>ZIP *</b>
                    </label>
                    <input
                      className="w3-input w3-border"
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      disabled={fieldsDisabled}
                      required
                    />
                  </div>
                  <div className="w3-third">
                    <label>
                      <b>Date of Survey *</b>
                    </label>
                    <input
                      className="w3-input w3-border"
                      type="date"
                      name="surveyDate"
                      value={formData.surveyDate}
                      onChange={handleInputChange}
                      disabled={fieldsDisabled}
                      required
                    />
                  </div>
                </div>

                <div className="w3-row-padding w3-margin-top">
                  <div className="w3-half">
                    <label>
                      <b>Telephone *</b>
                    </label>
                    <input
                      className="w3-input w3-border"
                      type="tel"
                      name="telephone"
                      placeholder="e.g., 555-555-5555"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      disabled={fieldsDisabled}
                      required
                    />
                  </div>
                  <div className="w3-half">
                    <label>
                      <b>E-mail *</b>
                    </label>
                    <input
                      className="w3-input w3-border"
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={fieldsDisabled}
                      required
                    />
                  </div>
                </div>

                <hr className="w3-margin-top w3-margin-bottom" />

                <p>
                  <b>What did you like most about the campus?</b>
                </p>
                <div className="w3-row-padding">
                  <div className="w3-third">
                    <label>
                      <input
                        className="w3-check"
                        type="checkbox"
                        name="likedMost"
                        value="students"
                        checked={formData.likedMost.includes('students')}
                        onChange={handleLikedMostChange}
                        disabled={fieldsDisabled}
                      />{' '}
                      Students
                    </label>
                    <br />
                    <label>
                      <input
                        className="w3-check"
                        type="checkbox"
                        name="likedMost"
                        value="location"
                        checked={formData.likedMost.includes('location')}
                        onChange={handleLikedMostChange}
                        disabled={fieldsDisabled}
                      />{' '}
                      Location
                    </label>
                  </div>
                  <div className="w3-third">
                    <label>
                      <input
                        className="w3-check"
                        type="checkbox"
                        name="likedMost"
                        value="campus"
                        checked={formData.likedMost.includes('campus')}
                        onChange={handleLikedMostChange}
                        disabled={fieldsDisabled}
                      />{' '}
                      Campus
                    </label>
                    <br />
                    <label>
                      <input
                        className="w3-check"
                        type="checkbox"
                        name="likedMost"
                        value="atmosphere"
                        checked={formData.likedMost.includes('atmosphere')}
                        onChange={handleLikedMostChange}
                        disabled={fieldsDisabled}
                      />{' '}
                      Atmosphere
                    </label>
                  </div>
                  <div className="w3-third">
                    <label>
                      <input
                        className="w3-check"
                        type="checkbox"
                        name="likedMost"
                        value="dormRooms"
                        checked={formData.likedMost.includes('dormRooms')}
                        onChange={handleLikedMostChange}
                        disabled={fieldsDisabled}
                      />{' '}
                      Dorm Rooms
                    </label>
                    <br />
                    <label>
                      <input
                        className="w3-check"
                        type="checkbox"
                        name="likedMost"
                        value="sports"
                        checked={formData.likedMost.includes('sports')}
                        onChange={handleLikedMostChange}
                        disabled={fieldsDisabled}
                      />{' '}
                      Sports
                    </label>
                  </div>
                </div>

                <hr className="w3-margin-top w3-margin-bottom" />

                <p>
                  <b>How did you become interested in the university?</b>
                </p>
                <p>
                  <label className="w3-margin-right">
                    <input
                      className="w3-radio"
                      type="radio"
                      name="interestSource"
                      value="friends"
                      checked={formData.interestSource === 'friends'}
                      onChange={handleInputChange}
                      disabled={fieldsDisabled}
                    />{' '}
                    Friends
                  </label>
                  <label className="w3-margin-right">
                    <input
                      className="w3-radio"
                      type="radio"
                      name="interestSource"
                      value="television"
                      checked={formData.interestSource === 'television'}
                      onChange={handleInputChange}
                      disabled={fieldsDisabled}
                    />{' '}
                    Television
                  </label>
                  <label className="w3-margin-right">
                    <input
                      className="w3-radio"
                      type="radio"
                      name="interestSource"
                      value="internet"
                      checked={formData.interestSource === 'internet'}
                      onChange={handleInputChange}
                      disabled={fieldsDisabled}
                    />{' '}
                    Internet
                  </label>
                  <label className="w3-margin-right">
                    <input
                      className="w3-radio"
                      type="radio"
                      name="interestSource"
                      value="other"
                      checked={formData.interestSource === 'other'}
                      onChange={handleInputChange}
                      disabled={fieldsDisabled}
                    />{' '}
                    Other
                  </label>
                </p>

                <hr className="w3-margin-top w3-margin-bottom" />

                <label>
                  <b>Likelihood of recommending this school</b>
                </label>
                <select
                  className="w3-select w3-border w3-margin-top"
                  name="recommendation"
                  value={formData.recommendation}
                  onChange={handleInputChange}
                  disabled={fieldsDisabled}
                >
                  <option value="">Select one</option>
                  <option value="veryLikely">Very Likely</option>
                  <option value="likely">Likely</option>
                  <option value="unlikely">Unlikely</option>
                </select>

                <hr className="w3-margin-top w3-margin-bottom" />

                <label>
                  <b>Raffle</b> (Enter at least ten comma-separated numbers from 1-100)
                </label>
                <input
                  className="w3-input w3-border w3-margin-top"
                  type="text"
                  name="raffle"
                  placeholder="Example: 5, 12, 33, 47, 51, 63, 70, 81, 92, 100"
                  value={formData.raffle}
                  onChange={handleInputChange}
                  disabled={fieldsDisabled}
                />

                <p className="w3-small w3-text-grey">
                  Note: This field will be used to determine whether you win a free movie ticket.
                </p>

                <label>
                  <b>Additional Comments</b>
                </label>
                <textarea
                  className="w3-input w3-border w3-margin-top"
                  name="comments"
                  rows="4"
                  placeholder="Optional comments..."
                  value={formData.comments}
                  onChange={handleInputChange}
                  disabled={fieldsDisabled}
                ></textarea>

                <div className="w3-margin-top">
                  <button
                    className="w3-button w3-black w3-margin-right"
                    type="submit"
                    disabled={fieldsDisabled || isSubmitting}
                  >
                    {selectedSurveyId !== null ? 'Save Changes' : 'Submit'}
                  </button>
                  <button
                    className="w3-button w3-light-grey w3-border"
                    type="button"
                    onClick={handleNewSurveyTab}
                  >
                    {selectedSurveyId !== null ? 'Start New Survey' : 'Clear Form'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="survey-list-card w3-card w3-white w3-round-large">
              <div className="survey-list-header">
                <div>
                  <h3 className="survey-title">View All Surveys</h3>
                  <p>Browse saved surveys, then open one in read-only mode before editing.</p>
                </div>
                <button
                  type="button"
                  className="w3-button w3-black"
                  onClick={handleNewSurveyTab}
                >
                  New Survey
                </button>
              </div>

              {surveys.length === 0 ? (
                <p className="empty-state">No surveys have been saved yet.</p>
              ) : (
                <div className="survey-list">
                  <div className="survey-list-row survey-list-row--heading">
                    <span>Name</span>
                    <span>ID</span>
                    <span>Survey Date</span>
                    <span>Actions</span>
                  </div>
                  {surveys.map((survey) => (
                    <div className="survey-list-row" key={survey.id}>
                      <span>{survey.first_name} {survey.last_name}</span>
                      <span>{survey.id}</span>
                      <span>{survey.survey_date}</span>
                      <span className="survey-row-actions">
                        <button
                          type="button"
                          className="w3-button w3-light-grey w3-border survey-row-button"
                          onClick={() => handleSelectSurvey(survey)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="survey-delete-button"
                          onClick={() => void handleDeleteSurvey(survey.id)}
                          aria-label={`Delete survey ${survey.id}`}
                          title="Delete survey"
                        >
                          <img src="/trash.png" alt="" />
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <footer className="w3-center w3-black w3-padding-16">
        <p>
          Powered by{' '}
          <a
            href="https://www.w3schools.com/w3css/default.asp"
            title="W3.CSS"
            target="_blank"
            rel="noreferrer"
            className="w3-hover-text-green"
          >
            w3.css
          </a>
        </p>
      </footer>
    </>
  )
}

export default App
