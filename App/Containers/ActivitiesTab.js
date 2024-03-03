import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import ActivitiesActions from '@redux/ActivitiesRedux'

import Missions from '@components/Missions'
import ActivityItem from '@components/ActivityItem'
import ErrorScreen from '@containers/ErrorScreen'
import EndlessFlatList from '@components/EndlessFlatList'
import LoadingSpinner from '@components/LoadingSpinner'
import Separator from '@components/Separator'
import { Constants } from '@resources'
import I18n from '@i18n'
import { openActivityDetail } from '@services/LinkHandler'

import styles from './Styles/ActivitiesTabStyles'
class ActivitiesTab extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      errorLoading: false,
      data: [],
    }
    this.pageNumber = 0
  }

  componentDidMount() {
    this.getActivities()
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      activitiesFailure,
      learnerActivities,
    } = this.props
    if (learnerActivities != prevProps.learnerActivities) {
      if (learnerActivities === null) {
        this.setState({
          isLoading: false,
          errorLoading: true,
        })
      } else {
        const { data, pagination } = learnerActivities
        this.total = pagination.total

        if (data && data.length) {
          this.setState({
            isLoading: false,
            data
          })
          this.loadingMore = false
        } else {
          this.setState({
            isLoading: false,
          })
        }
      }
    }

    if (prevProps.activitiesFailure != activitiesFailure && activitiesFailure) {
      this.setState({
        isLoading: false,
        errorLoading: true,
      })
    }
  }

  getActivities() {
    const activityType = Constants.ACTIVITIES
    this.props.getCourses(activityType, this.pageNumber)
  }

  _renderError = () => {
    const { errorLoading } = this.state
    return (
      <ErrorScreen
        title={errorLoading ? I18n.t('activities.load_error') : I18n.t('activities.msg_no_activities')}
      />
    )
  }

  _renderHeader = () => {
    return (
      <Missions />
    )
  }

  renderActivities() {
    const { data, errorLoading } = this.state
    const {
      isLoadingActivities,
      employeeType,
      pageSize,
    } = this.props
    return (
      <EndlessFlatList
        ListHeaderComponent={this._renderHeader}
        data={data}
        ItemSeparatorComponent={({ leadingItem }) => leadingItem.status != Constants.COURSE_STATUSES.COMPLETED ? <Separator style={styles.itemSeparator} /> : null}
        loadMore={() => {
          if (!this.loadingMore) {
            this.pageNumber += pageSize
            this.getActivities()
            this.loadingMore = true
          }
        }}
        loadedAll={data.length >= this.total}
        renderItem={({ item }) => item.status != Constants.COURSE_STATUSES.COMPLETED ? <ActivityItem
          employeeType={employeeType}
          item={item}
          onPress={() => openActivityDetail(item)}
        /> : null
        }
        error={!isLoadingActivities && data.length == 0 || errorLoading ? this._renderError : null}
      />
    )
  }

  render() {
    const { isLoading } = this.state
    if (isLoading) {
      return <LoadingSpinner />
    } else {
      return (
        <View style={styles.mainContainer}>
          {this.renderActivities()}
        </View>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  isLoadingActivities: state.activities.isLoadingActivities,
  activitiesFailure: state.activities.activitiesFailure,
  learnerActivities: state.activities.learnerActivities,
  employeeType: state.user.summary ? state.user.summary.employeeType : undefined,
  pageSize: state.remoteConfig.apiConfig ? state.remoteConfig.apiConfig.default_page_size || 1 : 1,
})

const mapDispatchToProps = (dispatch) => ({
  getCourses: (activityType, pageNumber) => dispatch(ActivitiesActions.getCourses(activityType, pageNumber))
})

export default connect(mapStateToProps, mapDispatchToProps)(ActivitiesTab)