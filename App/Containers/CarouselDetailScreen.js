import React, { Component } from 'react'
import {
  FlatList,
  ScrollView,
  Text,
  View
} from 'react-native'
import { connect } from 'react-redux'

import Button from '@components/Button'
import ContentHtml from '@components/ContentHtml'
import DotsIndicator from '@components/DotsIndicator'
import ErrorScreen from '@containers/ErrorScreen'
import LoadingSpinner from '@components/LoadingSpinner'
import ImageEx from '@components/ImageEx'
import ToastMessage from '@components/ToastMessage'
import { formatString } from '@utils/TextUtils'
import { Constants } from '@resources'
import I18n from '@i18n'
import ActivitiesActions from '@redux/ActivitiesRedux'
import NotificationsActions from '@redux/NotificationsRedux';
import AppActions from '@redux/AppRedux'

import styles from './Styles/CarouselDetailScreenStyles'
class CarouselDetailScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      isLoadingError: false,
      activeCarouselIdx: 0,
      isCTAClicked: false,
    }
  }

  componentDidMount() {
    const { activityId } = this.props.navigation.state.params
    this.props.getActivity(activityId)
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      activityId,
      activityName,
    } = this.props.navigation.state.params
    const {
      activeCarouselIdx,
      isCTAClicked
    } = this.state

    const {
      activities,
      registerActivity,
      completeActivity,
      postPoints,
      removeActivity,
      navigation,
      summary,
      markTaskAsComplete,
    } = this.props

    //get Parent Activity by matching with activityId
    if (activities !== prevProps.activities) {
      if (activities == null) {
        this.setState({
          isLoading: false,
          isLoadingError: true
        })
      } else {
        activities.filter(activity => {
          if (activity.activityId == activityId) {
            this.parentActivity = activity
          }
        })

        this.setState({
          isLoading: this.parentActivity == undefined ? false : prevState.isLoading,
          isLoadingError: this.parentActivity == undefined,
        })
      }
    }

    if (this.parentActivity && prevState.isLoading) {
      if (!this.parentActivity.isRegistered && !this.registerActivityCalled) {
        this.registerActivityCalled = true

        // Register Parent Activity if it's NOT registered
        registerActivity(activityId, summary ? summary.userId : null)
      } else if (this.parentActivity.registerActivityFailure) {
        // Close - If Register Parent Activity is FAILED
        ToastMessage(I18n.t('carousel.activity_register_error'))
        navigation.goBack()
      }

      // get child activites
      if (!this.parentActivity.childActivities && !this.isLoadingChildActivities) {
        this.isLoadingChildActivities = true
        this.props.getActivityChild(activityId)
      }

      if (this.parentActivity.isRegistered && this.parentActivity.childActivities) {
        this.setState({
          isLoading: false,
        })
      }
    }

    if (activeCarouselIdx != prevState.activeCarouselIdx) {
      // Complete Child Activity on Every Swipe if it's NOT completed
      if (this.parentActivity && prevState.activeCarouselIdx < this.parentActivity.childActivities.length - 1 && !this.parentActivity.childActivities[prevState.activeCarouselIdx].isCompleted) {
        completeActivity(this.parentActivity.childActivities[prevState.activeCarouselIdx].activityId, Constants.ACTIVITY_STATUSES.ATTENDED, activityId)
      }
      this.setState({
        activeCarouselIdx
      })
    }

    //call post Points CH API, remove Activity from state and show points in Toast
    if (isCTAClicked && isCTAClicked !== prevState.isCTAClicked && activeCarouselIdx === this.parentActivity.childActivities.length - 1) {
      this.shouldPrompAppRating = true
      postPoints(this.parentActivity.pointsRange.max, activityId, activityName)
      removeActivity(activityId)
      ToastMessage(formatString(I18n.t('carousel.awarded_points'), this.parentActivity.pointsRange.max))
      const { initiativeId, stepId, isMission } = navigation.state.params;
      initiativeId && markTaskAsComplete(initiativeId, stepId, isMission);
      navigation.goBack()
    }
  }

  componentWillUnmount() {
    this.shouldPrompAppRating && this.props.showHideAppRatingPrompt(true);
  }

  onCTAPress = () => {
    const { activityId } = this.props.navigation.state.params
    const { activeCarouselIdx } = this.state
    this.props.completeActivity(this.parentActivity.childActivities[activeCarouselIdx].activityId, Constants.ACTIVITY_STATUSES.ATTENDED, activityId)
    this.props.postActivity(this.parentActivity.startDate)
    this.setState({
      isCTAClicked: true
    })
  }

  onDotPress = (idx) => {
    this.setState({
      activeCarouselIdx: idx
    })
  }

  renderDescription(activityDescription) {
    if (activityDescription && activityDescription.match(Constants.HTML_PATTERN)) {
      return (
        <ContentHtml htmlContent={activityDescription} style={styles.htmlContainer} />
      )
    } else {
      return (
        <Text style={styles.contentDescription}>{activityDescription}</Text>
      )
    }
  }

  renderHeroImage(uri) {
    return (
      <View style={styles.heroImageContainer}>
        <ImageEx
          style={styles.heroImage}
          source={{ uri }}
        />
      </View>
    )
  }

  renderCTA() {
    return (
      <Button
        style={styles.cta}
        title={I18n.t('carousel.complete')}
        onPress={this.onCTAPress}
      />
    )
  }

  _renderIndicator = (activityChild, activeCarouselIdx) => {
    return (
      <DotsIndicator
        activeDotIndex={activeCarouselIdx}
        dotsData={activityChild}
        style={styles.dotsContainer}
      />
    )
  }

  _renderCarouselDetail = (carousel, index) => {
    const {
      activeCarouselIdx,
    } = this.state
    if (index == activeCarouselIdx) {
      return (
        <View>
          <Text style={styles.contentTitle}>{carousel.activityName}</Text>
          {this.renderDescription(carousel.activityDescription)}
        </View>
      )
    }
  }

  _renderCarouselItem = ({ item, index }) => {
    const {
      activeCarouselIdx,
    } = this.state
    var style = index === activeCarouselIdx ? styles.carouselMiddleItem : styles.carouselMiddleItemInactive
    if (index === 0) {
      style = index === activeCarouselIdx ? styles.carouselFirstItem : styles.carouselFirstItemInactive
    } else if (index === this.parentActivity.childActivities.length - 1) {
      style = index === activeCarouselIdx ? styles.carouselLastItem : styles.carouselLastItemInactive
    }
    return (
      <ScrollView style={style}>
        {this.renderHeroImage(item.activityImageUrl || item.imageURL)}
        {this._renderIndicator(this.parentActivity.childActivities, activeCarouselIdx)}
        {this._renderCarouselDetail(item, index)}
      </ScrollView>
    )
  }

  _onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      this.setState({
        activeCarouselIdx: viewableItems[0].index,
      })
    }
  }

  render() {
    const { isLoading, isLoadingError, activeCarouselIdx } = this.state

    if (isLoading) {
      return <LoadingSpinner />
    } else if (isLoadingError) {
      return <ErrorScreen
        title={I18n.t('activity.load_activity_error')}
      />
    } else {
      if (this.parentActivity && this.parentActivity.childActivities) {
        return (
          <View style={styles.container}>
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              horizontal={true}
              pagingEnabled={true}
              data={this.parentActivity.childActivities}
              renderItem={this._renderCarouselItem}
              viewabilityConfig={{
                itemVisiblePercentThreshold: 75
              }}
              onViewableItemsChanged={this._onViewableItemsChanged}
              showsHorizontalScrollIndicator={false}
            />
            {activeCarouselIdx === this.parentActivity.childActivities.length - 1 &&
              this.renderCTA()
            }
          </View>
        )
      } else {
        return null
      }
    }
  }
}

