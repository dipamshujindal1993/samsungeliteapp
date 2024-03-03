import React, { Component } from 'react'
import {
    Text, View, TouchableOpacity
} from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { connect } from 'react-redux'

import { isFeatureSupported } from '@utils/CommonUtils'
import I18n from '@i18n'
import { ApplicationStyles } from '@resources'
import styles from './Styles/NotificationsInboxScreenStyles'
import NotificationsList from '@containers/NotificationsList'
import NotificationsActions from '@redux/NotificationsRedux';

const TabNavigatorConfig = {
    tabBarOptions: {
        style: ApplicationStyles.tabBarStyle,
        indicatorStyle: ApplicationStyles.tabBarIndicatorStyle,
    }
}

const NotificationsInboxTabsConfig = {
    Tasks: {
        screen: () => <NotificationsList isTasks={true} />,
        navigationOptions: {
            tabBarLabel: ({ focused }) => (
                <View style={[ApplicationStyles.tabStyle, styles.tabWidth, focused ? ApplicationStyles.activeTabStyle : null]}>
                    <Text style={[ApplicationStyles.labelStyle, focused ? ApplicationStyles.activeLabelStyle : ApplicationStyles.inactiveLabelStyle]}>{I18n.t('notification.tasks')}</Text>
                </View>
            )
        },
    },
    Notifications: {
        screen: () => <NotificationsList />,
        navigationOptions: {
            tabBarLabel: ({ focused }) => (
                <View style={[ApplicationStyles.tabStyle, styles.tabWidth, focused ? ApplicationStyles.activeTabStyle : null]}>
                    <Text style={[ApplicationStyles.labelStyle, focused ? ApplicationStyles.activeLabelStyle : ApplicationStyles.inactiveLabelStyle]}>{I18n.t('notification.notifications')}</Text>
                </View>
            )
        },
    }
}

const NotificationsInboxTabs = createMaterialTopTabNavigator(NotificationsInboxTabsConfig, TabNavigatorConfig)

class NotificationsInboxScreen extends Component {
    static router = NotificationsInboxTabs.router

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        const isHidden = params ? params.isTasks : true
        const disable = params && params.isReadOnly
        return {
            headerRight: () => (
                isHidden ? null :
                    <TouchableOpacity onPress={() => navigation.getParam('onClearAll')()} disabled={disable} style={[disable && styles.disabled]}>
                        <Text style={styles.selectedMenu}>{I18n.t('notification.clear_all')}</Text>
                    </TouchableOpacity>
            )
        }
    }

    componentDidMount() {
        const { channelId } = this.props;
        let isTasks = this.checkIfTaskEnabled()
        this.props.navigation.setParams({
            onClearAll: this._onClearAll,
            isTasks: isTasks,
            isReadOnly: channelId != undefined,
        })
    }

    componentDidUpdate(prevProps) {
        const { isTaskActive, navigation } = this.props;
        if (prevProps.isTaskActive != isTaskActive) {
            navigation.setParams({
                isTasks: isTaskActive
            });
        }
    }

    _onClearAll = () => {
        const { clearNotifications, userId } = this.props;
        clearNotifications(false, userId)
    }

    checkIfTaskEnabled() {
        const { navigation, userAudiences, tasksTab } = this.props;
        const isTasksEnabled = userAudiences && isFeatureSupported(tasksTab, userAudiences.data)
        let isTasks = false
        if (isTasksEnabled) {
            isTasks = navigation.state.index == 0
        }
        return isTasks
    }

    createTabContainer() {
        return (
            <NotificationsInboxTabs navigation={this.props.navigation} />
        )
    }

    render() {
        const {
            userAudiences,
            tasksTab,
            notificationsTab,
        } = this.props
        const isTasksEnabled = userAudiences && isFeatureSupported(tasksTab, userAudiences.data)
        const isNotificationsEnabled = userAudiences && isFeatureSupported(notificationsTab, userAudiences.data)
        return (
            <View style={styles.container}>
                {isTasksEnabled && isNotificationsEnabled ? this.createTabContainer() : <NotificationsList isTasks={isTasksEnabled} />}
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    userAudiences: state.user.audiences,
    tasksTab: state.remoteConfig.featureConfig.tasks,
    notificationsTab: state.remoteConfig.featureConfig.notifications,
    isTaskActive: state.notifications.isTaskActive,
    userId: state.user.summary ? state.user.summary.userId : undefined,
    channelId: state.user.channelId
})

const mapDispatchToProps = (dispatch) => ({
    clearNotifications: (isTasks, userId) => dispatch(NotificationsActions.clearNotifications(isTasks, userId)),
})


export default connect(mapStateToProps, mapDispatchToProps)(NotificationsInboxScreen)

