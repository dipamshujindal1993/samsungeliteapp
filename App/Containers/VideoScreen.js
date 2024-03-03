import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import AppActions from '@redux/AppRedux'
import Orientation from 'react-native-orientation'

import ErrorScreen from '@containers/ErrorScreen'
import HeaderTitle from '@components/HeaderTitle'
import LoadingSpinner from '@components/LoadingSpinner'
import Video from '@components/Video'
import { Constants } from '@resources'
import I18n from '@i18n'

import styles from './Styles/VideoScreenStyles'

class VideoScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            errorLoading: false
        }
        this.videoState = {
            elapsedSeconds: 0,
            videoCompleted: false
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: () => <HeaderTitle title={navigation.state.params.headerTitle} />
        }
    }

    componentDidMount() {
        this._handleAppOrientation(false)
        this.startTimer()
    }

    componentWillUnmount() {
        const { errorLoading } = this.state
        const { navigation } = this.props
        const { onClose } = navigation.state.params
        if (!errorLoading && onClose && this.videoState.videoCompleted === true) {
            onClose()
        } else if (!errorLoading && !onClose) {
            this.shouldPrompAppRating && this.props.showHideAppRatingPrompt(true)
        }
        clearInterval(this.timer)
        this._handleAppOrientation(true)
    }

    _handleAppOrientation(isPortraitOnly) {
        isPortraitOnly ? Orientation.lockToPortrait() : Orientation.unlockAllOrientations()
    }

    startTimer() {
        this.timer = setInterval(() => this.shouldPrompAppRating = true, this.props.timeSpent * 1000)
    }

    getVideoPlaySecs = (secs) => {
        this.videoState.elapsedSeconds = secs
    }

    isVideoCompleted = () => {
        this.videoState.videoCompleted = true
    }

    onError = (error) => {
        this.setState({
            errorLoading: true,
            isLoading: false
        })
    }

    onLoad = () => {
        this.setState({
            isLoading: false
        })
    }

    renderVideo() {
        const { sourceObj, cookiesObj, onClose } = this.props.navigation.state.params

        return (
            <View style={styles.videoContentContainer}>
                <Video
                    style={styles.videoPlayer}
                    sourceObj={sourceObj}
                    cookiesObj={cookiesObj}
                    showControls={false}
                    allowDefaultFullScreen={false}
                    disableSeek={false}
                    allowFF={!onClose ? true : false}
                    elapsedSeconds={this.videoState.elapsedSeconds}
                    enableCTA={this.isVideoCompleted}
                    getVideoPlaySecs={this.getVideoPlaySecs}
                    onError={this.onError}
                    onLoad={() => this.onLoad()}
                />
            </View>
        )
    }

    renderError() {
        return <ErrorScreen
            title={I18n.t('courses.video_play_error')}
        />
    }

    render() {
        const { isLoading, errorLoading } = this.state
        return (
            <View style={styles.container}>
                {!errorLoading && this.renderVideo()}
                {(!isLoading && errorLoading) && this.renderError()}
                {isLoading && <LoadingSpinner />}
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    timeSpent: state.remoteConfig.featureConfig.time_spent
})

const mapDispatchToProps = (dispatch) => ({
    showHideAppRatingPrompt: (isVisible) => dispatch(AppActions.showHideAppRatingPrompt(isVisible))
})

export default connect(mapStateToProps, mapDispatchToProps)(VideoScreen)