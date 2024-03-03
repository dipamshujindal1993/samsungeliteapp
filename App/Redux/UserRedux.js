import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

import { Constants } from '@resources'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getStores: ['orgdomainInd', 'zip', 'affiliationCode'],
  getStoresSuccess: ['stores'],
  getDomains: ['orgdomainInd', 'zip', 'affiliationCode'],
  getDomainsSuccess: ['domains'],
  getRoles: null,
  signUp: ['userInfo'],
  signUpSuccess: ['userId'],
  signUpFailure: ['errorMessage'],
  refreshAudiences: ['userId'],
  refreshAudiencesSuccess: null,
  refreshAudiencesFailure: null,
  postSignUp: null,
  getRolesSuccess: ['roles'],
  getUserSummary: null,
  getUserSummarySuccess: ['summary'],
  getUserSummaryFailure: null,
  getUserAudiencesSuccess: ['audiences'],
  postUserProfileImage: ['file'],
  postUserProfileImageSuccess: ['imageUrl'],
  postUserProfileImageFailure: null,
  getPoints: null,
  getPointsSuccess: ['points'],
  getLeaderboards: ['myRepsLeaderboards', 'period', 'pageNumber', 'filter', 'filterId'],
  getLeaderboardsSuccess: ['myRepsLeaderboards', 'leaderboards'],
  save: ['userInfo', 'email', 'userInfoChangingAffiliationCode'],
  updateUserId: ['userId'],
  showHideChangingAffiliationCodeSuccessDialog: ['isVisible'],
  getCheilSummary: null,
  getCheilSummarySuccess: ['cheilSummary'],
  getWeeklyActivations: null,
  getWeeklyActivationsSuccess: ['activations'],
  checkExists: ['username'],
  checkExistsSuccess: ['exists'],
  updateUserSummary: ['userInfo'],
  updateUserSummarySuccess: ['summary'],
  updateUserSummaryFailure: null,
  getOrganizationDetail: ['organizationId'],
  getOrganizationDetailSuccess: ['organizationDetail'],
  getBanners: ['pageNumber'],
  getBannersSuccess: ['banners'],
  getBannersFailure: null,
  sendFeedbackFormRequest: ['form', 'id'],
  sendFeedbackFormRequestSuccess: null,
  sendFeedbackFormRequestFailure: null,
  checkTermsConditions: null,
  checkTermsConditionsSuccess: ['tnc'],
  getTermsConditions: ['org_code'],
  getTermsConditionsSuccess: ['tnc'],
  hasNewTermsConditions: null,
  acceptedNewTermsConditions: null,
  requestOTP: ['email'],
  verifyOTP: ['email', 'otp'],
  verifyOTPSuccess: ['verifyOTPResponse'],
  verifyOTPFailure: null,
  updatePassword: ['otp', 'email', 'password'],
  updatePasswordSuccess: null,
  updatePasswordFailure: null,
  getGamificationOverview: null,
  getGamificationOverviewSuccess: ['gamificationOverview'],
  getUsers: ['page', 'query'],
  getUsersSuccess: ['users'],
  getUsersFailure: null,
  getActivities: null,
  getActivitiesSuccess: ['activities'],
  getTransactionHistory: ['categoryName', 'categoryString', 'page'],
  getTransactionHistorySuccess: ['categoryName', 'transactionHistory'],
  getTransactionHistoryFailure: ['categoryName'],
  getSalesTracking: ['campaignId', 'filter', 'page', 'pageSize'],
  getSalesTrackingSuccess: ['salesTracking'],
  signOut: null,
  getIMEIStatus: null,
  getIMEIStatusSuccess: ['imeiStatus'],
  getIMEIStatusFailure: null,
  getAdvocateInfo: ['advocateId'],
  getAdvocateInfoSuccess: ['advocateInfo'],
  getAdvocateInfoFailure: null,
  getAdvocateDevices: ['advocateId'],
  getAdvocateDevicesSuccess: ['devices'],
  getAdvocateDevicesFailure: null,
  getAdvocateDeviceHistory: ['advocateId', 'deviceId'],
  getAdvocateDeviceHistorySuccess: ['history'],
  getAdvocateDeviceHistoryFailure: null,
  updateAdvocateStatus: ['advocateId', 'deviceId', 'statusId', 'deviceImei'],
  updateAdvocateStatusSuccess: ['data'],
  updateAdvocateStatusFailure: ['data'],
  getInitiatives: ['initiativeType', 'limit', 'offset'],
  getInitiativesSuccess: ['initiativeType', 'initiatives'],
  getInitiativesFailure: ['initiativeType'],
  getSalesTrackingFailure: ['salesTracking'],
  getSalesTrackingCampaign: ['page', 'pageSize'],
  getSalesTrackingCampaignSuccess: ['salesTrackingCampaign'],
  getSalesTrackingCampaignFailure: ['salesTrackingCampaign'],
  checkGeofence: ['latitude', 'longitude', 'radius'],
  logOut: null,
  getChannels: null,
  getChannelsSuccess: ['channels'],
  getChannel: ['channelId'],
  getChannelSuccess: ['channelId', 'channel'],
  getChannelFailure: null,
  defaultView: null,
  getAccessTokenSuccess: null,
})

