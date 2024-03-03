import React, { Component } from 'react'
import {
    AppState,
} from 'react-native'
import NetInfo from '@react-native-community/netinfo'

import { connect } from 'react-redux'

import LoadingSpinner from '@components/LoadingSpinner'
import AppActions from '@redux/AppRedux'
import NavigationActions from '@redux/NavigationRedux'

import { currentTimeSeconds } from '@utils/DateUtils'

import {
    Constants,
} from '@resources'

class AppStateHandler extends Component {
    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange)
        this.unsubscribe = NetInfo.addEventListener(state => {
            if (state.isInternetReachable == false) {
                this.props.showError(Constants.ERROR_TYPES.NETWORK)
            } else {
                this.props.hideError()
            }
        })
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange)
        if (this.unsubscribe) {
            this.unsubscribe()
        }
    }

    _handleAppStateChange = nextAppState => {
        if (nextAppState == 'background') {
            this.props.enterBackground()
        } else if (nextAppState == 'active') {
            NetInfo.fetch().then(state => {
                if (state.isInternetReachable == false) {
                    this.props.showError(Constants.ERROR_TYPES.NETWORK)
                } else {
                    this.props.hideError()
                }
            })

            const {
                lastEnterBackground,
                restartAfter,
                reset,
                startup,
            } = this.props
            if (lastEnterBackground > 0) {
                const timeInBackground = currentTimeSeconds() - lastEnterBackground
                if (restartAfter > 0 && timeInBackground > restartAfter) {
                    reset()
                }
            }
        }
    }

    render() {
        if (this.props.isLoading) {
            return <LoadingSpinner />
        }
        return null
    }
}

const mapStateToProps = (state) => ({
    isLoading: state.nav.isLoading,
    lastEnterBackground: state.app.lastEnterBackground,
    restartAfter: state.remoteConfig.featureConfig ? state.remoteConfig.featureConfig.restart_if_app_is_in_background_for : 0,
})

const mapDispatchToProps = (dispatch) => ({
    enterBackground: () => dispatch(AppActions.enterBackground()),
    showError: (errorType) => dispatch(NavigationActions.showError(errorType)),
    hideError: () => dispatch(NavigationActions.hideError()),
    reset: () => dispatch(NavigationActions.reset()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppStateHandler)