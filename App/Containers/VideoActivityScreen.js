import React, { Component } from 'react'
import {
    ScrollView,
    Text,
    View,
} from 'react-native'
import { connect } from 'react-redux'

import ActivitiesActions from '@redux/ActivitiesRedux'
import NotificationsActions from '@redux/NotificationsRedux';
import AppActions from '@redux/AppRedux'
import Orientation from 'react-native-orientation'
import Url from 'url-parse'

import Button from '@components/Button'
import ContentHtml from '@components/ContentHtml'
import ErrorScreen from '@containers/ErrorScreen'
import LoadingSpinner from '@components/LoadingSpinner'
import ToastMessage from '@components/ToastMessage'
import Video from '@components/Video'
import { Constants } from '@resources'
import I18n from '@i18n'
import { formatString } from '@utils/TextUtils'
import { isVimeoVideo } from '@utils/VideoUtils'

import styles from './Styles/VideoActivityScreenStyles'

class VideoActivityScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            isLoadingError: false,
            isCTAClicked: false,
            disabledCTA: true,
        }
        this.videoState = {
            elapsedSeconds: 0
        }
    }

    componentDidMount() {
        this.findActivityDetail()

        const { activityId } = this.props.navigation.state.params
        this.props.getActivity(activityId)
        this._handleAppOrientation(false)
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            activities,
            postPoints,
            registerActivity,
            removeActivity,
            navigation,
            summary,
            markTaskAsComplete,
        } = this.props

        const {
            activityId,
            activityName,
            isHybridActivity,
            onCompleteMainHybridActivity
        } = navigation.state.params

        const { activityDetail, isCTAClicked } = this.state

        //getActivityDetail by matching with activityId
        if (activities != prevProps.activities && prevState.isLoading) {
            if (activities == null) {
                this.setState({
                    isLoading: false,
                    isLoadingError: true
                })
            } else {
                let currentActivityById
                activities.filter(activity => {
                    if (activity.activityId == activityId) {
                        currentActivityById = activity
                    }
                })

                this.setState({
                    activityDetail: currentActivityById,
                    isLoading: currentActivityById == undefined ? false : prevState.isLoading,
                    isLoadingError: currentActivityById == undefined,
                })
            }
        }

        if (activityDetail && prevState.isLoading) {
            this.videoState.elapsedSeconds = activityDetail.progressDetails && activityDetail.progressDetails.elapsedSeconds ? activityDetail.progressDetails.elapsedSeconds : this.videoState.elapsedSeconds

            if (!activityDetail.isRegistered && !this.registerActivityCalled) {
                this.registerActivityCalled = true
                // Register Activity if it's NOT registered
                registerActivity(activityId, summary ? summary.userId : null)
            } else if (activityDetail.registerActivityFailure) {
                // Close - If Register Parent Activity is FAILED
                ToastMessage(I18n.t('activity.activity_register_error'))
                navigation.goBack()
            }

            if (activityDetail.isRegistered) {
                this.setState({
                    isLoading: false,
                })
            }
        }

        //call post Points CH API, remove Activity from state and show points in Toast
        if (isCTAClicked && isCTAClicked !== prevState.isCTAClicked) {
            if (isHybridActivity === true) {
                onCompleteMainHybridActivity && onCompleteMainHybridActivity()
            } else {
                this.shouldPrompAppRating = true
                postPoints(activityDetail.pointsRange.max, activityId, activityName)
                removeActivity(activityId)
                ToastMessage(formatString(I18n.t('activity.awarded_points'), activityDetail.pointsRange.max))
                const { initiativeId, stepId, isMission } = navigation.state.params;
                initiativeId && markTaskAsComplete(initiativeId, stepId, isMission);
                navigation.goBack()
            }
        }
    }

    componentWillUnmount() {
        const { activityDetail, isCTAClicked } = this.state
        if (activityDetail && this.videoState.elapsedSeconds && !isCTAClicked && activityDetail.isRegistered) {
            this.props.completeActivity(activityDetail.activityId, Constants.ACTIVITY_STATUSES.IN_PROGRESS, this.videoState.elapsedSeconds)
            this.props.postActivity(activityDetail.startDate)
        }
        this._handleAppOrientation(true)
        this.shouldPrompAppRating && this.props.showHideAppRatingPrompt(true)
    }

    _handleAppOrientation(isPortraitOnly) {
        isPortraitOnly ? Orientation.lockToPortrait() : Orientation.unlockAllOrientations()
    }

    findActivityDetail() {
        const { activities } = this.props

        if (activities && activities.length > 0) {
            const { activityId } = this.props.navigation.state.params
            for (let i = 0; i < activities.length; i++) {
                var activityDetail = activities[i]
                if (activityDetail.activityId == activityId) {
                    this.videoState.elapsedSeconds = activityDetail.progressDetails ? activityDetail.progressDetails.elapsedSeconds : this.videoState.elapsedSeconds
                    this.setState({
                        isLoading: false,
                        activityDetail,
                    })
                    break
                }
            }
        }
    }

    onError = () => {
        this.setState({
            isLoadingError: true
        })
    }

    onCTAPress = () => {
        const { activityDetail } = this.state
        const { completeActivity, postActivity } = this.props
        completeActivity(activityDetail.activityId, Constants.ACTIVITY_STATUSES.ATTENDED, this.videoState.elapsedSeconds)
        postActivity(activityDetail.startDate)
        this.setState({
            isCTAClicked: true
        })
    }

    enableCTA = () => {
        this.setState({
            disabledCTA: false
        })
    }

    getVideoPlaySecs = (secs) => {
        this.videoState.elapsedSeconds = secs
    }

    getFileSource() {
        const {
            accessToken,
            apiConfig,
            tokenType,
        } = this.props
        const { activityDetail } = this.state

        let sourceObj = {}
        this.cookiesObj = {}

        if (activityDetail && activityDetail.cbtPath != null && isVimeoVideo(activityDetail.cbtPath)) {
            sourceObj = {
                uri: activityDetail.cbtPath
            }
        } else {
            sourceObj = {
                uri: `${apiConfig.st_base_url}${'/apis/api/v1/activities/'}${activityDetail.activityId}${'/content'}`,
                headers: {
                    Authorization: `${tokenType} ${accessToken}`
                }
            }
        }

        if (Platform.OS === 'ios') {
            let baseUrl = new Url(apiConfig.st_base_url, true)
            this.cookiesObj = {
                name: Constants.VIDEO_CONFIG.COOKIE_NAME,
                value: `${tokenType} ${accessToken}`,
                domain: baseUrl.hostname,
                path: Constants.VIDEO_CONFIG.COOKIE_PATH
            }
        }
        return sourceObj
    }

    renderVideo() {
        return (
            <View style={styles.videoContentContainer}>
                <Video
                    style={styles.videoPlayer}
                    sourceObj={this.getFileSource()}
                    cookiesObj={this.cookiesObj}
                    showControls={false}
                    allowDefaultFullScreen={false}
                    disableSeek={false}
                    allowFF={false}
                    enableCTA={this.enableCTA}
                    elapsedSeconds={this.videoState.elapsedSeconds}
                    getVideoPlaySecs={this.getVideoPlaySecs}
                    onError={this.onError}
                />
            </View>
        )
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

    renderContent() {
        const { activityDetail } = this.state
        return (
            <View style={styles.contentHolder}>
                <Text style={styles.contentTitle}>{activityDetail.activityName}</Text>

                {activityDetail.pointsRange && <Text style={styles.points}>{`${activityDetail.pointsRange.max}${' '}${I18n.t('activity.pts')}`}</Text>}
                {this.renderDescription(activityDetail.activityDescription)}
            </View>
        )
    }

    renderCTA() {
        const { isHybridActivity } = this.props.navigation.state.params
        return (
            <Button
                style={styles.cta}
                disabled={this.state.disabledCTA}
                title={isHybridActivity === true ? I18n.t('hybrid.next') : I18n.t('activity.complete')}
                onPress={this.onCTAPress}
            />
        )
    }

    renderVideoActivity() {
        const { activityDetail, isCTAClicked } = this.state
        if (activityDetail) {
            return (
                <>
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.contentContainer}
                    >
                        {this.renderVideo()}
                        {this.renderContent()}
                    </ScrollView>
                    {this.renderCTA()}
                    {isCTAClicked && <LoadingSpinner />}
                </>
            )
        }
        return null
    }

    render() {
        const { isLoading, isLoadingError } = this.state
        if (isLoading) {
            return <LoadingSpinner />
        } else if (isLoadingError) {
            return <ErrorScreen
                title={I18n.t('activity.load_error')}
            />
        } else {
            return (
                <View style={styles.container}>
                    {this.renderVideoActivity()}
                </View>
            )
        }
    }
}

