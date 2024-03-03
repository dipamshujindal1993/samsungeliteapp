import React, { Component } from 'react';
import {  StatusBar, View } from 'react-native';
import { connect } from 'react-redux';
import ActivitiesActions from '@redux/ActivitiesRedux';
import NotificationsActions from '@redux/NotificationsRedux'
import Orientation from 'react-native-orientation';
import { WebView } from 'react-native-webview';
import ErrorScreen from '@containers/ErrorScreen'
import HeaderTitle from '@components/HeaderTitle';
import LoadingSpinner from '@components/LoadingSpinner';
import { Constants } from '@resources';
import { constructScormUrl } from "@utils/UrlUtils";
import I18n from '@i18n'

import styles from './Styles/ScormScreenStyles';

class ScormScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            isFullScreen: false,
            activityFailure: false,
            url: ''
        }
    }

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state
        return {
            headerTitle: () => <HeaderTitle title={navigation.state.params.headerTitle} />,
            headerShown: params.headerShown
        }
    }

    componentDidMount() {
        const { navigation, getActivity } = this.props
        navigation.setParams({headerShown:true })
        const { activityId } = navigation.state.params
        this._handleAppOrientation(false)
        Orientation.addOrientationListener(this.toggleOrientation)
        getActivity(activityId)
    }

    componentDidUpdate(prevProps) {
        const { activities, getActivity, registerActivity, navigation } = this.props
        const { activityId } = navigation.state.params
        if (activities && activities !== prevProps.activities) {
            activities.filter(activity => {
                if (activity.activityId == activityId) {
                    this.currentCourse = activity
                }
            })

            if (this.currentCourse && !this.isDataFound) {
                if (!this.currentCourse.isRegistered && !this.registerActivityCalled) {
                    this.registerActivityCalled = true
                    registerActivity(activityId)
                } else if (this.currentCourse.registerActivityFailure) {
                    this.isDataFound = true
                    this.setState({ isLoading: false, activityFailure: true })
                } else if (this.currentCourse.isRegistered && this.currentCourse.launchUrl == null) {
                    getActivity(activityId)
                } else if (this.currentCourse.isRegistered && this.currentCourse.launchUrl != null) {
                    this._handleUrl()
                }
            } else {
                this.setState({ isLoading: false, activityFailure: true })
            }
        }
    }

    componentWillUnmount() {
        this._handleAppOrientation(true)
        Orientation.removeOrientationListener(this.toggleOrientation);
        this.props.navigation.setParams({headerShown:true })
        const { onClose } = this.props.navigation.state.params
        if (onClose && this.isScormCompleted) {
            onClose()
        }
    }

    _handleUrl() {
        const { tokenType, accessToken } = this.props
        const { launchUrl } = this.currentCourse
        if (launchUrl != null) {
            let urlToLoad = constructScormUrl(launchUrl)
            let url = {
                uri: urlToLoad,
                headers: {
                    Authorization: `${tokenType} ${accessToken}`
                }
            }
            this.isDataFound = true
            this.setState({ url, isLoading: false })
        }
    }

    toggleOrientation = (orientation) => {
        StatusBar.setHidden(!this.state.isFullScreen)
        const { navigation } = this.props
        if (orientation && (orientation.startsWith('LANDSCAPE') || orientation === 'PORTRAITUPSIDEDOWN' || orientation === 'PORTRAIT-UPSIDEDOWN')) {
            this.setFullScreen(true)
            navigation.setParams({headerShown:false })
        } else if (orientation && orientation === 'PORTRAIT') {
            this.setFullScreen(false)
            navigation.setParams({headerShown:true })
        } else {
            this.setFullScreen(!this.state.isFullScreen)
        }
    }

    _handleAppOrientation(isPortraitOnly) {
        isPortraitOnly ? Orientation.lockToPortrait() : Orientation.unlockAllOrientations()
    }

    onLoadStart = () => {
        this.setState({
            isLoading: true,
        })
    }

    onLoadEnd = () => {
        this.setState({
            isLoading: false,
        })
    }

    setFullScreen = (mode) => {
        this.setState({
            isFullScreen: mode
        })
    }

    closeFullScreen = () => {
        this.setFullScreen(false)
    }

    _onNavigationStateChange = (navState) => {
        if (this.state.isLoading) return;
        const { apiConfig, completeActivity, navigation, markTaskAsComplete } = this.props
        let scormExitUrl = `${apiConfig.st_base_url}${Constants.SCORM.EXIT_URL}`
        let encodedURL = decodeURIComponent(navState.url)
        if (encodedURL && encodedURL.indexOf(scormExitUrl) > -1) {
            this.isScormCompleted=true
            completeActivity(this.currentCourse.activityId, Constants.ACTIVITY_STATUSES.ATTENDED, this.currentCourse.activityId)
            const { initiativeId, stepId, isMission } = navigation.state.params;
            initiativeId && markTaskAsComplete(initiativeId, stepId, isMission);
            this.props.navigation.pop();
        }
    }

    renderWebView() {
        const { activityFailure, isLoading } = this.state
        if (isLoading && !this.isDataFound) {
            return <LoadingSpinner style={styles.spinner} />
        }
        else {
            return <View style={styles.container}>
                {activityFailure ? <ErrorScreen
                    title={I18n.t('generic_error.title')}
                    message={I18n.t('generic_error.message')}
                /> : <WebView
                        startInLoadingState={true}
                        source={this.state.url}
                        onLoadStart={this.onLoadStart}
                        onNavigationStateChange={this._onNavigationStateChange}
                        onLoadEnd={this.onLoadEnd}

                    />
                }
                {isLoading && <LoadingSpinner style={styles.spinner} />}

            </View>
        }

    }

    render() {
        return this.renderWebView()
    }
}

const mapStateToProps = (state) => ({
    activities: state.activities.activities,
    tokenType: state.user.channelId ? state.user.channel.token_type : state.app.token_type,
    accessToken: state.user.channelId ? state.user.channel.access_token : state.app.access_token,
    apiConfig: state.remoteConfig.apiConfig,
    isActivityFailure: state.activities.isActivityFailure
})

const mapDispatchToProps = (dispatch) => ({
    getActivity: (activityId) => dispatch(ActivitiesActions.getActivity(activityId)),
    registerActivity: (activityId) => dispatch(ActivitiesActions.registerActivity(activityId)),
    completeActivity: (activityId, status, parentActivityId) => dispatch(ActivitiesActions.completeActivity(activityId, status, parentActivityId)),
    markTaskAsComplete: (initiativeId, stepId, isMission) => dispatch(NotificationsActions.markTaskAsComplete(initiativeId, stepId, isMission)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ScormScreen)
