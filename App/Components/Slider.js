import React, { PureComponent } from 'react'

import {
    Animated,
    Image,
    PanResponder,
    View,
    Easing,
} from 'react-native'

import styles from './Styles/SliderStyles'

class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    containsPoint(x, y) {
        return (x >= this.x &&
            y >= this.y &&
            x <= this.x + this.width &&
            y <= this.y + this.height);
    }
}


const DEFAULT_ANIMATION_CONFIGS = {
    spring: {
        friction: 7,
        tension: 100,
    },
    timing: {
        duration: 150,
        easing: Easing.inOut(Easing.ease),
        delay: 0,
    },
}

export default class Slider extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            containerSize: { width: 0, height: 0 },
            trackSize: { width: 0, height: 0 },
            thumbSize: { width: 0, height: 0 },
            allMeasured: false,
            value: new Animated.Value(this.props.value)
        }

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
            onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
            onPanResponderGrant: this._handlePanResponderGrant,
            onPanResponderMove: this._handlePanResponderMove,
            onPanResponderRelease: this._handlePanResponderEnd,
            onPanResponderTerminationRequest: this._handlePanResponderRequestEnd,
            onPanResponderTerminate: this._handlePanResponderEnd,
        })
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.value !== prevState.value) {
            return {
                value: new Animated.Value(nextProps.value),
            }
        }
        return null

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.value !== this.props.value) {
            if (this.props.animateTransitions) {
                this._setCurrentValueAnimated(this.props.value)
            } else {
                this._setCurrentValue(this.props.value)
            }
        }
    }

    _handleStartShouldSetPanResponder = (e/* gestureState: Object */) =>
        // Should we become active when the user presses down on the thumb?
        this._thumbHitTest(e)

    _handleMoveShouldSetPanResponder(/* e: Object, gestureState: Object */) {
        // Should we become active when the user moves a touch over the thumb?
        return false
    }

    _handlePanResponderGrant = (/* e: Object, gestureState: Object */) => {
        this._previousLeft = this._getThumbLeft(this._getCurrentValue())
        this._fireChangeEvent('onSlidingStart')
    }

    _handlePanResponderMove = (e, gestureState) => {
        if (this.props.disabled) {
            return
        }

        if (!this.props.allowFF) {
            if (this._getCurrentValue() > this._getValue(gestureState)) {
                this._setCurrentValue(this._getValue(gestureState))
                this._fireChangeEvent('onValueChange')
            }
        } else {
            this._setCurrentValue(this._getValue(gestureState))
            this._fireChangeEvent('onValueChange')
        }
    }

    _handlePanResponderRequestEnd(e, gestureState) {
        // Should we allow another component to take over this pan?
        return false
    }

    _handlePanResponderEnd = (e, gestureState) => {
        if (this.props.disabled) {
            return
        }

        if (!this.props.allowFF) {
            if (this._getCurrentValue() > this._getValue(gestureState)) {
                this._setCurrentValue(this._getValue(gestureState))
                this._fireChangeEvent('onSlidingComplete')
            }
        } else {
            this._setCurrentValue(this._getValue(gestureState))
            this._fireChangeEvent('onSlidingComplete')
        }

    }

    _measureContainer = (x) => {
        this._handleMeasure('containerSize', x)
    }

    _measureTrack = (x) => {
        this._handleMeasure('trackSize', x)
    }

    _measureThumb = (x) => {
        this._handleMeasure('thumbSize', x)
    }

    _handleMeasure = (name, x) => {
        const { width, height } = x.nativeEvent.layout
        const size = { width, height }

        const storeName = `_${name}`
        const currentSize = this[storeName]
        if (
            currentSize &&
            width === currentSize.width &&
            height === currentSize.height
        ) {
            return
        }
        this[storeName] = size

        if (this._containerSize && this._trackSize && this._thumbSize) {
            this.setState({
                containerSize: this._containerSize,
                trackSize: this._trackSize,
                thumbSize: this._thumbSize,
                allMeasured: true,
            })
        }
    }

    _getRatio = (value) =>
        (value - this.props.minimumValue) / (this.props.maximumValue - this.props.minimumValue)

    _getThumbLeft = (value) => {
        const ratio = this._getRatio(value)
        return (
            ratio * (this.state.containerSize.width - this.state.thumbSize.width)
        )
    }

    _getValue = (gestureState) => {
        const length = this.state.containerSize.width - this.state.thumbSize.width
        const thumbLeft = this._previousLeft + gestureState.dx
        const ratio = thumbLeft / length

        if (this.props.step) {
            return Math.max(
                this.props.minimumValue,
                Math.min(
                    this.props.maximumValue,
                    this.props.minimumValue +
                    Math.round(
                        ratio *
                        (this.props.maximumValue - this.props.minimumValue) /
                        this.props.step,
                    ) *
                    this.props.step,
                ),
            )
        }
        return Math.max(
            this.props.minimumValue,
            Math.min(
                this.props.maximumValue,
                ratio * (this.props.maximumValue - this.props.minimumValue) +
                this.props.minimumValue,
            ),
        )
    }

    _getCurrentValue = () => this.state.value.__getValue()

    _setCurrentValue = (value) => {
        this.state.value.setValue(value)
    }

    _setCurrentValueAnimated = (value) => {
        const animationType = this.props.animationType;
        const animationConfig = Object.assign(
            {},
            DEFAULT_ANIMATION_CONFIGS[animationType],
            this.props.animationConfig,
            {
                toValue: value,
            },
        );

        Animated[animationType](this.state.value, animationConfig).start()
    }

    _fireChangeEvent = event => {
        if (this.props[event]) {
            this.props[event](this._getCurrentValue())
        }
    }

    _getTouchOverflowSize = () => {
        const state = this.state
        const props = this.props

        const size = {}
        if (state.allMeasured === true) {
            size.width = Math.max(
                0,
                props.thumbTouchSize.width - state.thumbSize.width,
            );
            size.height = Math.max(
                0,
                props.thumbTouchSize.height - state.containerSize.height,
            )
        }
        return size
    }

    _getTouchOverflowStyle = () => {
        const { width, height } = this._getTouchOverflowSize()

        const touchOverflowStyle = {}
        if (width !== undefined && height !== undefined) {
            const verticalMargin = -height / 2
            touchOverflowStyle.marginTop = verticalMargin
            touchOverflowStyle.marginBottom = verticalMargin

            const horizontalMargin = -width / 2
            touchOverflowStyle.marginLeft = horizontalMargin
            touchOverflowStyle.marginRight = horizontalMargin
        }
        return touchOverflowStyle
    }

    _thumbHitTest = (e) => {
        const nativeEvent = e.nativeEvent
        const thumbTouchRect = this._getThumbTouchRect()
        return thumbTouchRect.containsPoint(
            nativeEvent.locationX,
            nativeEvent.locationY,
        )
    }

    _getThumbTouchRect = () => {
        const state = this.state
        const props = this.props
        const touchOverflowSize = this._getTouchOverflowSize()

        return new Rect(
            touchOverflowSize.width / 2 +
            this._getThumbLeft(this._getCurrentValue()) +
            (state.thumbSize.width - props.thumbTouchSize.width) / 2,
            touchOverflowSize.height / 2 +
            (state.containerSize.height - props.thumbTouchSize.height) / 2,
            props.thumbTouchSize.width,
            props.thumbTouchSize.height,
        )
    }

    _renderThumbImage = () => {
        const { thumbImage } = this.props

        if (!thumbImage) return;

        return <Image source={thumbImage} />
    }

    render() {
        const {
            minimumValue,
            maximumValue,
            minimumTrackTintColor,
            maximumTrackTintColor,
            thumbTintColor,
            thumbImage,
            style,
            trackStyle,
            thumbStyle,
            onValueChange,
            thumbTouchSize,
            animationType,
            animateTransitions,
            ...other
        } = this.props

        const {
            value,
            containerSize,
            thumbSize,
            allMeasured,
        } = this.state

        const thumbLeft = value.interpolate({
            inputRange: [minimumValue, maximumValue],
            outputRange: [0, containerSize.width - thumbSize.width],
            // extrapolate: 'clamp',
        })

        const minimumTrackWidth = value.interpolate({
            inputRange: [minimumValue, maximumValue],
            outputRange: [0, containerSize.width - thumbSize.width],
            // extrapolate: 'clamp',
        })

        const valueVisibleStyle = {};
        if (!allMeasured) {
            valueVisibleStyle.opacity = 0
        }

        const minimumTrackStyle = {
            position: 'absolute',
            width: Animated.add(minimumTrackWidth, thumbSize.width / 2),
            backgroundColor: minimumTrackTintColor,
            ...valueVisibleStyle,
        }

        const touchOverflowStyle = this._getTouchOverflowStyle()

        return (
            <View
                {...other}
                style={[styles.container, style]}
                onLayout={this._measureContainer}
            >
                <View
                    style={[
                        { backgroundColor: maximumTrackTintColor },
                        styles.track,
                        trackStyle,
                    ]}
                    renderToHardwareTextureAndroid
                    onLayout={this._measureTrack}
                />
                <Animated.View
                    renderToHardwareTextureAndroid
                    style={[styles.track, trackStyle, minimumTrackStyle]}
                />
                <Animated.View
                    onLayout={this._measureThumb}
                    renderToHardwareTextureAndroid
                    style={[
                        { backgroundColor: thumbTintColor },
                        styles.thumb,
                        thumbStyle,
                        {
                            transform: [{ translateX: thumbLeft }, { translateY: 0 }],
                            ...valueVisibleStyle,
                        },
                    ]}
                >
                    {this._renderThumbImage()}
                </Animated.View>
                <View
                    renderToHardwareTextureAndroid
                    style={[styles.touchArea, touchOverflowStyle]}
                    {...this._panResponder.panHandlers}
                >
                </View>
            </View>
        )
    }
}
