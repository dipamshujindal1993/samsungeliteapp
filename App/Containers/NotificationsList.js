import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import NavigationService from '@services/NavigationService'
import NotificationsActions from '@redux/NotificationsRedux';
import LoadingSpinner from '@components/LoadingSpinner'
import EndlessFlatList from '@components/EndlessFlatList'
import ErrorScreen from '@containers/ErrorScreen'
import I18n from '@i18n'
import styles from './Styles/NotificationsListStyles'
import { getRelativeTimeFromNow } from '@utils/TextUtils'
import {
    Colors,
    Constants,
} from '@resources'
import { NavigationEvents } from 'react-navigation';
import { open } from '@services/LinkHandler'
import { addParam } from '@utils/UrlUtils'
import CompleteIcon from '@svg/icon_complete'

class NotificationsList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            errorLoading: false,
            data: [],
        }
        this.pageNumber = 0
    }

    componentDidMount() {
        this._getNotifications()
    }

    _getNotifications() {
        const {
            isTasks,
            getNotifications,
            userId
        } = this.props;
        getNotifications(isTasks, this.pageNumber, userId)
    }

    componentDidUpdate(prevProps) {
        const { tasks, errorLoadingTasks, notifications, errorLoadingNotifications, isTasks } = this.props;
        if (isTasks) {
            if (prevProps.tasks != tasks) {
                const { results, isCleared, more } = tasks
                if (isCleared) {
                    this.setState({ data: [] })
                } else {
                    this.isMore = more
                    this.setState((prevState) => ({
                        isLoading: false,
                        data: this.pageNumber > 0 ? prevState.data.concat(results) : results,
                    }), () => {
                        this.state.data.length == 0 && setTimeout(() => {
                            NavigationService.navigate('Notifications');
                        }, 300);
                    })

                }
            }
            if (prevProps.errorLoadingTasks != errorLoadingTasks) {
                if (errorLoadingTasks) {
                    this.setState({
                        isLoading: false,
                        data: []
                    })
                }
            }
        } else {
            if (prevProps.notifications != notifications) {
                const { results, isCleared, more } = notifications
                if (isCleared) {
                    this.setState({ data: [] })
                } else {
                    this.isMore = more
                    this.setState((prevState) => ({
                        isLoading: false,
                        data: this.pageNumber > 0 ? prevState.data.concat(results) : results,
                    }))
                }
            }
            if (prevProps.errorLoadingNotifications != errorLoadingNotifications) {
                if (errorLoadingNotifications) {
                    this.setState({
                        isLoading: false,
                        data: []
                    })
                }
            }
        }
    }

    _onPressNotificationItem(index, id, read, event, data) {
        const { NOTIFICATIONS_TYPE } = Constants;
        if (!read) {
            const { markNotificationAsRead, userId } = this.props;
            const { data } = this.state;
            markNotificationAsRead(id, userId)
            this.setState({ data: Object.assign([...data], { [index]: { ...data[index], read: true } }) })
        }

        var { url, id, activityId } = data
        if (this.props.isTasks) {
            NavigationService.navigate('TaskAndMissionDetailScreen', { initiativeId: id })
        } else {
            switch (event) {
                case NOTIFICATIONS_TYPE.MISSION_DUE:
                case NOTIFICATIONS_TYPE.MISSION_ASSIGNED:
                    NavigationService.navigate('TaskAndMissionDetailScreen', { initiativeId: id, isMission: true });
                    break;
                case NOTIFICATIONS_TYPE.PRIZE_WON:
                    url = addParam(url, 'quantity', 1)
                    url = addParam(url, 'headerTitle', I18n.t('redemptions.screen_title_confirm_email'))
                    break;
                case NOTIFICATIONS_TYPE.COURSE_ASSIGNED:
                case NOTIFICATIONS_TYPE.COURSE_DUE:
                    NavigationService.navigate('CourseDetailScreen', { activityId });
                    break;
                default:
                    break;
            }
        }
        url && open({ url })
    }

    renderItem(item, index) {
        const {
            id,
            read,
            event,
            message,
            date_created } = item;
        const { notification, data } = message;
        const { channelId } = this.props;
        return (
            <TouchableOpacity activeOpacity={0.6} style={styles.listItemcontainer} onPress={() => this._onPressNotificationItem(index, id, read, event, data)} disabled={channelId != undefined}>
                <View style={styles.dotContainer}>
                    <View style={[styles.dot, !read && styles.unreadDot]} />
                </View>
                <View style={styles.descContainer}>
                    <Text numberOfLines={1} style={[styles.titleText, !read && styles.unreadText]}>{notification && notification.title}</Text>
                    {notification && notification.body && <Text style={styles.descText} numberOfLines={2}>{notification && notification.body}</Text>}
                    <Text style={styles.timeText}>{getRelativeTimeFromNow(date_created)}</Text>
                </View>
                {data.status == Constants.INITIATIVE_STATUS.COMPLETE && <View style={styles.itemStatusContainer}>
                    <CompleteIcon width={22} height={22} fill={Colors.rgb_54da8d} />
                </View>}
            </TouchableOpacity>
        )
    }

    renderSeparator() {
        return <View style={styles.separator} />
    }

    renderList() {
        const { data, isLoading } = this.state
        const { isTasks, errorLoadingNotifications, errorLoadingTasks } = this.props;
        if (data.length > 0) {
            return (
                <EndlessFlatList
                    data={data}
                    renderItem={({ item, index }) => this.renderItem(item, index)}
                    ItemSeparatorComponent={this.renderSeparator}
                    refreshing={isLoading}
                    onRefresh={() => {
                        this.setState({
                            isLoading: true,
                            data: [],
                        })
                        this.pageNumber = 0
                        this._getNotifications()
                    }}
                    loadMore={() => {
                        this.pageNumber++
                        this._getNotifications()
                    }}
                    loadedAll={!this.isMore}
                />
            )
        } else if (!isLoading) {
            return (
                <ErrorScreen
                    title={I18n.t(isTasks ?
                        (errorLoadingTasks ? 'notification.tasks_fetch_error' : 'notification.no_tasks_found') :
                        (errorLoadingNotifications ? 'notification.notifications_fetch_error' : 'notification.no_notifications_found')
                    )}
                />
            )
        }
    }

    render() {
        const {
            isLoading
        } = this.state
        const { isTasks, onRouteChange } = this.props;
        return (
            <>
                <NavigationEvents onDidFocus={() => onRouteChange(isTasks)} />
                {
                    isLoading ?
                        <LoadingSpinner /> :
                        <View style={styles.container}>
                            {this.renderList()}
                        </View>
                }
            </>
        )
    }

}

const mapStateToProps = (state) => ({
    tasks: state.notifications.tasks,
    notifications: state.notifications.notifications,
    errorLoadingNotifications: state.notifications.errorLoadingNotifications,
    errorLoadingTasks: state.notifications.errorLoadingTasks,
    userId: state.user.summary ? state.user.summary.userId : undefined,
    channelId: state.user.channelId
})

const mapDispatchToProps = (dispatch) => ({
    getNotifications: (isTasks, pageNumber, userId) => dispatch(NotificationsActions.getNotifications(isTasks, pageNumber, userId)),
    markNotificationAsRead: (id, userId) => dispatch(NotificationsActions.markNotificationAsRead(id, userId)),
    onRouteChange: (isTasks) => dispatch(NotificationsActions.onRouteChange(isTasks))
})

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsList)