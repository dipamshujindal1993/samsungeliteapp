import React from 'react'
import {
    View,
    TouchableOpacity,
    Text
} from 'react-native'

import SearchIcon from '@svg/icon_search.svg'
import NotificationIcon from '@svg/icon_notifications.svg'
import NavigationService from '@services/NavigationService'
import { connect } from 'react-redux';
import {
    isFeatureSupported,
} from '@utils/CommonUtils'
import {
    Colors,
} from '@resources'

import styles from './Styles/HeaderRightStyles'

function HeaderRight(props) {
    if (props.text != undefined) {
        return <Text style={styles.headerRightText}>{props.text}</Text>
    } else {
        const {
            userAudiences,
            search,
            showSearchInScreen
        } = props
        const searchEnabled = userAudiences && isFeatureSupported(search, userAudiences.data)
        var {
            hideNotification,
        } = props
        if (!hideNotification) {
            const {
                tasks,
                notifications,
            } = props
            const tasksEnabled = userAudiences && isFeatureSupported(tasks, userAudiences.data)
            const notificationsEnabled = userAudiences && isFeatureSupported(notifications, userAudiences.data)
            hideNotification = !tasksEnabled && !notificationsEnabled
        }
        return (
            <View style={styles.container}>
                {searchEnabled && <TouchableOpacity style={styles.iconContainer} onPress={() => showSearchInScreen ? showSearchInScreen() :NavigationService.navigate('SearchScreen')}>
                    <SearchIcon fill={Colors.white} width='62.5%' height='62.5%' />
                </TouchableOpacity>}

                {!hideNotification && <TouchableOpacity style={styles.iconContainer} onPress={() => NavigationService.navigate('NotificationsInboxScreen')}>
                    <NotificationIcon fill={Colors.white} width='62.5%' height='62.5%' />
                    {props.unreadNotificationsCount > 0 &&
                        <View style={styles.badgeContainer}>
                            <Text style={styles.badgeText}>{props.unreadNotificationsCount > 99 ? '99+' : props.unreadNotificationsCount}</Text>
                        </View>
                    }
                </TouchableOpacity>}
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    unreadNotificationsCount: state.notifications.unreadCount,
    userAudiences: state.user.audiences,
    search: state.remoteConfig.featureConfig.search,
    tasks: state.remoteConfig.featureConfig.tasks,
    notifications: state.remoteConfig.featureConfig.notifications,
})

export default connect(mapStateToProps)(HeaderRight)