const mapStateToProps = (state) => ({
  activities: state.activities.activities,
  summary: state.user.summary,
})

const mapDispatchToProps = (dispatch) => ({
  getActivity: (activityId) => dispatch(ActivitiesActions.getActivity(activityId)),
  getActivityChild: (activityId) => dispatch(ActivitiesActions.getActivityChild(activityId)),
  registerActivity: (activityId) => dispatch(ActivitiesActions.registerActivity(activityId)),
  completeActivity: (activityId, status, parentActivityId) => dispatch(ActivitiesActions.completeActivity(activityId, status, parentActivityId)),
  postPoints: (point, activityId, reason) => dispatch(ActivitiesActions.postPoints(point, activityId, Constants.TRANSACTION_TYPE.ACTIVITY, reason, Constants.TRANSACTION_SUB_TYPE.ACTIVITY.CAROUSEL)),
  postActivity: (availableDate) => dispatch(ActivitiesActions.postActivity(Constants.TRANSACTION_TYPE.ACTIVITY, Constants.TRANSACTION_SUB_TYPE.ACTIVITY.CAROUSEL, availableDate)),
  removeActivity: (activityId) => dispatch(ActivitiesActions.removeActivity(activityId)),
  showHideAppRatingPrompt: (isVisible) => dispatch(AppActions.showHideAppRatingPrompt(isVisible)),
  markTaskAsComplete: (initiativeId, stepId, isMission) => dispatch(NotificationsActions.markTaskAsComplete(initiativeId, stepId, isMission)),
})
export default connect(mapStateToProps, mapDispatchToProps)(CarouselDetailScreen)
