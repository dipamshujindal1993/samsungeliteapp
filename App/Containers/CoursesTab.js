import React, { Component } from 'react'
import {
  View
} from 'react-native'
import { connect } from 'react-redux'

import ActivitiesActions from '@redux/ActivitiesRedux'

import Missions from '@components/Missions'
import CourseItem from '@components/CourseItem'
import ErrorScreen from '@containers/ErrorScreen'
import EndlessFlatList from '@components/EndlessFlatList'
import LoadingSpinner from '@components/LoadingSpinner'
import Separator from '@components/Separator'
import { Constants } from '@resources'
import I18n from '@i18n'
import {
  hasAccessTo,
} from '@utils/CommonUtils'

import styles from './Styles/CoursesTabStyles'
class CoursesTab extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      errorLoading: false,
      data: [],
    }
    this.pageNumber = 0
    this.updatedItem = 0
  }

  componentDidMount() {
    this._getCourses()
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      coursesFailure,
      learnerCourses
    } = this.props

    if (learnerCourses != prevProps.learnerCourses) {
      if (learnerCourses === null) {
        this.setState({
          isLoading: false,
          errorLoading: true,
        })
      } else {
        const { data, pagination } = learnerCourses
        this.total = pagination.total

        if (data && data.length) {
          let courseRecords = {}

          data.map((currentData) => {
            courseRecords = currentData.userCourseRecords ? currentData.userCourseRecords : data
          })

          this.setState({
            isLoading: false,
            data: this.pageNumber > 0 ? prevState.data.concat(courseRecords) : data,
          })

          if (!this.childActivityUpdated) {
            this._getCourseModules()
          }
        } else {
          this.setState({
            isLoading: false,
          })
        }
      }
    }

    if (prevProps.coursesFailure != coursesFailure && coursesFailure) {
      this.setState({
        isLoading: false,
        errorLoading: true,
      })
    }
  }

  _getCourses() {
    const activityType = Constants.ACTIVITY_TYPES.SIMPLIFIED_CURRICULUM
    this.props.getCourses(activityType, this.pageNumber)
  }

  _getCourseModules() {
    const { learnerCourses, getCourseModules } = this.props
    const { data } = learnerCourses
    for (let i = 0; i < data.length; i++) {
      if (i >= this.updatedItem) {
        if ((this.updatedItem + 1) == data.length) {
          this.childActivityUpdated = true
        }
        getCourseModules(data[this.updatedItem].activityId)
        this.updatedItem++
      }
    }
  }

  onItemPress = (item) => {
    const { activityId, contentType } = item
    const { navigation } = this.props
    if (contentType == Constants.CONTENT_TYPES.SCORM) {
      navigation.navigate('ScormScreen', { activityId , onClose:this.onClose})
    } else {
      navigation.navigate('CourseDetailScreen', { activityId })
    }
  }

  _renderMissions = () => {
    if (hasAccessTo(Constants.TAB_ACTIVITIES, this.props.learnTabs)) {
      return null
    }
    return <Missions />
  }

  onClose =() => {
    this._getCourses()
  }

  _renderError = () => {
    const { errorLoading } = this.state
    return (
      <ErrorScreen
        title={errorLoading ? I18n.t('learn_courses.load_error') : I18n.t('learn_courses.no_courses')}
      />
    )
  }

  renderCourses() {
    const { data, errorLoading } = this.state
    const {
      isLoadingCourses,
      pageSize,
    } = this.props
    return (
      <EndlessFlatList
        ListHeaderComponent={this._renderMissions}
        data={data}
        ItemSeparatorComponent={() => <Separator style={styles.itemSeparator} />}
        loadMore={() => {
          this.pageNumber += pageSize
          this.childActivityUpdated = false
          this._getCourses()
        }}
        loadedAll={data.length >= this.total}
        renderItem={({ item }) => <CourseItem
          item={item}
          onPress={() => this.onItemPress(item)}
        />}
        error={!isLoadingCourses && data.length == 0 || errorLoading ? this._renderError : null}
      />
    )
  }

  render() {
    const { isLoading } = this.state
    const { isLoadingCourses } = this.props
    if (isLoading) {
      return <LoadingSpinner />
    } else {
      return (
        <View style={styles.mainContainer}>
          {this.renderCourses()}
          {isLoadingCourses && <LoadingSpinner />}
        </View>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  isLoadingCourses: state.activities.isLoadingCourses,
  coursesFailure: state.activities.coursesFailure,
  learnerCourses: state.activities.learnerCourses,
  learnTabs: state.nav.learnTabs,
  pageSize: state.remoteConfig.apiConfig ? state.remoteConfig.apiConfig.default_page_size || 1 : 1,
})

const mapDispatchToProps = (dispatch) => ({
  getCourses: (activityType, pageNumber) => dispatch(ActivitiesActions.getCourses(activityType, pageNumber)),
  getCourseModules: (activityId) => dispatch(ActivitiesActions.getCourseModules(activityId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CoursesTab)