export const UserTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  stores: null,
  roles: null,
  summary: null,
  feedback: null,
  audiences: null,
  refreshAudiencesFailure: false,
  userInfo: null,
  userInfoChangingAffiliationCode: null,
  points: null,
  repLeaderboards: null,
  fsmLeaderboards: null,
  cheilSummary: null,
  activations: null,
  banners: null,
  tnc: null,
  verifyOTPResponse: null,
  gamificationOverview: null,
  users: null,
  activities: null,
  transactionHistory: {},
  imeiStatus: null,
  imeiStatusFailure: false,
  advocateInfo: null,
  advocateInfoFailure: false,
  advocateDevices: null,
  advocateDevicesFailure: false,
  advocateDeviceHistory: null,
  advocateDeviceHistoryFailure: false,
  isAdvocateDeviceHistoryLoading: false,
  isUpdateAdvocateStatusLoading: false,
  updateAdvocateStatusResult: null,
})

/* ------------- Selectors ------------- */

export const UserSelectors = {
  hasNewTermsConditions: state => state.user.hasNewTermsConditions,
  getUserId: state => {
    if (state.user.channelId && state.user.channel) {
      return state.user.channel.user_id
    } else {
      return state.user.userId
    }
  },
  getDomains: state => state.user.domains,
  getTncHash: state => state.user.summary ? state.user.summary.personOptional.text2 : undefined,
  getPrimaryDomainCode: state => state.user.summary ? state.user.summary.primaryDomainCode : undefined,
  audiences: state => state.user.audiences,
}

/* ------------- Reducers ------------- */

export const getStoresSuccess = (state, { stores }) =>
  state.merge({ stores })

export const getDomainsSuccess = (state, { domains }) =>
  state.merge({ domains })

export const getRolesSuccess = (state, { roles }) =>
  state.merge({ roles })

export const signUp = (state) =>
  state.merge({ signUpSuccess: false, signUpFailure: false })

export const signUpSuccess = (state, { userId }) =>
  state.merge({ userId, signUpSuccess: true, signUpFailure: false, email: state.userInfo ? state.userInfo.emailAddress : state.email })

export const signUpFailure = (state, { errorMessage }) =>
  state.merge({ signUpSuccess: false, signUpFailure: true, errorMessage })

export const refreshAudiences = (state) =>
  state.merge({ refreshAudiencesSuccess: false, refreshAudiencesFailure: false })

export const refreshAudiencesSuccess = (state) =>
  state.merge({ refreshAudiencesSuccess: true, refreshAudiencesFailure: false })

export const refreshAudiencesFailure = (state) =>
  state.merge({ refreshAudiencesSuccess: false, refreshAudiencesFailure: true })

