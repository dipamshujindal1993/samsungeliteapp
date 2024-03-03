import {
  all,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects'
import DebugConfig from '@config/DebugConfig'
import SeaAPI from '@services/SeaApi'
import SumTotalAPI from '@services/SumTotalApi'
import CheilAPI from '@services/CheilApi'
import FixtureAPI from '@services/FixtureApi'

/* ------------- Types ------------- */

import { StartupTypes } from '@redux/StartupRedux'
import { AppTypes } from '@redux/AppRedux'
import { NavigationTypes } from '@redux/NavigationRedux'
import { UserTypes } from '@redux/UserRedux'
import { RewardsTypes } from '@redux/RewardsRedux'
import { ActivitiesTypes } from '@redux/ActivitiesRedux'
import { CommunitiesTypes } from '@redux/CommunitiesRedux'
import { AssessmentsTypes } from '@redux/AssessmentsRedux'
import { NotificationsTypes } from '@redux/NotificationsRedux'
import { SearchTypes } from '@redux/SearchRedux'
import { LeadsTypes } from '@redux/LeadsRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import {
  getAccessToken,
  getStores,
  getRoles,
  signUp,
  refreshAudiences,
  loadHomeScreen,
  getUserSummary,
  postUserProfileImage,
  getRewards,
  getPoints,
  getRewardDetailById,
  getAssessmentQuestions,
  getAssessmentQuestion,
  postAssessmentAnswer,
  postRewardParticipation,
  getCourses,
  getCourseModules,
  getSubTopics,
  getTopicActivities,
  getLeaderboards,
  getActivity,
  getActivityDetail,
  getActivityChild,
  registerActivity,
  completeActivity,
  postPoints,
  postActivity,
  getCommunities,
  getCommunityPost,
  getCheilSummary,
  getWeeklyActivations,
  updateUserSummary,
  checkExists,
  getOrganizationDetail,
  getBanners,
  createPost,
  getAssessmentSummary,
  requestOTP,
  verifyOTP,
  updatePassword,
  getGamificationOverview,
  getNotifications,
  clearNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markNotificationsAsRead,
  getTaskDetails,
  uploadTaskFile,
  markTaskAsComplete,
  optInPushNotifications,
  optOutPushNotifications,
  updateDevice,
  postSubmitAssessments,
  getPollSummary,
  getSearchSuggestions,
  searchActivities,
  getSearchResult,
  uploadFile,
  getPostDetail,
  likeCommunityPost,
  unlikeCommunityPost,
  getPostCommentList,
  likeCommunityCommentPost,
  dislikeCommunityCommentPost,
  deletePost,
  updatePost,
  sendFeedbackFormRequest,
  checkTermsConditions,
  getTermsConditions,
  getUsers,
  getSpotRewards,
  postSpotRewards,
  getActivities,
  getTransactionHistory,
  addComment,
  updateComment,
  deleteComment,
  getLearning,
  getSalesTracking,
  getIMEIStatus,
  getAdvocateInfo,
  getAdvocateDevices,
  getAdvocateDeviceHistory,
  updateAdvocateStatus,
  getInitiatives,
  getSpotReward,
  getLeadsResolutions,
  getLeadsFilterByOptions,
  getLeadDetail,
  getLeads,
  updateLeadStatus,
  getSalesTrackingCampaign,
  checkGeofence,
  logOut,
  getChannels,
  getChannel,
} from './ApiSagas'


