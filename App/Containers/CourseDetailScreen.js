import React, { Component } from 'react'
import {
    FlatList,
    Text,
    TouchableOpacity,
    View,
    Platform
} from 'react-native'
import Url from 'url-parse'
import { connect } from 'react-redux'

import ActivitiesActions from '@redux/ActivitiesRedux'
import NotificationsActions from '@redux/NotificationsRedux';
import AppActions from '@redux/AppRedux'
import Dialog from '@components/Dialog'
import ErrorScreen from '@containers/ErrorScreen'
import LoadingSpinner from '@components/LoadingSpinner'
import Separator from '@components/Separator'
import ToastMessage from '@components/ToastMessage'
import I18n from '@i18n'
import DebugConfig from '@config/DebugConfig'
import { openActivityDetail } from '@services/LinkHandler'
import { formatString } from '@utils/TextUtils'
import { getFileExtension } from '@utils/CommonUtils'
import { isVimeoVideo } from '@utils/VideoUtils'
import { Colors, Constants } from '@resources'

import CompleteIcon from '@svg/icon_complete.svg'

import styles from './Styles/CourseDetailScreenStyles'
class CourseDetailScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            isLoadingError: false,
            isDialogVisible: false
        }
    }
    componentDidMount() {
        const { getActivity, navigation } = this.props
        const { activityId } = navigation.state.params
        getActivity(activityId)
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            activities,
            channelId,
            courseModules,
            courseModulesFail,
            learnerCourses,
            navigation,
            registerActivity
        } = this.props

        const { activityId } = navigation.state.params
        const { isFileDownloading } = this.state

        if (activities !== prevProps.activities && prevState.isLoading) {
            if (activities == null) {
                this.setState({
                    isLoading: false,
                    isLoadingError: true
                })
            } else {
                activities.filter(activity => {
                    if (activity.activityId == activityId) {
                        this.currentCourse = activity
                    }
                })

                this.setState({
                    isLoading: this.currentCourse == undefined ? false : prevState.isLoading,
                    isLoadingError: this.currentCourse == undefined,
                })
            }
        }

        if (this.currentCourse && prevState.isLoading) {
            if (channelId) {
                if (!this.currentCourse.isRegistered && !this.registerActivityCalled) {
                    this.registerActivityCalled = true
                    // Register Parent Course if it's NOT registered
                    registerActivity(activityId)
                } else if (this.currentCourse.registerActivityFailure) {
                    // Close - If Register Parent Course is FAILED
                    ToastMessage(I18n.t('courses.course_register_error'))
                    navigation.goBack()
                }
            }

            if ((!channelId || this.currentCourse.isRegistered) && !this.getCourseModulesCalled) {
                this.getCourseModulesCalled = true
                this._getCourseModules()
            }
        }

        if (courseModules != prevProps.courseModules && prevState.isLoading) {
            this.setState({
                isLoading: false
            })
        }

        if (courseModulesFail && courseModulesFail != prevProps.courseModules && prevState.isLoading) {
            this.setState({
                isLoading: false
            })
        }

        if (courseModules != prevProps.courseModules) {
            if(this.showDialog){
                this.setState({
                    isDialogVisible: this.showDialog
                })
            }
            this.checkToMarkTaskAsComplete()
        }

        if (this.isVideoActivity && this.currentActivity && activities && activities != prevProps.activities && isFileDownloading) {
            activities.filter(activity => {
                if (activity.activityId == this.currentActivity.activityId) {
                    this.currentActivity = activity
                }
            })
            if (this.currentActivity && !this.currentActivity.isRegistered && !DebugConfig.skipRegisterAssessment) {
                registerActivity(this.currentActivity.activityId)
            } else if (this.currentActivity && (this.currentActivity.isRegistered || DebugConfig.skipRegisterAssessment)) {
                this.showLoading(false)
                this._openActivityDetail()
            } else {
                this.showLoading(false)
                ToastMessage(I18n.t('courses.course_register_error'))
            }
        }

        if (learnerCourses && learnerCourses != prevProps.learnerCourses && isFileDownloading) {
            this.showLoading(false)
            this._getCourseModules()
        }
    }

    componentWillUnmount() {
        this.shouldPrompAppRating && this.props.showHideAppRatingPrompt(true);
    }

    _getCourseModules = (data) => {
        const { navigation, getCourseModules } = this.props
        const { activityId } = navigation.state.params
        if (data) {
            const { assessmentTitle, showDialog, activeAssessmentId } = data
            this.assessmentTitle = assessmentTitle
            this.showDialog = showDialog
            this.activeAssessmentId = activeAssessmentId
        }
        getCourseModules(activityId)
    }

    _postCompleteActivity = () => {
        const { completeActivity, navigation } = this.props
        const { activityId } = navigation.state.params
        this.currentActivity = null
        this.showLoading(true)
        completeActivity(this.activeAssessmentId, Constants.ACTIVITY_STATUSES.ATTENDED, activityId)
    }

    checkToMarkTaskAsComplete() {
        const { navigation, markTaskAsComplete, courseModules } = this.props
        if (courseModules && courseModules.childActivities.length) {
            let childActivities = courseModules.childActivities
            let completedCourseModules = 0
            childActivities.filter((child) => {
                if (child.isCompleted) {
                    completedCourseModules++
                }
            })
            if (courseModules.childActivities.length == completedCourseModules) {
                const {  initiativeId, stepId, isMission } = navigation.state.params
                initiativeId && markTaskAsComplete(initiativeId, stepId, isMission)
            }
        }
    }

    showLoading = (isFileDownloading) => {
        this.setState({
            isFileDownloading
        })
    }

    onDialogPositivePress = (param) => {
        const { navigation } = this.props
        const { isRetake, nextAssessmentId } = param
        if (isRetake) {
            this.setState({
                isDialogVisible: false
            })
            navigation.navigate('AssessmentScreen', { activityId: this.activeAssessmentId, onSucess: this._getCourseModules })
        } else {
            this.setState({
                isDialogVisible: false,
            })
            if (nextAssessmentId) {
                navigation.navigate('AssessmentScreen', { activityId: nextAssessmentId, onSucess: this._getCourseModules })
            } else {
                navigation.goBack()
            }
        }
    }

    onDialogNegativePress = () => {
        this.shouldPrompAppRating = true
        this.setState({
            isDialogVisible: false
        }, () => this.props.navigation.goBack())
    }

    onPressItem = (item) => {
        const { navigation, getActivity } = this.props
        const { activityId, contentType } = item
        this.showDialog = false
        switch (contentType) {
            case Constants.CONTENT_TYPES.DOCUMENT:
            case Constants.CONTENT_TYPES.PDF:
                this.currentActivity = item
                this.isVideoActivity = false
                this._openActivityDetail()
                break
            case Constants.CONTENT_TYPES.VIDEO:
                this.currentActivity = item
                this.isVideoActivity = true
                this.showLoading(true)
                getActivity(activityId)
                break
            case Constants.CONTENT_TYPES.QUIZ:
                navigation.navigate('AssessmentScreen', { activityId, onSucess: this._getCourseModules })
                break
        }
    }

    _openActivityDetail() {
        const {
            accessToken,
            apiConfig,
            tokenType
        } = this.props

        const { activityId, contentType, cbtPath } = this.currentActivity
        this.activeAssessmentId = activityId

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

        if (Platform.OS === 'android' && (contentType == Constants.CONTENT_TYPES.DOCUMENT || contentType == Constants.CONTENT_TYPES.PDF)) {
            sourceObj.extension = getFileExtension(contentType)
        } else {
            if (Platform.OS === 'ios') {
                let baseUrl = new Url(apiConfig.st_base_url, true)

                cookiesObj = {
                    name: Constants.VIDEO_CONFIG.COOKIE_NAME,
                    value: `${tokenType} ${accessToken}`,
                    domain: baseUrl.hostname,
                    path: Constants.VIDEO_CONFIG.COOKIE_PATH
                }
            }
        }
        openActivityDetail(this.currentActivity, null, sourceObj, cookiesObj, (isLoad) => this.showLoading(isLoad), this._postCompleteActivity)
    }

    renderResultsDialog() {
        const { isDialogVisible } = this.state
        const { courseModules } = this.props

        let dialogMessage, dialogPositiveTitle, dialogPositiveOnPress = () => { }

        if (courseModules && courseModules.childActivities.length) {
            let childActivities = courseModules.childActivities

            const completed = childActivities.filter((child, idx) => {
                if (child.activityId == this.activeAssessmentId) {
                    this.activeAssessmentResult = child.isCompleted
                    this.activeAssessment = idx
                }
                if (child.isCompleted) {
                    return child
                }
            })

            if (this.activeAssessmentResult) {
                if (childActivities.length > parseInt(this.activeAssessment + 1)) {
                    this.activeAssessment += 1
                    for (var i = this.activeAssessment; i < childActivities.length; i++) {
                        if (childActivities[i].activityType == Constants.ACTIVITY_TYPES.QUICK_ASSESSMENT) {
                            dialogPositiveTitle = I18n.t('assessment.dialog_cta_positive')
                            dialogMessage = formatString(I18n.t('assessment.dialog_next_description'), this.assessmentTitle, completed.length, childActivities.length)
                            this.activeAssessment = i
                            dialogPositiveOnPress = () => this.onDialogPositivePress({ isRetake: false, nextAssessmentId: childActivities[this.activeAssessment].activityId })
                            break
                        }
                    }
                } else {
                    dialogMessage = formatString(I18n.t('assessment.dialog_description'), this.assessmentTitle, completed.length, childActivities.length)
                }
            } else {
                dialogMessage = formatString(I18n.t('assessment.dialog_fail_description'), this.assessmentTitle)
                dialogPositiveTitle = I18n.t('assessment.dialog_fail_cta_positive')
                dialogPositiveOnPress = () => this.onDialogPositivePress({ isRetake: true })
            }
        }

        return (
            dialogMessage && <Dialog
                visible={isDialogVisible}
                title={I18n.t('assessment.quiz_results')}
                message={dialogMessage}
                positive={dialogPositiveTitle}
                negative={I18n.t('assessment.dialog_cta_negative')}
                positiveOnPress={dialogPositiveOnPress}
                negativeOnPress={() => this.onDialogNegativePress()}
                textAlign={'left'}
            />
        )
    }

    renderItem(item) {
        const {
            activityType,
            activityName,
            isCompleted
        } = item

        return (
            <View style={styles.itemContainer} >
                {activityType == Constants.ACTIVITY_TYPES.VIDEO &&
                    <View style={styles.itemVideoContainer} >
                    </View>
                }
                <TouchableOpacity style={styles.itemDetailContainer} disabled={!this.onPressItem} onPress={() => this.onPressItem(item)}>
                    <Text style={styles.itemTitle}>{activityName}</Text>
                    {isCompleted && <CompleteIcon fill={Colors.rgb_54da8d} width={22} height={22} />}
                </TouchableOpacity>
            </View>
        )
    }

    renderError() {
        const { courseModules, courseModulesFail } = this.props
        const { isLoadingError } = this.state
        let errorTitle, errorMessage

        if (courseModulesFail || isLoadingError) {
            errorTitle = I18n.t('courses.load_error')
        } else if (!courseModules || !courseModules.childActivities || !courseModules.childActivities.length) {
            errorTitle = I18n.t('generic_error.title')
            errorMessage = I18n.t('generic_error.message')
        }

        return errorTitle && <ErrorScreen title={errorTitle} message={errorMessage} />
    }

    renderCourseModules() {
        const { courseModules } = this.props
        if (courseModules && courseModules.childActivities && courseModules.childActivities.length) {
            return (
                <FlatList
                    data={courseModules.childActivities}
                    ItemSeparatorComponent={() => <Separator style={styles.separator} />}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => this.renderItem(item)}
                    style={styles.listContainer}
                />
            )
        } else {
            return this.renderError()
        }
    }

    render() {
        const { isDialogVisible, isLoading, isFileDownloading } = this.state
        const { isLoadingCourseModules } = this.props
        if (isLoading) {
            return <LoadingSpinner />
        } else {
            return (
                <View style={styles.container}>
                    {this.renderCourseModules()}
                    {(isLoadingCourseModules || isFileDownloading) && <LoadingSpinner />}
                    {!isLoadingCourseModules && isDialogVisible && this.renderResultsDialog()}
                </View>
            )
        }
    }
}

const mapStateToProps = (state) => ({
    apiConfig: state.remoteConfig.apiConfig,
    accessToken: state.app.access_token,
    tokenType: state.app.token_type,
    channelId: state.user.channelId,
    isLoadingCourseModules: state.activities.isLoadingCourseModules,
    courseModules: state.activities.courseModules,
    courseModulesFail: state.activities.courseModulesFail,
    activities: state.activities.activities,
    learnerCourses: state.activities.learnerCourses
})

const mapDispatchToProps = (dispatch) => ({
    getCourseModules: (activityId) => dispatch(ActivitiesActions.getCourseModules(activityId)),
    completeActivity: (activityId, status, parentActivityId) => dispatch(ActivitiesActions.completeActivity(activityId, status, parentActivityId)),
    getActivity: (activityId) => dispatch(ActivitiesActions.getActivity(activityId)),
    registerActivity: (activityId) => dispatch(ActivitiesActions.registerActivity(activityId)),
    showHideAppRatingPrompt: (isVisible) => dispatch(AppActions.showHideAppRatingPrompt(isVisible)),
    markTaskAsComplete: (initiativeId, stepId, isMission) => dispatch(NotificationsActions.markTaskAsComplete(initiativeId, stepId, isMission)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CourseDetailScreen)