export const cleanUp = (state) =>
  state.merge({ signUpSuccess: false, refreshAudiencesSuccess: false, userInfo: null })

export const getUserSummary = (state) =>
  state.merge({ getUserSummaryFailure: false })

export const getUserSummarySuccess = (state, { summary }) =>
  state.merge({ summary, getUserSummaryFailure: false })

export const getUserSummaryFailure = (state) =>
  state.merge({ getUserSummaryFailure: true })

export const getUserAudiencesSuccess = (state, { audiences }) =>
  state.merge({ audiences })

export const postUserProfileImage = (state) =>
  state.merge({ uploadProfileImageSuccess: false, uploadProfileImageFailure: false })

export const postUserProfileImageSuccess = (state, { imageUrl }) =>
  state.merge({ summary: { ...state.summary, imageUrl }, uploadProfileImageSuccess: true, uploadProfileImageFailure: false })

export const postUserProfileImageFailure = (state) =>
  state.merge({ uploadProfileImageSuccess: false, uploadProfileImageFailure: true })

export const getPointsSuccess = (state, { points }) =>
  state.merge({ points })

export const getLeaderboardsSuccess = (state, { myRepsLeaderboards, leaderboards }) => {
  if (myRepsLeaderboards) {
    return state.merge({ repsLeaderboards: leaderboards })
  } else {
    return state.merge({ leaderboards })
  }
}

export const getCheilSummarySuccess = (state, { cheilSummary }) =>
  state.merge({ cheilSummary })

export const getWeeklyActivationsSuccess = (state, { activations }) =>
  state.merge({ activations })

export const getGamificationOverviewSuccess = (state, { gamificationOverview }) =>
  state.merge({ gamificationOverview })

export const save = (state, { userInfo, email, userInfoChangingAffiliationCode }) => {
  if (userInfo && email) {
    return state.merge({ userInfo, email })
  } else if (userInfo) {
    return state.merge({ userInfo })
  } else if (email) {
    return state.merge({ email })
  } else if (userInfoChangingAffiliationCode) {
    return state.merge({ userInfoChangingAffiliationCode })
  } else {
    return state
  }
}

export const updateUserId = (state, { userId }) =>
  state.merge({ userId })

export const showHideChangingAffiliationCodeSuccessDialog = (state, { isVisible }) =>
  state.merge({ shouldShowChangingAffiliationCodeSuccessDialog: isVisible })

export const checkExistsSuccess = (state, { exists }) =>
  state.merge({ exists })

export const updateUserSummary = (state) =>
  state.merge({ updateUserSummarySuccess: false, updateUserSummaryFailure: false })

export const updateUserSummarySuccess = (state, { summary }) => {
  if (summary.userId) {
    return state.merge({ summary, updateUserSummaryFailure: false, updateUserSummarySuccess: true })
  } else {
    return state.merge({ summary: { ...state.summary, email_opt_in: summary.email_opt_in, push_opt_in: summary.push_opt_in }, updateUserSummaryFailure: false, updateUserSummarySuccess: true })
  }
}

export const updateUserSummaryFailure = (state) =>
  state.merge({ updateUserSummaryFailure: true, updateUserSummarySuccess: false })

export const getOrganizationDetailSuccess = (state, { organizationDetail }) =>
  state.merge({ organizationDetail })

export const getBanners = (state) =>
  state.merge({ isLoadingBanners: true, bannersFailure: false })

export const getBannersSuccess = (state, { banners }) =>
  state.merge({ banners, isLoadingBanners: false, bannersFailure: false })

export const getBannersFailure = (state) =>
  state.merge({ isLoadingBanners: false, bannersFailure: true })

export const sendFeedbackFormRequest = (state) => {
  return state.merge({ sendFeedbackSuccess: false, sendFeedbackFailure: false })
}

export const sendFeedbackFormRequestSuccess = (state) => {
  return state.merge({ sendFeedbackSuccess: true, sendFeedbackFailure: false })
}

