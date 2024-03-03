import React, { Component } from 'react'
import { View, Platform } from 'react-native'
import Url from 'url-parse'
import { connect } from 'react-redux'

import ActivitiesActions from '@redux/ActivitiesRedux'

import ErrorScreen from '@containers/ErrorScreen'
import EndlessFlatList from '@components/EndlessFlatList'
import LoadingSpinner from '@components/LoadingSpinner'
import Separator from '@components/Separator'
import TopicItem from '@components/TopicItem'
import { Constants, Colors } from '@resources'
import I18n from '@i18n'
import { getFileExtension } from '@utils/CommonUtils'
import { isVimeoVideo } from '@utils/VideoUtils'
import { openActivityDetail } from '@services/LinkHandler'
import HistoryIcon from '@svg/icon_history.svg'

import styles from './Styles/MerchandisingScreenStyles'

class MerchandisingScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
        }
        this.pageNumber = 0
        this.activityCount = 2
    }

    componentDidMount() {
        this._getSubTopics()
    }

    componentDidUpdate(prevProps, prevState) {
        const { topicId, merchandises } = this.props

        if (merchandises && merchandises != prevProps.merchandises) {
            const { rootTopicId, topicActivities, totalSubtopics } = merchandises
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
        const topicType = Constants.TOPIC_TYPES.MERCHANDISING
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
        this.props.navigation.navigate('TopicActivitiesScreen', { topicId, headerTitle: topicName, parentScreen: Constants.TOPIC_TYPES.MERCHANDISING })
    }

    renderSubTopics() {
        const {
            isLoadingMerchandises,
            merchandisesFailure,
        } = this.props
        const { data } = this.state

        if (data.length) {
            return (
                <EndlessFlatList
                    data={data}
                    ItemSeparatorComponent={() => <Separator style={styles.itemSeparator} />}
                    loadMore={() => {
                        this.pageNumber++
                        this._getSubTopics()
                    }}
                    loadedAll={data.length >= this.total}
                    renderItem={({ item }) => <TopicItem
                        item={item}
                        onPressItem={(item) => this._openActivityDetail(item)}
                        onPressSeeAll={(topicId, topicName) => this.onPressSeeAll(topicId, topicName)}
                    />}
                />
            )
        } else if (!isLoadingMerchandises) {
            return (
                <ErrorScreen
                    icon={!merchandisesFailure && <HistoryIcon fill={Colors.rgb_4a4a4a} width={44} height={45} />}
                    title={merchandisesFailure ? I18n.t('merchandising.load_error') : I18n.t('merchandising.no_merchandising')}
                />
            )
        }
    }

    render() {
        const { isLoadingMerchandises } = this.props
        const { isFileDownloading } = this.state
        return (
            <View style={styles.mainContainer}>
                {this.renderSubTopics()}
                {(isLoadingMerchandises || isFileDownloading) && <LoadingSpinner />}
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    apiConfig: state.remoteConfig.apiConfig,
    accessToken: state.app.access_token,
    tokenType: state.app.token_type,
    topicId: state.remoteConfig.featureConfig.merchandising_topic_id,
    isLoadingMerchandises: state.activities.isLoadingMerchandises,
    merchandises: state.activities.merchandises,
    merchandisesFailure: state.activities.merchandisesFailure,
})

const mapDispatchToProps = (dispatch) => ({
    getSubTopics: (topicId, topicType, activityCount, pageNumber) => dispatch(ActivitiesActions.getSubTopics(topicId, topicType, activityCount, pageNumber))
})

export default connect(mapStateToProps, mapDispatchToProps)(MerchandisingScreen)