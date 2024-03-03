import { Component } from 'react'
import {
    Platform,
    AppState,
    PermissionsAndroid,
} from 'react-native'
import { connect } from 'react-redux'
import Geolocation from '@react-native-community/geolocation'

import UserActions from '@redux/UserRedux'
import NavigationActions from '@redux/NavigationRedux'

import {
    findConfig,
} from '@utils/CommonUtils'

import {
    Constants,
} from '@resources'

class LocationListener extends Component {
    _checkGeofence(position, radius) {
        const { coords } = position
        this.props.checkGeofence(coords.latitude, coords.longitude, radius)
    }

    _watchPosition() {
        const {
            userAudiences,
            geofencing,
        } = this.props

        const geofencingConfig = findConfig(userAudiences, geofencing)
        if (geofencingConfig) {
            this.watchId = Geolocation.watchPosition(position => this._checkGeofence(position, geofencingConfig.radius),
                error => {
                    if (error && error.PERMISSION_DENIED) {
                        this.props.showError(Constants.ERROR_TYPES.GEOFENCING)
                    }
                }
            )
        }
    }

    _stopWatchingPosition() {
        if (this.watchId >= 0) {
            Geolocation.clearWatch(this.watchId)
            Geolocation.stopObserving()
        }
    }

    _handleAppStateChange = nextAppState => {
        if (nextAppState == 'active') {
            this._watchPosition()
        } else if (nextAppState == 'background') {
            this._stopWatchingPosition()
        }
    }

    _startListenerAndWatchPosition() {
        AppState.addEventListener('change', this._handleAppStateChange)
        this._watchPosition()
    }

    _checkLocationPermission = async () => {
        try {
            const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            if (hasPermission) {
                this._startListenerAndWatchPosition()
            } else {
                this._requestLocationPermission()
            }
        } catch (err) {
            this.props.showError(Constants.ERROR_TYPES.GEOFENCING)
        }
    }

    _requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this._startListenerAndWatchPosition()
            } else {
                this.props.showError(Constants.ERROR_TYPES.GEOFENCING)
            }
        } catch (err) {
            this.props.showError(Constants.ERROR_TYPES.GEOFENCING)
        }
    }

    componentDidMount() {
        if (Platform.OS == 'android') {
            this._checkLocationPermission()
        } else {
            this._startListenerAndWatchPosition()
        }
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange)
        this._stopWatchingPosition()
    }

    render() {
        return null
    }
}

const mapStateToProps = (state) => ({
    userAudiences: state.user.audiences,
    geofencing: state.remoteConfig.featureConfig.geofencing,
})

const mapDispatchToProps = (dispatch) => ({
    checkGeofence: (latitude, longitude, radius) => dispatch(UserActions.checkGeofence(latitude, longitude, radius)),
    showError: (errorType) => dispatch(NavigationActions.showError(errorType)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LocationListener)