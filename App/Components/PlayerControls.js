import React, { Component } from 'react'
import {
    Animated,
    TouchableWithoutFeedback,
    TouchableOpacity,
    View,
} from 'react-native'

import { fadeInControls, fadeOutControls } from '@utils/VideoUtils'

import LoadingSpinner from '@components/LoadingSpinner'
import Slider from '@components/Slider'
import CloseIcon from '@svg/icon_close.svg'
import FastForwardIcon from '@svg/icon_arrowright.svg'
import RewindIcon from '@svg/icon_arrowleft.svg'
import PauseIcon from '@svg/icon_pause.svg'
import PlayIcon from '@svg/icon_play.svg'
import { Constants, Colors } from '@resources'

import styles from './Styles/PlayerControlsStyles'
export default class PlayerControls extends Component {
    constructor(props) {
        super(props)

        this.state = {
            allowFF: this.props.allowFF,
            progress: this.props.progress,
            opacity: new Animated.Value(1),
            isVisible: true,
        }
        this.isControlsChanging= false
    }

    static getDerivedStateFromProps(props, state) {
        if (props.progress != state.progress) {
            return {
                progress: props.progress
            }
        }

        if (props.allowFF !== state.allowFF) {
            return {
                allowFF: props.allowFF
            }
        }
        return null
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.progress != this.props.progress) {
            this.setState({ progress: this.props.progress })
        }