const mapStateToProps = (state) => ({
    apiConfig: state.remoteConfig.apiConfig,
    accessToken: state.app.access_token,
    tokenType: state.app.token_type,
    activities: state.activities.activities,
    summary: state.user.summary,
})

const mapDispatchToProps = (dispatch) => ({
    getActivity: (activityId) => dispatch(ActivitiesActions.getActivity(activityId)),
    registerActivity: (activityId) => dispatch(ActivitiesActions.registerActivity(activityId)),
    completeActivity: (activityId, status, elapsedSeconds) => dispatch(ActivitiesActions.completeActivity(activityId, status, null, elapsedSeconds)),
    postPoints: (point, activityId, reason) => dispatch(ActivitiesActions.postPoints(point, activityId, Constants.TRANSACTION_TYPE.ACTIVITY, reason, Constants.TRANSACTION_SUB_TYPE.ACTIVITY.VIDEO)),
    postActivity: (availableDate) => dispatch(ActivitiesActions.postActivity(Constants.TRANSACTION_TYPE.ACTIVITY, Constants.TRANSACTION_SUB_TYPE.ACTIVITY.VIDEO, availableDate)),
    removeActivity: (activityId) => dispatch(ActivitiesActions.removeActivity(activityId)),
    showHideAppRatingPrompt: (isVisible) => dispatch(AppActions.showHideAppRatingPrompt(isVisible)),
    markTaskAsComplete: (initiativeId, stepId, isMission) => dispatch(NotificationsActions.markTaskAsComplete(initiativeId, stepId, isMission)),
})

export default connect(mapStateToProps, mapDispatchToProps)(VideoActivityScreen)