export const sendFeedbackFormRequestFailure = (state) => {
  return state.merge({ sendFeedbackSuccess: false, sendFeedbackFailure: true })
}

export const getTermsConditions = (state) =>
  state.merge({ isLoadingTnC: true, tnc: null })

export const getTermsConditionsSuccess = (state, { tnc }) =>
  state.merge({ isLoadingTnC: false, tnc })

export const checkTermsConditionsSuccess = (state, { tnc }) =>
  state.merge({ tnc })

export const hasNewTermsConditions = (state) =>
  state.merge({ hasNewTermsConditions: true })

export const acceptedNewTermsConditions = (state) =>
  state.merge({ hasNewTermsConditions: false })

export const verifyOTP = (state) =>
  state.merge({ verifyOTPFailure: false })

export const verifyOTPSuccess = (state, { verifyOTPResponse }) =>
  state.merge({ verifyOTPResponse, verifyOTPFailure: false })

export const verifyOTPFailure = (state) =>
  state.merge({ verifyOTPFailure: true })

export const getUsersSuccess = (state, { users }) =>
  state.merge({ users, getUsersFailure: false })

export const getUsersFailure = (state) =>
  state.merge({ getUsersFailure: true })

export const updatePassword = (state) =>
  state.merge({ isUpdatingPassword: true, updatePasswordSuccess: false, updatePasswordFailure: false })

export const updatePasswordSuccess = (state) =>
  state.merge({ isUpdatingPassword: false, updatePasswordSuccess: true, updatePasswordFailure: false })

export const updatePasswordFailure = (state) =>
  state.merge({ isUpdatingPassword: false, updatePasswordSuccess: false, updatePasswordFailure: true })

export const getTransactionHistorySuccess = (state, { categoryName, transactionHistory }) => {
  const newTransactionHistory = { ...state.transactionHistory }
  newTransactionHistory[categoryName] = transactionHistory
  return state.merge({ transactionHistory: newTransactionHistory })
}

export const getTransactionHistoryFailure = (state, { categoryName }) => {
  const newTransactionHistory = { ...state.transactionHistory }
  newTransactionHistory[categoryName] = { isError: true }
  return state.merge({ transactionHistory: newTransactionHistory })
}

export const signOut = (state) =>
  state.merge({
    summary: null,
    audiences: null,
    points: null,
    cheilSummary: null,
    activities: null,
    gamificationOverview: null,
    banners: null,
    channelId: null,
    channel: null,
    tnc: null,
    activations: null,
    transactionHistory: {},
  })

export const getActivitiesSuccess = (state, { activities }) =>
  state.merge({ activities })

export const getSalesTrackingSuccess = (state, { salesTracking }) =>
  state.merge({ salesTracking, salesTrackingFailure: false })

export const getIMEIStatus = (state) =>
  state.merge({ imeiStatus: null, imeiStatusFailure: false })

export const getIMEIStatusSuccess = (state, { imeiStatus }) =>
  state.merge({ imeiStatus: imeiStatus, imeiStatusFailure: false })

export const getIMEIStatusFailure = (state) =>
  state.merge({ imeiStatus: null, imeiStatusFailure: true })

export const getAdvocateInfo = (state) =>
  state.merge({ advocateInfo: null, advocateInfoFailure: false })

export const getAdvocateInfoSuccess = (state, { advocateInfo }) =>
  state.merge({ advocateInfo: advocateInfo, advocateInfoFailure: false })

export const getAdvocateInfoFailure = (state) =>
  state.merge({ advocateInfo: null, advocateInfoFailure: true })

export const getAdvocateDevices = (state) =>
  state.merge({ advocateDevices: null, advocateDevicesFailure: false })

export const getAdvocateDevicesSuccess = (state, { devices }) =>
  state.merge({ advocateDevices: devices, advocateDevicesFailure: false })

export const getAdvocateDevicesFailure = (state) =>
  state.merge({ advocateDevices: null, advocateDevicesFailure: true })