        if (prevProps.allowFF !== this.props.allowFF) {
            this.setState({
                allowFF: this.props.allowFF
            })
        }
    }


    getPlayerStateIcon(playerState) {
        switch (playerState) {
            case Constants.PLAYER_STATES.PLAYING:
                return <PauseIcon fill={Colors.white} width='40' height='40' />
            case Constants.PLAYER_STATES.PAUSED:
                return <PlayIcon fill={Colors.white} width='40' height='40' />
            case Constants.PLAYER_STATES.ENDED:
                return <PlayIcon fill={Colors.white} width='40' height='40' />
            default:
                return null
        }
    }

    getPlayerSeekIcon(mode) {
        const { REWIND, FORWARD } = Constants.VIDEO_CONFIG
        const pressAction = mode ? (mode === REWIND ? this.onRewind : this.onForward) : null
        if (this.props.isLoading) {
            return (
                <View style={styles.playButton} >
                    <LoadingSpinner />
                </View>
            )
        } else {
            return (
                <TouchableOpacity
                    style={[styles.playButton]}
                    onPress={pressAction}
                >
                    {mode === REWIND && <RewindIcon fill={Colors.white} width='24' height='18' />}
                    {mode === FORWARD && <FastForwardIcon fill={Colors.white} width='24' height='18' />}
                </TouchableOpacity>
            )
        }
    }

    setPlayerControls = (playerState) => {
        const pressAction = playerState === Constants.PLAYER_STATES.ENDED ? this.onReplay : this.onPause
        return (
            <View style={styles.playerControls}>
                {this.getPlayerSeekIcon(Constants.VIDEO_CONFIG.REWIND)}
                <TouchableOpacity
                    style={[styles.playButton]}
                    onPress={pressAction}
                >
                    {this.getPlayerStateIcon(playerState)}
                </TouchableOpacity>
                {this.getPlayerSeekIcon(this.state.allowFF ? Constants.VIDEO_CONFIG.FORWARD : null)}
            </View>
        )
    }

    onPause = () => {
        const { playerState, onPaused } = this.props
        const { PLAYING, PAUSED } = Constants.PLAYER_STATES
        switch (playerState) {
            case PLAYING: {
                this.cancelAnimation()
                break;
            }
            case PAUSED: {
                fadeOutControls(this.state.opacity, Constants.VIDEO_CONFIG.HIDE_CONTROLS_SECS, () => this.setState({ isVisible: false }))
                break;
            }
            default:
                break;
        }

        const newPlayerState = playerState === PLAYING ? PAUSED : PLAYING
        return onPaused(newPlayerState)
    }

    onReplay = () => {
        fadeOutControls(this.state.opacity, Constants.VIDEO_CONFIG.HIDE_CONTROLS_SECS, () => this.setState({ isVisible: false }))
        this.props.onReplay()
    }

    onRewind = () => {
        const { progress } = this.state
        const RWD_VAL = progress <= Constants.VIDEO_CONFIG.VIDEO_FWD_RWD_SECS ? 0 : progress - Constants.VIDEO_CONFIG.VIDEO_FWD_RWD_SECS
        this.props.seek(RWD_VAL)
    }

    onForward = () => {
        const { progress } = this.state
        const { duration } = this.props
        const FWD_VAL = progress >= duration ? duration : progress + Constants.VIDEO_CONFIG.VIDEO_FWD_RWD_SECS
        this.props.seek(FWD_VAL)
    }

    onValueChange = (value) => {
        const { playerState, onSlideValueChange } = this.props
        this.cancelAnimation()
        onSlideValueChange(value)
        if (playerState === Constants.PLAYER_STATES.PAUSED) return
    }

    onSlidingComplete = (value) => {
        const { duration, progress } = this.props
        this.props.onSlideComplete(value)
        fadeOutControls(this.state.opacity, Constants.VIDEO_CONFIG.HIDE_CONTROLS_SECS, () => this.setState({ isVisible: false }))
        if (progress == duration) {
            this.onPause()
        }
    }

    cancelAnimation = () => {
        this.state.opacity.stopAnimation(() => {
            this.setState({ isVisible: true })
        })
    }

    toggleControls = () => {
        const { opacity } = this.state
        // value is the last value of the animation when stop animation was called. this is an opacity effect
        opacity.stopAnimation((value) => {
            this.setState({ isVisible: !!value })
            if (value) {
                return fadeOutControls(opacity, 0, () => this.setState({ isVisible: false }))
            }
            else {
                return this.setState({
                    isVisible: true
                }, () => fadeInControls(opacity, true, () => fadeOutControls(opacity, Constants.VIDEO_CONFIG.HIDE_CONTROLS_SECS, () => this.setState({ isVisible: false })))
                )
            }
        })
    }

    renderClose() {
        const { closePress, closeStyles } = this.props
        if (closePress) {
            return (
                <TouchableOpacity onPress={closePress} style={closeStyles}>
                    <CloseIcon fill={Colors.rgb_b9b9b9} width='24' height='24' />
                </TouchableOpacity>
            )
        }
        return null
    }

    renderControls() {
        const {
            disableSeek,
            duration,
            isLoading,
            sliderStyle,
            thumbColor,
            thumbBorder,
            trackLeftColor,
            trackRightColor,
            playerState,
        } = this.props

        const { allowFF, progress, isVisible } = this.state

        // block controls
        if (!isVisible) return null
        return (
            <View style={styles.container}>
                <View style={[styles.controlsRow, styles.toolbarRow]}>{this.renderClose()}</View>
                <View style={styles.controlsRow}>
                    {isLoading
                        ? <LoadingSpinner />
                        : this.setPlayerControls(playerState)}
                </View>
                <View style={[styles.controlsRow, styles.sliderContainer]}>
                    <Slider
                        style={[styles.sliderStyle, sliderStyle]}
                        allowFF={allowFF}
                        disabled={disableSeek}
                        minimumValue={0}
                        maximumValue={duration}
                        value={Math.floor(progress) || 0}
                        onValueChange={this.onValueChange}
                        onSlidingComplete={this.onSlidingComplete}
                        thumbTintColor={thumbColor || Colors.white}
                        trackStyle={styles.track}
                        thumbStyle={[styles.thumb, { borderColor: thumbBorder || 'transparent' }]}
                        minimumTrackTintColor={trackLeftColor}
                        maximumTrackTintColor={trackRightColor || 'transparent'}
                        thumbTouchSize={styles.thumbTouchSize}
                    />
                </View>
            </View>
        )
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={this.toggleControls}>
                <Animated.View
                    style={[styles.container, { opacity: this.state.opacity }]}
                >
                    {this.renderControls()}
                </Animated.View>
            </TouchableWithoutFeedback>
        )
    }
}