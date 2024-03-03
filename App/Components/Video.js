import React, { Component } from 'react'
import {
    AppState,
    DeviceEventEmitter,
    Modal,
    Platform,
    StatusBar,
    View,
} from 'react-native'
import CookieManager from '@react-native-community/cookies'
import VideoPlayer from 'react-native-video'
import Orientation from 'react-native-orientation'

import LoadingSpinner from '@components/LoadingSpinner'
import PlayerControls from '@components/PlayerControls'
import { Constants, Colors } from '@resources'
import { isVimeoVideo } from '@utils/VideoUtils'

import styles from './Styles/VideoStyles'

export default class Video extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            appState: AppState.currentState,
            allowFF: this.props.allowFF,
            currentTime: null,
            duration: 0,
            isFullScreen: false,
            isVideoLoading: true,
            paused: true,
            playerState: Constants.PLAYER_STATES.PAUSED
        }

        // VideoState changes do not need re-rendering
        this.videoState = {
            playTime: 0,
            orientation: null,
            playerState: Constants.PLAYER_STATES.PAUSED,
            paused: true,
            fullScreen: false,
            vimeoConfig: {
            }
        }
        this.subscription = null
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.sourceObj !== prevState.sourceObj) {
            return {
                sourceObj: nextProps.sourceObj
            }
        }

        return null
    }

    componentDidMount() {
        AppState.addEventListener('change', this.appStateChangeHandlder)
        if (Platform.OS === 'android') {
            this.subscription = DeviceEventEmitter.addListener('deviceOrientationDidChange', (event) => {
                this.toggleOrientation(event.deviceOrientation)
            })
        } else {
            Orientation.addSpecificOrientationListener(this.toggleOrientation)
        }
        //for progress video to given time in seconds with onProgress()
        if (this.videoState && this.props.elapsedSeconds) {
            this.videoState.playTime = this.props.elapsedSeconds
        }
        this._fetchVideoType()
    }

    componentDidUpdate() {
        this.props.getVideoPlaySecs(this.state.currentTime)
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.appStateChangeHandlder)
        if (Platform.OS === 'android') {
            this.subscription = null
        } else {
            this.toggleOrientation && Orientation.removeSpecificOrientationListener(this.toggleOrientation)
        }
        this.player = null
        this.videoState = null
    }

    toggleOrientation = (orientation) => {
        const { currentTime, playerState, paused } = this.state

        if (this.videoState) {
            this.videoState.playTime = currentTime
            this.videoState.orientation = orientation

            if (this.isVideoPlayerLoaded) {
                this.setVideoPlayerStates(playerState, paused)
            }

            if (this.videoState.fullScreen === false && orientation && (orientation.startsWith('LANDSCAPE') ||
                orientation === 'PORTRAITUPSIDEDOWN' || orientation === 'PORTRAIT-UPSIDEDOWN')) {
                this.setFullScreen(true)
            } else if (this.videoState.fullScreen === true && orientation && orientation === 'PORTRAIT') {
                this.setFullScreen(false)
            }
        }
    }

    _fetchVideoType() {
        const { sourceObj } = this.state
        if (isVimeoVideo(sourceObj.uri)) {
            let videoIdMatch = sourceObj.uri.toLowerCase().match(Constants.VIDEO_CONFIG.REGEX_VIMEO_ID)
            if (videoIdMatch) {
                let vimeoId = videoIdMatch[1]
                fetch(`https://player.vimeo.com/video/${vimeoId}/config`)
                    .then(res => res.json())
                    .then(res => {
                        if (this.videoState) {
                            this.videoState.videoType = Constants.VIDEO_CONFIG.VIMEO
                            this.videoState.vimeoConfig.sourceObj = {
                                uri: res.request.files.hls.cdns[res.request.files.hls.default_cdn].url
                            }
                        }
                        this.setState({
                            isLoading: false
                        })
                    })
                    .catch(() => {
                    })
            }
        } else {
            this.setState({
                isLoading: false
            })
        }
    }

    closeFullScreen = () => {
        this.toggleOrientation('PORTRAIT')
    }

    appStateChangeHandlder = (nextAppState) => {
        const { appState, playerState } = this.state
        if (appState.match(/active/) && nextAppState.match(/inactive|background/)) {
            //App has come to the background
            if (playerState === Constants.PLAYER_STATES.PLAYING) {
                this.onPaused(Constants.PLAYER_STATES.PAUSED)
            }
        }
        this.setState({ appState: nextAppState })
    }

    setVideoPlayerStates = (playerState, paused) => {
        if (this.videoState) {
            this.videoState.playerState = playerState
            this.videoState.paused = paused
        }
    }

    onPaused = (playerState) => {
        this.setVideoPlayerStates(playerState, playerState === Constants.PLAYER_STATES.PAUSED ? true : false)
        this.setState({
            paused: playerState === Constants.PLAYER_STATES.PAUSED ? true : false,
            playerState
        })
    }

    onReplay = () => {
        this.setVideoPlayerStates(Constants.PLAYER_STATES.PLAYING, false)
        this.setState({
            playerState: Constants.PLAYER_STATES.PLAYING,
            paused: false
        })
        this.player.seek(0)
    }

    onProgress = (data) => {
        const { isVideoLoading, playerState } = this.state
        // Video Player will continue progress even if the video already ended
        if (!isVideoLoading && playerState !== Constants.PLAYER_STATES.ENDED) {
            let playerCurrentTime = this.videoState && this.videoState.playTime ? this.videoState.playTime : data.currentTime

            if (this.videoState && this.videoState.playTime) {
                this.videoState.playTime = 0
            }
            this.setState({
                currentTime: playerCurrentTime
            })
        }
    }

    seek = (seekTime) => {
        const { currentTime, playerState, paused } = this.state
        //for avoid reassign if its already on same time
        if (seekTime != currentTime) {
            this.setVideoPlayerStates(playerState, paused)
            this.player.seek(seekTime)
        }
    }

    onSeek = ({ currentTime }) => {
        const { playerState, paused } = this.state
        if (this.videoState) {
            this.setState({
                currentTime,
                playerState: this.videoState.playerState,
                paused: this.videoState.paused
            })
        } else {
            this.setState({
                currentTime,
                playerState,
                paused
            })
        }
    }

    onSlideValueChange = (currentTime) => {
        this.setState({
            currentTime,
            playerState: Constants.PLAYER_STATES.PAUSED,
            paused: true
        })
    }

    onSlideComplete = (seekTime) => {
        this.player.seek(seekTime)
    }

    onLoad = (data) => {
        const { onLoad } = this.props
        this.isVideoPlayerLoaded = true
        if (this.videoState) {
            this.setState({
                duration: data.duration,
                isVideoLoading: false,
                playerState: this.videoState.playerState,
                paused: this.videoState.paused
            })

            if (this.player && this.videoState.playTime) {
                this.player.seek(this.videoState.playTime)
            }
        }

        onLoad && onLoad()
    }

    onLoadStart = (data) => {
        this.setState({
            isVideoLoading: true
        })
    }

    onEnd = () => {
        this.setVideoPlayerStates(Constants.PLAYER_STATES.PAUSED, true)
        this.setState({
            playerState: Constants.PLAYER_STATES.PAUSED,
            paused: true,
            allowFF: true
        })
        //For enable CTA
        this.props.enableCTA()
        this.props.getVideoPlaySecs(this.state.currentTime)
    }

    setFullScreen = (mode) => {
        StatusBar.setHidden(mode)
        this.videoState.fullScreen = mode
        this.isVideoPlayerLoaded = false

        this.setState({
            isFullScreen: mode,
            playerState: Constants.PLAYER_STATES.PAUSED,
            paused: true
        })
    }

    renderVideoPlayer() {
        const {
            allowFF,
            currentTime,
            duration,
            isFullScreen,
            isVideoLoading,
            sourceObj,
            paused,
            playerState
        } = this.state

        const { disableSeek, allowDefaultFullScreen, cookiesObj, onError } = this.props
        const { videoType, vimeoConfig } = this.videoState

        if (Platform.OS === 'ios' && videoType !== Constants.VIDEO_CONFIG.VIMEO && (cookiesObj != null && Object.values(cookiesObj).length)) {
            CookieManager.set(cookiesObj)
                .then((res) => {
                })
        }

        let videoPlayerStyles = [styles.videoPlayer]
        var closeStyles = []

        if (!isFullScreen) {
            videoPlayerStyles.push(styles.videoPlayerBorder)
        } else {
            closeStyles.push(styles.toolBar)
        }

        let videoPlayerProps = {
            autoplay: this.props.autoplay || false,
            controls: this.props.showControls || false,
            fullscreen: allowDefaultFullScreen || false,
            disableSeek: disableSeek || false,
            muted: this.props.muted || false,
            paused,
            repeat: this.props.repeat || false,
            resizeMode: this.props.resizeMode || 'cover',
            volume: this.props.volume || 1
        }
        return (
            <View style={styles.backgroundContainer}>
                <View style={styles.videoContainerStyles}>
                    <VideoPlayer
                        {...videoPlayerProps}
                        style={videoPlayerStyles}
                        ref={component => this.player = component}
                        source={videoType !== Constants.VIDEO_CONFIG.VIMEO ? sourceObj : vimeoConfig.sourceObj}
                        onEnd={this.onEnd}
                        onLoad={this.onLoad}
                        onLoadStart={this.onLoadStart}
                        onProgress={this.onProgress}
                        onSeek={this.onSeek}
                        onError={(error) => onError && onError(error)}
                    />

                    {!isVideoLoading && <PlayerControls
                        sliderStyle={isFullScreen ? styles.sliderFullScreen : styles.slider}
                        duration={duration}
                        allowFF={allowFF || false}
                        disableSeek={disableSeek || false}
                        trackLeftColor={Colors.rgb_4297ff}
                        onPaused={this.onPaused}
                        onReplay={this.onReplay}
                        playerState={playerState}
                        progress={currentTime}
                        seek={this.seek}
                        onSlideValueChange={this.onSlideValueChange}
                        onSlideComplete={this.onSlideComplete}
                        isLoading={isVideoLoading}
                        closePress={isFullScreen ? this.closeFullScreen : null}
                        closeStyles={closeStyles}
                    />
                    }
                </View>
            </View>
        )
    }

    render() {
        const { isFullScreen, isLoading } = this.state
        if (isLoading) {
            return <LoadingSpinner />
        } else {
            if (isFullScreen) {
                return (
                    <Modal
                        animationType='fade'
                        transparent={false}
                        onRequestClose={isFullScreen ? this.closeFullScreen : null}
                    >
                        {this.renderVideoPlayer()}
                    </Modal>
                )
            } else {
                return this.renderVideoPlayer()
            }
        }
    }
}