export const getAdvocateDeviceHistory = (state) =>
  state.merge({ advocateDeviceHistory: null, advocateDeviceHistoryFailure: false, isAdvocateDeviceHistoryLoading: true })

export const getAdvocateDeviceHistorySuccess = (state, { history }) =>
  state.merge({ advocateDeviceHistory: history, advocateDeviceHistoryFailure: false, isAdvocateDeviceHistoryLoading: false })

export const getAdvocateDeviceHistoryFailure = (state) =>
  state.merge({ advocateDeviceHistory: null, advocateDeviceHistoryFailure: true, isAdvocateDeviceHistoryLoading: false })

export const updateAdvocateStatus = (state) =>
  state.merge({ updateAdvocateStatusResult: null, isUpdateAdvocateStatusLoading: true })

export const updateAdvocateStatusSuccess = (state, { data }) =>
  state.merge({ updateAdvocateStatusResult: { ok: true, data: data }, isUpdateAdvocateStatusLoading: false })

export const updateAdvocateStatusFailure = (state, { data }) =>
  state.merge({ updateAdvocateStatusResult: { ok: false, data: data }, isUpdateAdvocateStatusLoading: false })

export const getInitiatives = (state, { initiativeType }) => {
  if (initiativeType == Constants.INITIATIVE_TYPES.MISSION) {
    return state.merge({ isLoadingMissions: true, missionsFailure: false })
  } else {
    return state.merge({ isLoadingTasks: true, tasksFailure: false })
  }
}

export const getInitiativesSuccess = (state, { initiativeType, initiatives }) => {
  if (initiativeType == Constants.INITIATIVE_TYPES.MISSION) {
    return state.merge({ missions: initiatives, isLoadingMissions: false, missionsFailure: false })
  } else {
    return state.merge({ tasks: initiatives, isLoadingTasks: false, tasksFailure: false })
  }
}

export const getInitiativesFailure = (state, { initiativeType }) => {
  if (initiativeType == Constants.INITIATIVE_TYPES.MISSION) {
    return state.merge({ isLoadingMissions: false, missionsFailure: true })
  } else {
    return state.merge({ isLoadingTasks: false, tasksFailure: true })
  }
}

export const getSalesTracking = (state) =>
  state.merge({ noActiveCampaign: false, salesTrackingFailure: false })

export const getSalesTrackingFailure = (state) =>
  state.merge({ noActiveCampaign: true, salesTrackingFailure: true })

export const getSalesTrackingCampaign = (state) =>
  state.merge({ noActiveCampaign: false, salesTrackingCampaignFailure: false })

export const getSalesTrackingCampaignSuccess = (state, { salesTrackingCampaign }) => {
  if (salesTrackingCampaign.content && salesTrackingCampaign.content.length > 0) {
    const { eligibleStatus } = salesTrackingCampaign.content[0]
    let items = salesTrackingCampaign.content.filter((e)=>{
      return e.status !== Constants.SALES_TRACKING.STATUS_PROGRESS
    })
    if (items.length > 0) {
      return state.merge({ noActiveCampaign: true, salesTrackingCampaignFailure: false, salesTrackingCampaign })
    } else {
      return state.merge({ noActiveCampaign: false, salesTrackingCampaignFailure: false, eligibleStatus, salesTrackingCampaign })
    }
  } else {
    return state.merge({ noActiveCampaign: true, salesTrackingCampaignFailure: false })
  }
}

export const getSalesTrackingCampaignFailure = (state) =>
  state.merge({ noActiveCampaign: false, salesTrackingCampaignFailure: true })

export const getChannelsSuccess = (state, { channels }) =>
  state.merge({ channels })

export const getChannel = (state) =>
  state.merge({ getChannelFailure: false })

export const getChannelSuccess = (state, { channelId, channel }) =>
  state.merge({
    channelId,
    channel,
    getChannelFailure: false,
    summary: null,
    points: null,
    cheilSummary: null,
    activities: null,
    gamificationOverview: null,
    banners: null,
    tnc: null,
    activations: null,
    transactionHistory: {},
  })

