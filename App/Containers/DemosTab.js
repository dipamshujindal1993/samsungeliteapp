import React, { Component } from 'react'
import { View, Platform } from 'react-native'
import Url from 'url-parse'
import { connect } from 'react-redux'

import ActivitiesActions from '@redux/ActivitiesRedux'

import Widget from '@components/Widget'
import Carousel from '@components/Carousel'
import EndlessFlatList from '@components/EndlessFlatList'
import ErrorScreen from '@containers/ErrorScreen'
import LoadingSpinner from '@components/LoadingSpinner'
import Separator from '@components/Separator'
import TopicItem from '@components/TopicItem'
import I18n from '@i18n'
import { Constants } from '@resources'
import { isFeatureSupported } from '@utils/CommonUtils'
import { getFileExtension } from '@utils/CommonUtils'
import { isVimeoVideo } from '@utils/VideoUtils'
import { openActivityDetail } from '@services/LinkHandler'

import styles from './Styles/DemosTabStyles'

class DemosTab extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
    }
    this.pageNumber = 0
    this.activityCount = 2

    const {
      userAudiences,
      gamesFeature,
    } = props
    this.gamesEnabled = userAudiences && isFeatureSupported(gamesFeature, userAudiences.data)
  }

  componentDidMount() {
    if (this.gamesEnabled) {
      this.props.getCourses(Constants.ACTIVITY_TYPES.GAME)
    }
    this._getSubTopics()
  }

  componentDidUpdate(prevProps, prevState) {
    const { topicId, demos } = this.props
    if (demos && demos != prevProps.demos) {
      const { rootTopicId, topicActivities, totalSubtopics } = demos
      this.total = totalSubtopics
      if (topicActivities && topicActivities.length && rootTopicId == topicId) {
        this.setState({
          data: this.pageNumber > 0 ? prevState.data.concat(topicActivities) : topicActivities,
        })
      }
    }
  }

  _getSubTopics() {
    const { topicId, getSubTopics } = this.props
    const topicType = Constants.TOPIC_TYPES.DEMOS
    getSubTopics(topicId, topicType, this.activityCount, this.pageNumber)
  }

  showLoading = (isFileDownloading) => {
    this.setState({
      isFileDownloading
    })
  }

  _openActivityDetail(activity) {
    const {
      accessToken,
      apiConfig,
      tokenType
    } = this.props

    const { activityId, activityType, contentType, cbtPath } = activity

    let cookiesObj = {}
    let sourceObj = {}

    if (cbtPath && cbtPath != null && isVimeoVideo(cbtPath)) {
      sourceObj = {
        uri: cbtPath
      }
    } else {
      sourceObj = {
        uri: `${apiConfig.st_base_url}${'/apis/api/v1/activities/'}${activityId}${'/content'}`,
        headers: {
          Authorization: `${tokenType} ${accessToken}`
        }
      }
    }

    if (Platform.OS === 'android' && activityType == Constants.ACTIVITY_TYPES.DOCUMENT) {
      sourceObj.extension = getFileExtension(contentType)
    }

    if (Platform.OS === 'ios' && contentType == Constants.CONTENT_TYPES.VIDEO) {
      let baseUrl = new Url(apiConfig.st_base_url, true)

      cookiesObj = {
        name: Constants.VIDEO_CONFIG.COOKIE_NAME,
        value: `${tokenType} ${accessToken}`,
        domain: baseUrl.hostname,
        path: Constants.VIDEO_CONFIG.COOKIE_PATH
      }
    }
    openActivityDetail(activity, null, sourceObj, cookiesObj, (isLoad) => this.showLoading(isLoad))
  }

  onPressSeeAll = (topicId, topicName) => {
    this.props.navigation.navigate('TopicActivitiesScreen', { topicId, headerTitle: topicName, parentScreen: Constants.TOPIC_TYPES.DEMOS })
  }

  onPressSelectItem = (item) => {
    this.props.navigation.navigate('ArticleDetailScreen', { activityId: item.activityId })
  }

  _onRefresh = () => {
    this.props.getCourses(Constants.ACTIVITY_TYPES.GAME)
  }

  _renderGames = () => {
    if (this.gamesEnabled) {
      const { isLoadingGames, games, gamesFailure } = this.props
      if (isLoadingGames) {
        return (
          <Widget isLoading={true} />
        )
      } else if (gamesFailure) {
        return (
          <Widget
            message={I18n.t('learn_demo.load_games_error')}
            onRefresh={this._onRefresh}
          />
        )
      } else {
        return (
          <Carousel
            type={Constants.CAROUSEL_TYPES.GAME}
            data={games}
            style={styles.gamesContainer}
            onPressSelectItem={this.onPressSelectItem}
          />
        )
      }
    }
    return null
  }

  _renderError = () => {
    const { demosFailure } = this.props
    return (
      <ErrorScreen
        title={demosFailure ? I18n.t('learn_demo.load_error') : I18n.t('learn_demo.no_demos')}
      />
    )
  }

  renderSubTopics() {
    const { isLoadingDemos, demosFailure } = this.props

    const { data } = this.state

    return (
      <EndlessFlatList
        ListHeaderComponent={this._renderGames}
        data={data}
        ItemSeparatorComponent={() => <Separator style={styles.itemSeparator} />}
        loadMore={() => {
          this.pageNumber++
          this._getSubTopics()
        }}
        loadedAll={data.length >= this.total}
        renderItem={({ item }) => <TopicItem
          item={item}
          onPressItem={(activity) => this._openActivityDetail(activity)}
          onPressSeeAll={(topicId, topicName) => this.onPressSeeAll(topicId, topicName)}
        />}
        error={!isLoadingDemos && data.length == 0 || demosFailure ? this._renderError : null}
      />
    )
  }

  render() {
    const { isFileDownloading } = this.state
    return (
      <View style={styles.mainContainer}>
        {this.renderSubTopics()}
        {isFileDownloading && <LoadingSpinner />}
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  apiConfig: state.remoteConfig.apiConfig,
  accessToken: state.app.access_token,
  tokenType: state.app.token_type,
  userAudiences: state.user.audiences,
  gamesFeature: state.remoteConfig.featureConfig.games,
  games: state.activities.games,
  gamesFailure: state.activities.gamesFailure,
  topicId: state.remoteConfig.featureConfig.demos_topic_id,
  demos: state.activities.demos,
  demosFailure: state.activities.demosFailure,
  isLoadingGames: state.activities.isLoadingGames,
  isLoadingDemos: state.activities.isLoadingDemos,
})

const mapDispatchToProps = (dispatch) => ({
  getCourses: (activityType) => dispatch(ActivitiesActions.getCourses(activityType)),
  getSubTopics: (topicId, topicType, activityCount, pageNumber) => dispatch(ActivitiesActions.getSubTopics(topicId, topicType, activityCount, pageNumber))
})
export default connect(mapStateToProps, mapDispatchToProps)(DemosTab)