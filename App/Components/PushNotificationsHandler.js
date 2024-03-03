import { Component } from 'react'
import firebase from 'react-native-firebase'
import { connect } from 'react-redux'

import NotificationsActions from '@redux/NotificationsRedux'
import { open } from '@services/LinkHandler'

class PushNotificationsHandler extends Component {
    _handleNotification(notification) {
        firebase.notifications().removeDeliveredNotification(notification.notification._notificationId)
        open({ url: notification.notification.data.url })
    }

    _addListeners() {
        this.removeNotificationListener = firebase.notifications().onNotification(notification => {
            console.log('onNotification:', notification)
            notification.android.setChannelId('default_channel_id').setSound('default')
            firebase.notifications().displayNotification(notification)

            if (this.props.userId) {
                this.props.getUnreadNotificationsCount(this.props.userId)
            }
        })
        this.removeNotificationOpenedListener = firebase.notifications().onNotificationOpened(notification => {
            console.log('onNotificationOpened:', notification)
            this._handleNotification(notification)
        })
        firebase.notifications().getInitialNotification()
            .then(notification => {
                if (notification) {
                    console.log('getInitialNotification:', notification)
                    this._handleNotification(notification)
                }
            })
        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(token => {
            console.log('New FCM token:', token)
            if (token) {
                this.props.updateDevice({
                    fcm_id: token,
                })
            }
        })
    }

    _removeListeners() {
        if (this.removeNotificationListener) {
            this.removeNotificationListener()
        }
        if (this.removeNotificationOpenedListener) {
            this.removeNotificationOpenedListener()
        }
        if (this.onTokenRefreshListener) {
            this.onTokenRefreshListener()
        }
    }

    componentDidMount() {
        if (this.props.optedInPushNotifications) {
            this._addListeners()
        } else if (this.props.optInPushNotificationsSettings) {
            this.props.optInPushNotifications()
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.optInPushNotificationsSettings != this.props.optInPushNotificationsSettings) {
            if (this.props.optInPushNotificationsSettings) {
                this.props.optInPushNotifications()
            } else if (this.props.optedInPushNotifications) {
                this.props.optOutPushNotifications()
            }
        }
        if (prevProps.optedInPushNotifications != this.props.optedInPushNotifications) {
            if (this.props.optedInPushNotifications) {
                this._addListeners()
            } else {
                this._removeListeners()
            }
        }
    }

    componentWillUnmount() {
        if (this.props.optedInPushNotifications) {
            this._removeListeners()
        }
    }

    render() {
        return null
    }
}

const mapStateToProps = (state) => ({
    optedInPushNotifications: state.notifications.optedInPushNotifications,
    userId: state.user.userId,
    optInPushNotificationsSettings: state.user.summary ? state.user.summary.push_opt_in : false,
})

const mapDispatchToProps = (dispatch) => ({
    getUnreadNotificationsCount: (userId) => dispatch(NotificationsActions.getUnreadCount(userId)),
    optInPushNotifications: () => dispatch(NotificationsActions.optInPushNotifications()),
    optOutPushNotifications: () => dispatch(NotificationsActions.optOutPushNotifications()),
    updateDevice: (device) => dispatch(NotificationsActions.updateDevice(device)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PushNotificationsHandler)