export const getChannelFailure = (state) =>
  state.merge({ getChannelFailure: true })

export const resetUserInfo = (state) =>
  state.merge({
    points: null,
    cheilSummary: null,
    activities: null,
  })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_STORES_SUCCESS]: getStoresSuccess,
  [Types.GET_DOMAINS_SUCCESS]: getDomainsSuccess,
  [Types.GET_ROLES_SUCCESS]: getRolesSuccess,
  [Types.SIGN_UP]: signUp,
  [Types.SIGN_UP_SUCCESS]: signUpSuccess,
  [Types.SIGN_UP_FAILURE]: signUpFailure,
  [Types.REFRESH_AUDIENCES]: refreshAudiences,
  [Types.REFRESH_AUDIENCES_SUCCESS]: refreshAudiencesSuccess,
  [Types.POST_SIGN_UP]: cleanUp,
  [Types.GET_USER_SUMMARY]: getUserSummary,
  [Types.GET_USER_SUMMARY_SUCCESS]: getUserSummarySuccess,
  [Types.GET_USER_SUMMARY_FAILURE]: getUserSummaryFailure,
  [Types.GET_USER_AUDIENCES_SUCCESS]: getUserAudiencesSuccess,
  [Types.POST_USER_PROFILE_IMAGE]: postUserProfileImage,
  [Types.POST_USER_PROFILE_IMAGE_SUCCESS]: postUserProfileImageSuccess,
  [Types.POST_USER_PROFILE_IMAGE_FAILURE]: postUserProfileImageFailure,
  [Types.GET_POINTS_SUCCESS]: getPointsSuccess,
  [Types.GET_LEADERBOARDS_SUCCESS]: getLeaderboardsSuccess,
  [Types.GET_CHEIL_SUMMARY_SUCCESS]: getCheilSummarySuccess,
  [Types.GET_WEEKLY_ACTIVATIONS_SUCCESS]: getWeeklyActivationsSuccess,
  [Types.SAVE]: save,
  [Types.UPDATE_USER_ID]: updateUserId,
  [Types.SHOW_HIDE_CHANGING_AFFILIATION_CODE_SUCCESS_DIALOG]: showHideChangingAffiliationCodeSuccessDialog,
  [Types.GET_ORGANIZATION_DETAIL_SUCCESS]: getOrganizationDetailSuccess,
  [Types.GET_BANNERS]: getBanners,
  [Types.GET_BANNERS_SUCCESS]: getBannersSuccess,
  [Types.GET_BANNERS_FAILURE]: getBannersFailure,
  [Types.CHECK_EXISTS_SUCCESS]: checkExistsSuccess,
  [Types.UPDATE_USER_SUMMARY]: updateUserSummary,
  [Types.UPDATE_USER_SUMMARY_SUCCESS]: updateUserSummarySuccess,
  [Types.UPDATE_USER_SUMMARY_FAILURE]: updateUserSummaryFailure,
  [Types.SEND_FEEDBACK_FORM_REQUEST]: sendFeedbackFormRequest,
  [Types.SEND_FEEDBACK_FORM_REQUEST_SUCCESS]: sendFeedbackFormRequestSuccess,
  [Types.SEND_FEEDBACK_FORM_REQUEST_FAILURE]: sendFeedbackFormRequestFailure,
  [Types.GET_TERMS_CONDITIONS]: getTermsConditions,
  [Types.GET_TERMS_CONDITIONS_SUCCESS]: getTermsConditionsSuccess,
  [Types.CHECK_TERMS_CONDITIONS_SUCCESS]: checkTermsConditionsSuccess,
  [Types.HAS_NEW_TERMS_CONDITIONS]: hasNewTermsConditions,
  [Types.ACCEPTED_NEW_TERMS_CONDITIONS]: acceptedNewTermsConditions,
  [Types.VERIFY_OTP]: verifyOTP,
  [Types.VERIFY_OTP_SUCCESS]: verifyOTPSuccess,
  [Types.VERIFY_OTP_FAILURE]: verifyOTPFailure,
  [Types.UPDATE_PASSWORD]: updatePassword,
  [Types.UPDATE_PASSWORD_SUCCESS]: updatePasswordSuccess,
  [Types.UPDATE_PASSWORD_FAILURE]: updatePasswordFailure,
  [Types.GET_GAMIFICATION_OVERVIEW_SUCCESS]: getGamificationOverviewSuccess,
  [Types.GET_USERS_SUCCESS]: getUsersSuccess,
  [Types.GET_USERS_FAILURE]: getUsersFailure,
  [Types.GET_ACTIVITIES_SUCCESS]: getActivitiesSuccess,
  [Types.GET_TRANSACTION_HISTORY_SUCCESS]: getTransactionHistorySuccess,
  [Types.GET_TRANSACTION_HISTORY_FAILURE]: getTransactionHistoryFailure,
  [Types.GET_SALES_TRACKING_SUCCESS]: getSalesTrackingSuccess,
  [Types.SIGN_OUT]: signOut,
  [Types.GET_IMEI_STATUS]: getIMEIStatus,
  [Types.GET_IMEI_STATUS_SUCCESS]: getIMEIStatusSuccess,
  [Types.GET_IMEI_STATUS_FAILURE]: getIMEIStatusFailure,
  [Types.GET_ADVOCATE_INFO]: getAdvocateInfo,
  [Types.GET_ADVOCATE_INFO_SUCCESS]: getAdvocateInfoSuccess,
  [Types.GET_ADVOCATE_INFO_FAILURE]: getAdvocateInfoFailure,
  [Types.GET_ADVOCATE_DEVICES]: getAdvocateDevices,
  [Types.GET_ADVOCATE_DEVICES_SUCCESS]: getAdvocateDevicesSuccess,
  [Types.GET_ADVOCATE_DEVICES_FAILURE]: getAdvocateDevicesFailure,
  [Types.GET_ADVOCATE_DEVICE_HISTORY]: getAdvocateDeviceHistory,
  [Types.GET_ADVOCATE_DEVICE_HISTORY_SUCCESS]: getAdvocateDeviceHistorySuccess,
  [Types.GET_ADVOCATE_DEVICE_HISTORY_FAILURE]: getAdvocateDeviceHistoryFailure,
  [Types.UPDATE_ADVOCATE_STATUS]: updateAdvocateStatus,
  [Types.UPDATE_ADVOCATE_STATUS_SUCCESS]: updateAdvocateStatusSuccess,
  [Types.UPDATE_ADVOCATE_STATUS_FAILURE]: updateAdvocateStatusFailure,
  [Types.GET_INITIATIVES]: getInitiatives,
  [Types.GET_INITIATIVES_SUCCESS]: getInitiativesSuccess,
  [Types.GET_INITIATIVES_FAILURE]: getInitiativesFailure,
  [Types.GET_SALES_TRACKING]: getSalesTracking,
  [Types.GET_SALES_TRACKING_FAILURE]: getSalesTrackingFailure,
  [Types.GET_SALES_TRACKING_CAMPAIGN]: getSalesTrackingCampaign,
  [Types.GET_SALES_TRACKING_CAMPAIGN_SUCCESS]: getSalesTrackingCampaignSuccess,
  [Types.GET_SALES_TRACKING_CAMPAIGN_FAILURE]: getSalesTrackingCampaignFailure,
  [Types.GET_CHANNELS_SUCCESS]: getChannelsSuccess,
  [Types.GET_CHANNEL]: getChannel,
  [Types.GET_CHANNEL_SUCCESS]: getChannelSuccess,
  [Types.GET_CHANNEL_FAILURE]: getChannelFailure,
  [Types.DEFAULT_VIEW]: signOut,
  [Types.GET_ACCESS_TOKEN_SUCCESS]: resetUserInfo,
})
