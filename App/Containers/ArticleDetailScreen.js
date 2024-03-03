import React, { Component } from 'react'
import {
  ScrollView,
  Text,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import ActivitiesActions from '@redux/ActivitiesRedux'
import AppActions from '@redux/AppRedux'
import ContentHtml from '@components/ContentHtml'
import ErrorScreen from '@containers/ErrorScreen'
import HeaderTitle from '@components/HeaderTitle'
import ImageEx from '@components/ImageEx'
import LoadingSpinner from '@components/LoadingSpinner'
import I18n from '@i18n'
import ProTag from '@components/ProTag'
import { Constants } from '@resources'

import styles from './Styles/ArticleDetailScreenStyles'
class ArticleDetailScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <HeaderTitle title={navigation.getParam('headerTitle')} />,
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      isLoadingError: false,
      activityDetail: null,
    }
  }

  componentDidMount() {
    this.startTimer()
    this.findArticleDetail()
    const { getActivity, navigation } = this.props
    const { activityId } = navigation.state.params
    getActivity(activityId)
  }

  findArticleDetail() {
    const { articleDetails } = this.props
    if (articleDetails && articleDetails.length > 0) {
      const { activityId } = this.props.navigation.state.params
      for (let i = 0; i < articleDetails.length; i++) {
        var activityDetail = articleDetails[i]
        if (activityDetail.activityId == activityId) {
          this.setState({
            isLoading: false,
            activityDetail,
          })
          break
        }
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { activityId } = this.props.navigation.state.params
    const { articleDetails } = this.props
    //get Activity by matching with activityId
    if (articleDetails !== prevProps.articleDetails && prevState.isLoading) {
      if (articleDetails == null) {
        this.setState({
          isLoading: false,
          isLoadingError: true
        })
      } else {
        let currentActivityById;
        articleDetails.filter(activity => {
          if (activity.activityId == activityId) {
            currentActivityById = activity
          }
        })
        this.setState({
          isLoading: false,
          activityDetail: currentActivityById,
          isLoadingError: currentActivityById == undefined,
        })
      }
    }
  }

  renderHeroImage(uri) {
    const { employeeType } = this.props
    const { activityDetail } = this.state
    const showProTag = employeeType === Constants.EMPLOYEE_TYPES.ADVOCATE
      && activityDetail.activityOptionalFields.optionalInteger === Constants.PRO_CONTENT
    return (
      <View style={styles.heroImageContainer}>
        {showProTag && <ProTag style={styles.proTag} />}
        <ImageEx
          style={styles.heroImage}
          source={{ uri }}
        />
      </View>
    )
  }

  startTimer() {
    this.timer = setInterval(() => this.shouldPrompAppRating = true, this.props.timeSpent * 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.shouldPrompAppRating && this.props.showHideAppRatingPrompt(true);
  }

  render() {
    const {
      activityDetail,
      isLoading,
      isLoadingError
    } = this.state

    if (isLoading) {
      return <LoadingSpinner />
    } else if (isLoadingError) {
      return <ErrorScreen
        title={I18n.t('generic_error.title')}
        message={I18n.t('generic_error.message')}
      />
    } else if (activityDetail) {
      return (
        <View style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
          >
            {this.renderHeroImage(activityDetail.activityImageUrl)}
            <View style={styles.contentHolder}>
              <Text style={styles.contentTitle}>{activityDetail.activityName}</Text>
              <ContentHtml htmlContent={activityDetail.activityDescription} style={styles.htmlContainer} />
            </View>
          </ScrollView>
        </View>
      )
    }
    return null
  }
}

const mapStateToProps = (state) => ({
  articleDetails: state.activities.articleDetails,
  timeSpent: state.remoteConfig.featureConfig.time_spent,
  employeeType: state.user.summary ? state.user.summary.employeeType : undefined,
})

const mapDispatchToProps = (dispatch) => ({
  getActivity: (activityId) => dispatch(ActivitiesActions.getActivity(activityId)),
  showHideAppRatingPrompt: (isVisible) => dispatch(AppActions.showHideAppRatingPrompt(isVisible))
})

export default connect(mapStateToProps, mapDispatchToProps)(ArticleDetailScreen)