/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
export const seaApi = DebugConfig.useFixturesSea ? FixtureAPI : SeaAPI.create()
const stApi = DebugConfig.useFixturesSumTotal ? FixtureAPI : SumTotalAPI.create()
const chApi = DebugConfig.useFixturesCheil ? FixtureAPI : CheilAPI.create()

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    takeLatest(StartupTypes.STARTUP, startup, seaApi, stApi, chApi),

    takeLatest(AppTypes.GET_ACCESS_TOKEN, getAccessToken, seaApi, stApi),

    takeEvery(ActivitiesTypes.GET_COURSES, getCourses, stApi),

    takeEvery(ActivitiesTypes.GET_COURSE_MODULES, getCourseModules, stApi),

    takeEvery(ActivitiesTypes.GET_SUB_TOPICS, getSubTopics, stApi),

    takeLatest(ActivitiesTypes.GET_TOPIC_ACTIVITIES, getTopicActivities, stApi),

    takeLatest(AssessmentsTypes.GET_ASSESSMENT_QUESTIONS, getAssessmentQuestions, stApi),

    takeLatest(AssessmentsTypes.GET_ASSESSMENT_QUESTION, getAssessmentQuestion, stApi),

    takeLatest(AssessmentsTypes.POST_ASSESSMENT_ANSWER, postAssessmentAnswer, stApi),

    takeLatest(AssessmentsTypes.GET_ASSESSMENT_SUMMARY, getAssessmentSummary, stApi),

    takeLatest(AssessmentsTypes.POST_SUBMIT_ASSESSMENTS, postSubmitAssessments, stApi),

    takeLatest(AssessmentsTypes.GET_POLL_SUMMARY, getPollSummary, stApi),

    takeLatest(ActivitiesTypes.GET_ACTIVITY, getActivity, stApi),

    takeLatest(ActivitiesTypes.GET_ACTIVITY_DETAIL, getActivityDetail, stApi),

    takeLatest(ActivitiesTypes.GET_ACTIVITY_CHILD, getActivityChild, stApi),

    takeLatest(ActivitiesTypes.REGISTER_ACTIVITY, registerActivity, stApi),

    takeLatest(ActivitiesTypes.COMPLETE_ACTIVITY, completeActivity, stApi),

    takeLatest(ActivitiesTypes.POST_POINTS, postPoints, chApi),

    takeLatest(ActivitiesTypes.POST_ACTIVITY, postActivity, chApi),

    takeLatest(UserTypes.GET_STORES, getStores, stApi),

    takeLatest(UserTypes.GET_DOMAINS, getStores, stApi),

    takeLatest(UserTypes.GET_ROLES, getRoles, stApi),

    takeLatest(UserTypes.SIGN_UP, signUp, seaApi, stApi),

    takeLatest(AppTypes.SIGN_IN_SUCCESS, loadHomeScreen, stApi),

    takeLatest(UserTypes.REFRESH_AUDIENCES, refreshAudiences, stApi),

    takeLatest(NavigationTypes.LOAD_HOME_SCREEN, loadHomeScreen, stApi),

    takeLatest(RewardsTypes.GET_REWARDS, getRewards, chApi),

    takeLatest(RewardsTypes.GET_REWARD_DETAIL, getRewardDetailById, chApi),

    takeLatest(RewardsTypes.GET_REWARD_PARTICIPATION_RESULT, postRewardParticipation, chApi),

    takeLatest(UserTypes.GET_USER_SUMMARY, getUserSummary, seaApi, stApi),

    takeLatest(UserTypes.POST_USER_PROFILE_IMAGE, postUserProfileImage, stApi),

    takeLatest(UserTypes.GET_POINTS, getPoints, chApi),

    takeEvery(UserTypes.GET_LEADERBOARDS, getLeaderboards, chApi),

    takeLatest(CommunitiesTypes.GET_COMMUNITIES, getCommunities, stApi),

    takeLatest(CommunitiesTypes.GET_COMMUNITY_POST, getCommunityPost, stApi),

    takeLatest(UserTypes.GET_CHEIL_SUMMARY, getCheilSummary, chApi),

    takeLatest(UserTypes.GET_WEEKLY_ACTIVATIONS, getWeeklyActivations, chApi),

    takeLatest(UserTypes.CHECK_EXISTS, checkExists, seaApi),

    takeLatest(UserTypes.UPDATE_USER_SUMMARY, updateUserSummary, seaApi, stApi),

    takeLatest(UserTypes.GET_ORGANIZATION_DETAIL, getOrganizationDetail, stApi),

    takeLatest(UserTypes.GET_BANNERS, getBanners, stApi),

    takeLatest(UserTypes.REQUEST_OTP, requestOTP, seaApi),

    takeLatest(UserTypes.VERIFY_OTP, verifyOTP, seaApi),

    takeLatest(UserTypes.UPDATE_PASSWORD, updatePassword, seaApi),

    takeLatest(UserTypes.GET_GAMIFICATION_OVERVIEW, getGamificationOverview, stApi),

    takeEvery(NotificationsTypes.GET_NOTIFICATIONS, getNotifications, seaApi),

    takeLatest(NotificationsTypes.CLEAR_NOTIFICATIONS, clearNotifications, seaApi),

    takeLatest(NotificationsTypes.GET_UNREAD_COUNT, getUnreadNotificationsCount, seaApi),

    takeLatest(NotificationsTypes.MARK_NOTIFICATION_AS_READ, markNotificationAsRead, seaApi),

    takeLatest(NotificationsTypes.MARK_NOTIFICATIONS_AS_READ, markNotificationsAsRead, seaApi),

    takeLatest(NotificationsTypes.GET_TASK_DETAILS, getTaskDetails, stApi),

    takeLatest(NotificationsTypes.UPLOAD_TASK_FILE, uploadTaskFile, stApi),

    takeLatest(NotificationsTypes.MARK_TASK_AS_COMPLETE, markTaskAsComplete, stApi),

    takeLatest(NotificationsTypes.OPT_IN_PUSH_NOTIFICATIONS, optInPushNotifications, seaApi),

    takeLatest(NotificationsTypes.OPT_OUT_PUSH_NOTIFICATIONS, optOutPushNotifications, seaApi),

    takeLatest(NotificationsTypes.UPDATE_DEVICE, updateDevice, seaApi),

    takeLatest(SearchTypes.GET_SEARCH_SUGGESTIONS, getSearchSuggestions, stApi),

    takeEvery(SearchTypes.SEARCH_ACTIVITIES, searchActivities, stApi),

    takeLatest(SearchTypes.GET_ARTICLES_SEARCHED, getSearchResult, stApi),

    takeLatest(SearchTypes.GET_COURSES_SEARCHED, getSearchResult, stApi),

    takeLatest(SearchTypes.GET_RESOURCES_SEARCHED, getSearchResult, stApi),

    takeLatest(SearchTypes.GET_ACTIVITIES_SEARCHED, getSearchResult, stApi),

    takeLatest(CommunitiesTypes.SAVE_POST, createPost, stApi),

    takeEvery(CommunitiesTypes.UPLOAD_FILE, uploadFile, stApi),

    takeLatest(CommunitiesTypes.GET_POST_DETAIL, getPostDetail, stApi),

    takeLatest(CommunitiesTypes.LIKE_COMMUNITY_POST, likeCommunityPost, stApi),

    takeLatest(CommunitiesTypes.UNLIKE_COMMUNITY_POST, unlikeCommunityPost, stApi),

    takeLatest(CommunitiesTypes.GET_POST_COMMENT_LIST, getPostCommentList, stApi),

    takeLatest(CommunitiesTypes.LIKE_COMMUNITY_COMMENT_POST, likeCommunityCommentPost, stApi),

    takeLatest(CommunitiesTypes.DISLIKE_COMMUNITY_COMMENT_POST, dislikeCommunityCommentPost, stApi),

    takeLatest(CommunitiesTypes.DELETE_POST, deletePost, stApi),

    takeLatest(CommunitiesTypes.UPDATE_POST, updatePost, stApi),

    takeLatest(UserTypes.SEND_FEEDBACK_FORM_REQUEST, sendFeedbackFormRequest, seaApi),

    takeLatest(UserTypes.CHECK_TERMS_CONDITIONS, checkTermsConditions, seaApi),

    takeLatest(UserTypes.GET_TERMS_CONDITIONS, getTermsConditions, seaApi),

    takeLatest(UserTypes.ACCEPTED_NEW_TERMS_CONDITIONS, loadHomeScreen, stApi),

    takeLatest(UserTypes.GET_USERS, getUsers, chApi),

    takeLatest(RewardsTypes.GET_SPOT_REWARDS, getSpotRewards, chApi),

    takeLatest(RewardsTypes.POST_SPOT_REWARDS, postSpotRewards, chApi),

    takeLatest(UserTypes.GET_ACTIVITIES, getActivities, chApi),

    takeEvery(UserTypes.GET_TRANSACTION_HISTORY, getTransactionHistory, chApi),

    takeLatest(CommunitiesTypes.ADD_COMMENT, addComment, stApi),

    takeLatest(CommunitiesTypes.UPDATE_COMMENT, updateComment, stApi),

    takeLatest(CommunitiesTypes.DELETE_COMMENT, deleteComment, stApi),

    takeLatest(ActivitiesTypes.GET_LEARNING, getLearning, stApi),

    takeLatest(UserTypes.GET_SALES_TRACKING, getSalesTracking, chApi),

    takeLatest(UserTypes.GET_IMEI_STATUS, getIMEIStatus, chApi),

    takeLatest(UserTypes.GET_ADVOCATE_INFO, getAdvocateInfo, chApi),

    takeLatest(UserTypes.GET_ADVOCATE_DEVICES, getAdvocateDevices, chApi),

    takeLatest(UserTypes.GET_ADVOCATE_DEVICE_HISTORY, getAdvocateDeviceHistory, chApi),

    takeLatest(UserTypes.UPDATE_ADVOCATE_STATUS, updateAdvocateStatus, chApi),

    takeLatest(UserTypes.GET_INITIATIVES, getInitiatives, stApi),

    takeLatest(NotificationsTypes.GET_SPOT_REWARD, getSpotReward, seaApi),

    takeLatest(LeadsTypes.GET_LEADS_RESOLUTIONS, getLeadsResolutions, seaApi),

    takeLatest(LeadsTypes.GET_LEADS_FILTER_BY_OPTIONS, getLeadsFilterByOptions, seaApi),

    takeLatest(LeadsTypes.GET_LEAD_DETAIL, getLeadDetail, seaApi),

    takeLatest(LeadsTypes.GET_LEADS, getLeads, seaApi),

    takeLatest(LeadsTypes.UPDATE_LEAD_STATUS, updateLeadStatus, seaApi),

    takeLatest(UserTypes.GET_SALES_TRACKING_CAMPAIGN, getSalesTrackingCampaign, chApi),

    takeLatest(UserTypes.CHECK_GEOFENCE, checkGeofence, seaApi),

    takeLatest(UserTypes.LOG_OUT, logOut, seaApi),

    takeLatest(UserTypes.GET_CHANNELS, getChannels, seaApi),

    takeLatest(UserTypes.GET_CHANNEL, getChannel, seaApi),

    takeLatest(NavigationTypes.RESET, loadHomeScreen, stApi),
  ])
}
