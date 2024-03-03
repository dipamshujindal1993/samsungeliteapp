import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
    getNotifications: ['isTasks', 'pageNumber', 'userId'],
    getNotificationsSuccess: ['isTasks', 'notifications'],
    getNotificationsFailure: ['isTasks'],
    getUnreadCount: ['userId'],
    getUnreadCountSuccess: ['unreadCount'],
    clearNotifications: ['isTasks', 'userId'],
    clearNotificationsSuccess: ['isTasks'],
    markNotificationAsRead: ['id', 'userId'],
    markNotificationsAsRead: ['ids', 'userId'],
    getTaskDetails: ['isMission', 'initiativeId'],
    getTaskDetailsSuccess: ['isMission', 'taskDetails'],
    getTaskDetailsFailure: null,
    uploadTaskFile: ['fileItemId', 'file', 'initiativeId', 'stepId', 'isMission'],
    uploadTaskFileSuccess: null,
    uploadTaskFileFailure: null,
    markTaskAsComplete: ['initiativeId', 'stepId', 'isMission'],
    markTaskAsCompleteSuccess: null,
    markTaskAsCompleteFailure: null,
    optInPushNotifications: null,
    optInPushNotificationsSuccess: null,
    optOutPushNotifications: null,
    optOutPushNotificationsSuccess: null,
    updateDevice: ['device'],
    signOut: null,
    onRouteChange: ['isTasks'],
    getSpotReward: ['userId'],
    getSpotRewardSuccess: ['spotRewardNotification'],
    clearSpotReward: null,
    getChannelSuccess: null,
})

export const NotificationsTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    notifications: [],
    tasks: [],
    unreadCount: 0,
    errorLoadingNotifications: false,
    errorLoadingTasks: false,
    isTaskActive: false,
    taskDetails: null,
    missionDetails: null,
    spotRewardNotification: []
})

/* ------------- Selectors ------------- */

export const NotificationsSelectors = {
    optedInPushNotifications: state => state.notifications.optedInPushNotifications,
    lastSpotRewardDisplayed: state => state.notifications.lastSpotRewardDisplayed,
}

/* ------------- Reducers ------------- */

export const getNotifications = (state, { isTasks }) =>
    isTasks ? state.merge({ errorLoadingTasks: false }) : state.merge({ errorLoadingNotifications: false })

export const getNotificationsSuccess = (state, { isTasks, notifications }) =>
    isTasks ? state.merge({ tasks: notifications }) : state.merge({ notifications })

export const getNotificationsFailure = (state, { isTasks }) =>
    isTasks ? state.merge({ errorLoadingTasks: true }) : state.merge({ errorLoadingNotifications: true })

export const getUnreadCountSuccess = (state, { unreadCount }) =>
    state.merge({ unreadCount })

export const clearNotificationsSuccess = (state, { isTasks }) =>
    (isTasks ? state.merge({ tasks: { isCleared: true } }) : state.merge({ notifications: { isCleared: true } }))

export const getTaskDetails = (state, { isMission }) =>
    isMission ? state.merge({ missionDetails: null, loadingError: false }) : state.merge({ taskDetails: null, loadingError: false })

export const getTaskDetailsSuccess = (state, { isMission, taskDetails }) =>
    isMission ? state.merge({ missionDetails: taskDetails, loadingError: false }) : state.merge({ taskDetails, loadingError: false })

export const getTaskDetailsFailure = (state) =>
    state.merge({ loadingError: true })

export const uploadTaskFile = (state) =>
    state.merge({ uploadTaskFileSuccess: false, uploadTaskFileFailure: false, isUploading: true })

export const uploadTaskFileSuccess = (state) =>
    state.merge({ uploadTaskFileSuccess: true, uploadTaskFileFailure: false, isUploading: false })

export const uploadTaskFileFailure = (state) =>
    state.merge({ uploadTaskFileSuccess: false, uploadTaskFileFailure: true, isUploading: false })

export const markTaskAsComplete = (state) =>
    state.merge({ markTaskAsCompleteSuccess: false, markTaskAsCompleteFailure: false })

export const markTaskAsCompleteSuccess = (state) =>
    state.merge({ markTaskAsCompleteSuccess: true, markTaskAsCompleteFailure: false })

export const markTaskAsCompleteFailure = (state) =>
    state.merge({ markTaskAsCompleteSuccess: false, markTaskAsCompleteFailure: true })

export const optInPushNotificationsSuccess = (state) =>
    state.merge({ optedInPushNotifications: true })

export const optOutPushNotificationsSuccess = (state) =>
    state.merge({ optedInPushNotifications: false })

export const signOut = (state) =>
    state.merge({ unreadCount: 0, optedInPushNotifications: false, lastSpotRewardDisplayed: null })

export const onRouteChange = (state, { isTasks }) =>
    state.merge({ isTaskActive: isTasks })

export const getSpotRewardSuccess = (state, { spotRewardNotification }) =>
    state.merge({ spotRewardNotification, lastSpotRewardDisplayed: new Date().toISOString() })

export const clearSpotReward = (state) =>
    state.merge({ spotRewardNotification: [] })

export const getChannelSuccess = (state, { channelId, channel }) =>
    state.merge({
        notifications: [],
        tasks: [],
        unreadCount: 0,
    })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.GET_NOTIFICATIONS]: getNotifications,
    [Types.GET_NOTIFICATIONS_SUCCESS]: getNotificationsSuccess,
    [Types.GET_NOTIFICATIONS_FAILURE]: getNotificationsFailure,
    [Types.GET_UNREAD_COUNT_SUCCESS]: getUnreadCountSuccess,
    [Types.CLEAR_NOTIFICATIONS_SUCCESS]: clearNotificationsSuccess,
    [Types.GET_TASK_DETAILS]: getTaskDetails,
    [Types.GET_TASK_DETAILS_SUCCESS]: getTaskDetailsSuccess,
    [Types.GET_TASK_DETAILS_FAILURE]: getTaskDetailsFailure,
    [Types.UPLOAD_TASK_FILE]: uploadTaskFile,
    [Types.UPLOAD_TASK_FILE_SUCCESS]: uploadTaskFileSuccess,
    [Types.UPLOAD_TASK_FILE_FAILURE]: uploadTaskFileFailure,
    [Types.MARK_TASK_AS_COMPLETE]: markTaskAsComplete,
    [Types.MARK_TASK_AS_COMPLETE_SUCCESS]: markTaskAsCompleteSuccess,
    [Types.MARK_TASK_AS_COMPLETE_FAILURE]: markTaskAsCompleteFailure,
    [Types.OPT_IN_PUSH_NOTIFICATIONS_SUCCESS]: optInPushNotificationsSuccess,
    [Types.OPT_OUT_PUSH_NOTIFICATIONS_SUCCESS]: optOutPushNotificationsSuccess,
    [Types.SIGN_OUT]: signOut,
    [Types.ON_ROUTE_CHANGE]: onRouteChange,
    [Types.GET_SPOT_REWARD_SUCCESS]: getSpotRewardSuccess,
    [Types.CLEAR_SPOT_REWARD]: clearSpotReward,
    [Types.GET_CHANNEL_SUCCESS]: getChannelSuccess,
})