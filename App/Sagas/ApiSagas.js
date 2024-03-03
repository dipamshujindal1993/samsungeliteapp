import {
  Platform,
  NativeModules,
} from 'react-native'
import {
  all,
  call,
  put,
  retry,
  select,
} from 'redux-saga/effects'
import qs from 'querystringify'
import firebase from 'react-native-firebase'
import DeviceInfo from 'react-native-device-info'

import { RemoteConfigSelectors } from '@redux/RemoteConfigRedux'
import AppActions, { AppSelectors } from '@redux/AppRedux'
import ActivitiesActions from '@redux/ActivitiesRedux'
import AssessmentsActions from '@redux/AssessmentsRedux'
import NavigationActions from '@redux/NavigationRedux'
import UserActions, { UserSelectors } from '@redux/UserRedux'
import RewardsActions from '@redux/RewardsRedux'
import CommunitiesActions from '@redux/CommunitiesRedux'
import NotificationsActions, { NotificationsSelectors } from '@redux/NotificationsRedux'
import SearchActions from '@redux/SearchRedux'
import LeadsActions from '@redux/LeadsRedux'
import I18n from '@i18n'

import {
  btoa,
  getTabs,
  isFeatureSupported,
} from '@utils/CommonUtils'
import { Constants } from '@resources'

const selectTokenType = AppSelectors.getTokenType
const selectAccessToken = AppSelectors.getAccessToken

function* onError(response, action) {
  if (response.status == 401) {
    const apiConfig = yield select(RemoteConfigSelectors.apiConfig)
    if (apiConfig.sign_out_on_error) {
      yield put(AppActions.signOut())
    }
  } else if (response.status == 503) {
    yield put(NavigationActions.showMaintenance())
  } else if (action) {
    yield put(action)
  }
}

function getErrorMessage(response) {
  if (!response || !response.data) {
    return I18n.t('generic_error.message')
  }

  if (response.data.message) {
    return response.data.message
  }
  if (response.data.error) {
    return response.data.error
  }
  const validationMessages = response.data.validationMessages || (response.data.ServerError && response.data.ServerError.info && response.data.ServerError.info.validationMessages)
  if (typeof validationMessages == 'object' && validationMessages.length > 0) {
    return validationMessages[0].errorMessage
  }
  if (response.data.ServerError) {
    if (response.data.ServerError.info) {
      return response.data.ServerError.info.error
    } else if (response.data.ServerError.message) {
      return response.data.ServerError.message
    }
  }
  return I18n.t('generic_error.message')
}

function* callApi(apiRequest, params, headers) {
  const response = yield call(apiRequest, params, headers)
  if (response.status == 500 || response.status == 504) {
    throw response
  }
  return response
}

function* retrySaga(apiRequest, params, headers) {
  try {
    return yield retry(yield select(RemoteConfigSelectors.retryCount), 0, callApi, apiRequest, params, headers)
  } catch (response) {
    return response
  }
}

export function* getAccessToken(seaApi, stApi, action) {
  const { grantType, code } = action
  var data = {
    'grant_type': grantType,
  }
  var headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  var fn = stApi.getAccessToken
  const apiConfig = yield select(RemoteConfigSelectors.apiConfig)
  switch (grantType) {
    case Constants.GRANT_TYPE.AUTHORIZATION_CODE:
      headers = Object.assign(headers, {
        'Authorization': `Basic ${btoa(`${apiConfig.st_client_id_authorization_code}:${apiConfig.st_client_secret}`)}`,
      })
      data = Object.assign(data, {
        'code': code,
        'redirect_uri': apiConfig.st_redirect_uri,
      })
      break

    case Constants.GRANT_TYPE.CLIENT_CREDENTIALS:
      headers = Object.assign(headers, {
        'Authorization': `Basic ${btoa(`${apiConfig.st_client_id_client_credentials}:${apiConfig.st_client_secret}`)}`,
      })
      break

    case Constants.GRANT_TYPE.PASSWORD:
      const { email, password } = action
      const { RSA } = NativeModules
      const encryptedPassword = yield call(RSA.encrypt, yield select(RemoteConfigSelectors.encryptionKey), password)
      if (apiConfig.use_proxy) {
        fn = seaApi.getAccessToken
        data = {
          'username': email,
          'password': Platform.OS === 'ios' ? encryptedPassword : encryptedPassword.encrypted,
          // 'scope': apiConfig.st_scopes,
        }
      } else {
        data = Object.assign(data, {
          'username': email,
          'password': Platform.OS === 'ios' ? encryptedPassword : encryptedPassword.encrypted,
          // 'scope': apiConfig.st_scopes,
        })
        headers = Object.assign(headers, {
          'Authorization': `Basic ${btoa(`${apiConfig.st_client_id_password}:${apiConfig.st_client_secret}`)}`,
        })
      }
      break

    case Constants.GRANT_TYPE.REFRESH_TOKEN:
      if (apiConfig.use_proxy) {
        fn = seaApi.refreshToken
        data = {
          'refresh_token': yield select(AppSelectors.getRefreshToken),
        }
      } else {
        headers = Object.assign(headers, {
          'Authorization': `Basic ${btoa(`${apiConfig.st_client_id_password}:${apiConfig.st_client_secret}`)}`,
        })
        data = Object.assign(data, {
          'refresh_token': yield select(AppSelectors.getRefreshToken),
        })
      }
      break
  }
  const response = yield call(retrySaga, fn, qs.stringify(data), headers)
  if (response.ok) {
    const {
      access_token,
      expires_in,
      token_type,
      refresh_token,
      scope,
      user_id,
    } = response.data
    if (user_id) {
      yield put(UserActions.updateUserId(user_id))
    }
    yield put(AppActions.getAccessTokenSuccess(grantType, access_token, expires_in, token_type, refresh_token, scope))
  } else {
    yield call(onError, response, AppActions.getAccessTokenFailure(getErrorMessage(response)))
  }
}

function* getUserAudiences(api, action) {
  const {
    userId,
    limit,
  } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const userAudiences = yield call(retrySaga, api.getUserAudiences, { userId, limit }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (userAudiences.ok) {
    const { pagination } = userAudiences.data
    if (pagination.limit < pagination.total) {
      return yield call(getUserAudiences, api, { limit: pagination.total })
    } else {
      return userAudiences
    }
  } else {
    yield call(onError, userAudiences)
  }
}

export function* loadHomeScreen(api) {
  const userAudiences = yield call(getUserAudiences, api, {})
  yield put(UserActions.getUserAudiencesSuccess(userAudiences ? userAudiences.data : undefined))

  const audiences = userAudiences ? userAudiences.data.data : undefined
  var [homeTabs, learnTabs] = yield all([
    call(getTabs, Constants.HOME_TABS, yield select(RemoteConfigSelectors.homeTabs), audiences),
    call(getTabs, Constants.LEARN_TABS, yield select(RemoteConfigSelectors.learnTabs), audiences),
  ])

  yield all([
    put(NavigationActions.loadHomeScreenSuccess(homeTabs, learnTabs)),
    put(UserActions.getUserSummary()),
  ])
}

export function* getStores(api, action) {
  const {
    orgdomainInd,
    zip,
    affiliationCode,
    limit,
  } = action
  var headers = undefined
  const apiConfig = yield select(RemoteConfigSelectors.apiConfig)
  if (!apiConfig.use_proxy) {
    const [tokenType, accessToken] = yield all([
      select(selectTokenType, Constants.GRANT_TYPE.CLIENT_CREDENTIALS),
      select(selectAccessToken, Constants.GRANT_TYPE.CLIENT_CREDENTIALS),
    ])
    headers = {
      'Authorization': `${tokenType} ${accessToken}`,
    }
  }

  const stores = yield call(retrySaga, api.getStores, { orgdomainInd, zip, affiliationCode, limit }, headers)
  if (stores.ok) {
    const { pagination } = stores.data
    if (pagination.limit < pagination.total) {
      yield call(getStores, api, { limit: pagination.total })
    } else {
      if (orgdomainInd == 1) {
        yield put(UserActions.getDomainsSuccess(stores.data))
      } else {
        yield put(UserActions.getStoresSuccess(stores.data))
      }
    }
  } else {
    yield call(onError, stores)
  }
}

export function* getRoles(api, action) {
  const { limit } = action
  const [apiConfig, domainId] = yield all([
    select(RemoteConfigSelectors.apiConfig),
    select(RemoteConfigSelectors.samsungDomainId),
  ])
  var headers = undefined
  if (!apiConfig.use_proxy) {
    const [tokenType, accessToken] = yield all([
      select(selectTokenType, Constants.GRANT_TYPE.CLIENT_CREDENTIALS),
      select(selectAccessToken, Constants.GRANT_TYPE.CLIENT_CREDENTIALS),
    ])
    headers = {
      'Authorization': `${tokenType} ${accessToken}`,
    }
  }
  const roles = yield call(retrySaga, api.getRoles, { domainId, limit }, headers)
  if (roles.ok) {
    const { pagination } = roles.data
    if (pagination.limit < pagination.total) {
      yield call(getRoles, api, { limit: pagination.total })
    } else {
      yield put(UserActions.getRolesSuccess(roles.data))
    }
  } else {
    yield call(onError, roles)
  }
}

export function* signUp(seaApi, stApi, action) {
  var headers = {
    'Content-Type': 'application/json',
  }

  const domains = yield select(UserSelectors.getDomains)

  const { userInfo } = action
  var body = {}
  body.firstName = userInfo.firstName
  body.lastName = userInfo.lastName
  body.birthDate = userInfo.dob

  var businessAddress = {}
  businessAddress.mobile = userInfo.phone
  body.businessAddress = businessAddress

  if (domains && domains.data && domains.data.length > 0) {
    body.personDomain = []
    var personDomain = {}
    personDomain.domainId = domains.data[0].organizationId
    personDomain.isPrimary = true
    body.personDomain.push(personDomain)
  }

  body.personOrganization = []
  var personOrganization = {}
  personOrganization.organizationId = userInfo.organizationId
  personOrganization.isPrimary = true
  body.personOrganization.push(personOrganization)

  body.personJob = []
  var personJob = {}
  personJob.jobTemplateId = userInfo.jobTemplateId
  personJob.isPrimary = true
  body.personJob.push(personJob)

  var personOptional = {}
  personOptional.text2 = userInfo.tncHash
  personOptional.text4 = userInfo.referralCode
  body.push_opt_in = userInfo.optedInPushNotifications
  body.email_opt_in = userInfo.optedInEmailPromotions
  body.personOptional = personOptional

  var personMobileUser = {}
  personMobileUser.isMobileEnabled = true
  body.personMobileUser = personMobileUser

  var userLogin = {}
  userLogin.username = userInfo.emailAddress
  userLogin.userPassword = userInfo.password
  body.userLogin = userLogin

  var fn = stApi.signUp
  const apiConfig = yield select(RemoteConfigSelectors.apiConfig)
  if (apiConfig.use_proxy) {
    fn = seaApi.signUp
  } else {
    const [tokenType, accessToken] = yield all([
      select(selectTokenType, Constants.GRANT_TYPE.CLIENT_CREDENTIALS),
      select(selectAccessToken, Constants.GRANT_TYPE.CLIENT_CREDENTIALS),
    ])
    headers = Object.assign(headers, {
      'Authorization': `${tokenType} ${accessToken}`,
    })
  }

  const response = yield call(retrySaga, fn, body, headers)
  if (response.ok) {
    yield put(UserActions.signUpSuccess(response.data.userId))
  } else {
    yield call(onError, response, UserActions.signUpFailure(getErrorMessage(response)))
  }
}

export function* refreshAudiences(api, action) {
  const { userId } = action
  var headers = undefined
  const apiConfig = yield select(RemoteConfigSelectors.apiConfig)
  if (!apiConfig.use_proxy) {
    const [tokenType, accessToken] = yield all([
      select(selectTokenType, Constants.GRANT_TYPE.CLIENT_CREDENTIALS),
      select(selectAccessToken, Constants.GRANT_TYPE.CLIENT_CREDENTIALS),
    ])
    headers = {
      'Authorization': `${tokenType} ${accessToken}`,
    }
  }
  const response = yield call(retrySaga, api.refreshAudiences, { userId }, headers)
  if (response.ok) {
    yield put(UserActions.refreshAudiencesSuccess())
  } else {
    yield call(onError, response, UserActions.refreshAudiencesFailure())
  }
}

export function* getUserSummary(seaApi, stApi) {
  const [apiConfig, userId, tokenType, accessToken] = yield all([
    select(RemoteConfigSelectors.apiConfig),
    select(UserSelectors.getUserId),
    select(selectTokenType),
    select(selectAccessToken),
  ])

  var fn = stApi.getUserSummary
  if (apiConfig.use_proxy) {
    fn = seaApi.getUserSummary
  }

  const userSummary = yield call(retrySaga, fn, { userId }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (userSummary.ok) {
    yield all([
      put(NotificationsActions.getUnreadCount(userSummary.data.userId)),
      put(NotificationsActions.getSpotReward(userSummary.data.userId)),
      put(UserActions.getUserSummarySuccess(userSummary.data)),
      put(UserActions.checkTermsConditions())
    ])
  } else {
    yield call(onError, userSummary, UserActions.getUserSummaryFailure())
  }
}

export function* checkTermsConditions(api) {
  const primaryDomainCode = yield select(UserSelectors.getPrimaryDomainCode)
  if (primaryDomainCode) {
    const response = yield call(api.getTnc, { org_code: primaryDomainCode })
    if (response.ok && response.data) {
      const tncList = response.data.list
      if (tncList && tncList.length > 0) {
        const tnc = tncList.find(attestation => attestation.description == Constants.TERMS_CONDITIONS)
        if (tnc) {
          yield put(UserActions.checkTermsConditionsSuccess(tnc))
          const currentHash = yield select(UserSelectors.getTncHash)
          if (currentHash != tnc.hash) {
            yield put(UserActions.hasNewTermsConditions())
          }
        }
      }
    }
  }
}

export function* getTermsConditions(api, action) {
  const { org_code } = action
  const response = yield call(retrySaga, api.getTnc, { org_code })
  var tnc = undefined
  if (response.ok && response.data) {
    const tncList = response.data.list
    if (tncList && tncList.length > 0) {
      tnc = tncList.find(attestation => attestation.description == Constants.TERMS_CONDITIONS)
    }
  }
  yield put(UserActions.getTermsConditionsSuccess(tnc))
}

export function* checkExists(api, action) {
  const { username } = action
  const response = yield call(retrySaga, api.checkExists, { username })
  if (response.ok) {
    yield put(UserActions.checkExistsSuccess(response.data.exists))
  }
}

export function* updateUserSummary(seaApi, stApi, action) {
  const [apiConfig, tokenType, accessToken, userId] = yield all([
    select(RemoteConfigSelectors.apiConfig),
    select(selectTokenType),
    select(selectAccessToken),
    select(UserSelectors.getUserId),
  ])
  var fn = stApi.updateUserSummary
  if (apiConfig.use_proxy) {
    fn = seaApi.updateUserSummary
  }
  const userSummary = yield call(retrySaga, fn, { userId, body: action.userInfo }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (userSummary.ok) {
    yield put(UserActions.updateUserSummarySuccess(userSummary.data))
  } else {
    yield call(onError, userSummary, UserActions.updateUserSummaryFailure())
  }
}
export function* postUserProfileImage(api, action) {
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const formData = new FormData();
  formData.append('image', action.file);
  const response = yield call(retrySaga, api.postUserProfileImage, formData, {
    'Authorization': `${tokenType} ${accessToken}`,
    'Content-Type': 'multipart/form-data',
  })
  if (response.ok) {
    yield put(UserActions.postUserProfileImageSuccess(response.data))
  } else {
    yield call(onError, response, UserActions.postUserProfileImageFailure())
  }
}

export function* getRewards(api, action) {
  const { page } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])

  const rewards = yield call(retrySaga, api.getRewards, { page }, {
    'Request-Id': btoa(yield select(UserSelectors.getUserId)),
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (rewards.ok) {
    yield put(RewardsActions.getRewardsSuccess(rewards.data))
  } else {
    yield call(onError, rewards)
  }
}

export function* getPoints(api) {
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const points = yield call(retrySaga, api.getPoints, {
    'Request-Id': btoa(yield select(UserSelectors.getUserId)),
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (points.ok) {
    yield put(UserActions.getPointsSuccess(points.data))
  } else {
    yield call(onError, points)
  }
}

export function* getRewardDetailById(api, action) {
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const { rewardId } = action
  const rewardDetail = yield call(retrySaga, api.getRewardDetailById, { rewardId }, {
    'Request-Id': btoa(yield select(UserSelectors.getUserId)),
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (rewardDetail.ok) {
    yield put(RewardsActions.getRewardDetailSuccess(rewardDetail.data))
  } else {
    yield put(RewardsActions.getRewardDetailFailure(rewardId))
    yield call(onError, rewardDetail)
  }
}

export function* postRewardParticipation(api, action) {
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const { rewardId, quantity } = action
  const participationResult = yield call(retrySaga, api.postRewardParticipation, { rewardId, quantity }, {
    'Request-Id': btoa(yield select(UserSelectors.getUserId)),
    'Content-Type': 'application/json',
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (participationResult.ok) {
    yield put(RewardsActions.getRewardParticipationResultSuccess(participationResult.data))
  } else {
    yield call(onError, participationResult, RewardsActions.getRewardParticipationResultFailure())
  }
}

export function* getCourses(api, action) {
  const { activityType, pageNumber, pageSize } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  let params = {
    sortColumns: 3, // StartDate
    sortDirection: 0, // Descending
    pageNumber,
    pageSize,
  }

  switch (activityType) {
    case Constants.ACTIVITIES:
      params.modalityFilter = Constants.MODALITY_FILTERS.ACTIVITY
      break

    case Constants.ACTIVITY_TYPES.SIMPLIFIED_CURRICULUM:
      params.modalityFilter = Constants.MODALITY_FILTERS.COURSES
      break

    default:
      params.activityType = activityType
      break
  }

  const courses = yield call(retrySaga, api.getCourses, params, {
    'Authorization': `${tokenType} ${accessToken}`,
  })

  if (courses.ok) {
    yield put(ActivitiesActions.getCoursesSuccess(courses.data, activityType))
  } else {
    yield call(onError, courses, ActivitiesActions.getCoursesFailure(activityType))
  }
}

export function* getCourseModules(api, action) {
  const { activityId } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const courseModules = yield call(retrySaga, api.getCourseModules, { activityId }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })

  if (courseModules.ok) {
    yield put(ActivitiesActions.getCourseModulesSuccess(courseModules.data, activityId))
  } else {
    yield call(onError, courseModules, ActivitiesActions.getCourseModulesFailure())
  }
}

export function* getSubTopics(api, action) {
  const { topicId, topicType, activityCount, pageNumber } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const topics = yield call(retrySaga, api.getSubTopics, { topicId, activityCount, pageNumber }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })

  if (topics.ok) {
    yield put(ActivitiesActions.getSubTopicsSuccess(topics.data, topicType))
  } else {
    yield call(onError, topics, ActivitiesActions.getSubTopicsFailure(topicType))
  }
}

export function* getTopicActivities(api, action) {
  const { topicId, pageLimit, pageNumber } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const topicActivities = yield call(retrySaga, api.getTopicActivities, { topicId, pageLimit, pageNumber }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })

  if (topicActivities.ok) {
    yield put(ActivitiesActions.getTopicActivitiesSuccess(topicActivities.data))
  } else {
    yield call(onError, topicActivities, ActivitiesActions.getTopicActivitiesFailure())
  }
}

export function* getActivity(api, action) {
  const { activityId } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const activityDetail = yield call(retrySaga, api.getActivity, { activityId }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })

  if (activityDetail.ok) {
    let detail = activityDetail.data ? activityDetail.data : null;
    yield put(ActivitiesActions.getActivitySuccess(detail))
  } else {
    yield call(onError, activityDetail, ActivitiesActions.getActivityFailure(activityId))
  }
}

export function* getActivityDetail(api, action) {
  const { activityId } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const response = yield call(retrySaga, api.getActivity, { activityId }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })

  if (response.ok) {
    let activityDetail = response.data ? response.data : null;
    yield put(ActivitiesActions.getActivityDetailSuccess(activityDetail))
  } else {
    yield call(onError, response, ActivitiesActions.getActivityDetailFailure())
  }
}

export function* getLeaderboards(api, action) {
  const { myRepsLeaderboards, period, pageNumber, filter, filterId } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const leaderboards = yield call(retrySaga, api.getLeaderboards, { period, pageNumber, filter, filterId }, {
    'Request-Id': btoa(yield select(UserSelectors.getUserId)),
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (leaderboards.ok) {
    yield put(UserActions.getLeaderboardsSuccess(myRepsLeaderboards, leaderboards.data))
  } else {
    yield call(onError, leaderboards)
  }
}

export function* getActivityChild(api, action) {
  const { activityId } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const activityChild = yield call(retrySaga, api.getActivityChild, { activityId }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (activityChild.ok) {
    let childActivities = activityChild.data ? activityChild.data.childActivities : null;
    yield put(ActivitiesActions.getActivityChildSuccess(activityId, childActivities))
  } else {
    yield call(onError, activityChild)
  }
}

export function* registerActivity(api, action) {
  const { activityId, userId } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const registerActivity = yield call(retrySaga, api.registerActivity, { activityId, userId }, {
    'Authorization': `${tokenType} ${accessToken}`,
    'Content-Type': 'application/json',
  })
  if (registerActivity.ok) {
    yield put(ActivitiesActions.registerActivitySuccess(activityId))
  } else {
    yield call(onError, registerActivity, ActivitiesActions.registerActivityFailure(activityId))
  }
}

export function* completeActivity(api, action) {
  const { activityId, status, parentActivityId, elapsedSeconds } = action
  var requestBody = {}
  requestBody.status = status
  requestBody.date = new Date().toISOString()
  if (elapsedSeconds) {
    requestBody.elapsedSeconds = elapsedSeconds
  }

  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const completeActivity = yield call(retrySaga, api.completeActivity, { activityId, requestBody }, {
    'Authorization': `${tokenType} ${accessToken}`,
    'Content-Type': 'application/json',
  })
  if (completeActivity.ok) {
    completeActivity.data.isCompleted = true
    yield put(ActivitiesActions.completeActivitySuccess(activityId, completeActivity.data, parentActivityId, elapsedSeconds))
  } else {
    let completedData = {
      isCompleted: false
    }
    yield call(onError, completeActivity, ActivitiesActions.completeActivityFailure(activityId, completedData, parentActivityId))
  }
}

export function* postPoints(api, action) {
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const {
    referenceId,
    point,
    category,
    reason,
    subCategory,
  } = action
  var body = {}
  body.category = category
  body.subCategory = subCategory
  body.referenceId = referenceId
  body.point = point
  body.reason = reason

  const points = yield call(retrySaga, api.postPoints, body, {
    'Request-Id': btoa(yield select(UserSelectors.getUserId)),
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (points.ok) {
    yield all([
      put(UserActions.getCheilSummary()),
      put(UserActions.getPoints()),
    ])
  } else {
    yield call(onError, points)
  }
}

export function* postActivity(api, action) {
  const { category, subCategory, availableDate } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  var body = {}
  body.category = category
  body.subCategory = subCategory
  body.availableDate = availableDate

  const postActivityResponse = yield call(retrySaga, api.postActivity, body, {
    'Request-Id': btoa(yield select(UserSelectors.getUserId)),
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (postActivityResponse.ok) {
    yield put(UserActions.getActivities())
  } else {
    yield call(onError, postActivityResponse)
  }
}

export function* getCommunities(api, action) {
  const { pageNumber } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const communities = yield call(retrySaga, api.getCommunities, { pageNumber }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })

  if (communities.ok) {
    yield put(CommunitiesActions.getCommunitiesSuccess(communities.data))
  } else {
    yield call(onError, communities, CommunitiesActions.getCommunitiesFailure())
  }
}

export function* getCommunityPost(api, action) {
  const { communityId, pageNumber } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const communityPost = yield call(retrySaga, api.getCommunityPost, { communityId, pageNumber }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })

  if (communityPost.ok) {
    yield put(CommunitiesActions.getCommunityPostSuccess(communityPost.data))
  } else {
    yield call(onError, communityPost, CommunitiesActions.getCommunityPostFailure())
  }
}

export function* getCheilSummary(api) {
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const cheilSummary = yield call(retrySaga, api.getCheilSummary, {
    'Request-Id': btoa(yield select(UserSelectors.getUserId)),
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (cheilSummary.ok) {
    yield put(UserActions.getCheilSummarySuccess(cheilSummary.data))
  } else {
    yield call(onError, cheilSummary)
  }
}

export function* getWeeklyActivations(api) {
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const activations = yield call(retrySaga, api.getWeeklyActivations, {
    'Request-Id': btoa(yield select(UserSelectors.getUserId)),
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (activations.ok) {
    yield put(UserActions.getWeeklyActivationsSuccess(activations.data))
  } else {
    yield call(onError, activations)
  }
}

export function* getOrganizationDetail(api, action) {
  const { organizationId } = action
  var headers = undefined
  const apiConfig = yield select(RemoteConfigSelectors.apiConfig)
  if (!apiConfig.use_proxy) {
    const [tokenType, accessToken] = yield all([
      select(selectTokenType, Constants.GRANT_TYPE.CLIENT_CREDENTIALS),
      select(selectAccessToken, Constants.GRANT_TYPE.CLIENT_CREDENTIALS),
    ])
    headers = {
      'Authorization': `${tokenType} ${accessToken}`,
    }
  }
  const organizationDetail = yield call(retrySaga, api.getOrganizationDetail, { organizationId }, headers)

  if (organizationDetail.ok) {
    yield put(UserActions.getOrganizationDetailSuccess(organizationDetail.data.data[0]))
  } else {
    yield call(onError, organizationDetail)
  }
}

export function* getBanners(api, action) {
  const { pageNumber } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const banners = yield call(retrySaga, api.getBanners, { pageNumber }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (banners.ok) {
    yield put(UserActions.getBannersSuccess(banners.data))
  } else {
    yield call(onError, banners, UserActions.getBannersFailure())
  }
}

export function* createPost(api, action) {
  const { communityId, postData } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const createPost = yield call(retrySaga, api.createPost, { communityId, postData }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })

  if (createPost.ok) {
    yield put(CommunitiesActions.savePostSuccess())
  } else {
    yield call(onError, createPost, CommunitiesActions.savePostFailure())
  }
}

export function* getAssessmentQuestions(api, action) {
  const { assessmentId } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const questionId = yield call(retrySaga, api.getAssessmentQuestions, { assessmentId }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })

  if (questionId.ok) {
    yield put(AssessmentsActions.getAssessmentQuestionsSuccess(questionId.data))
  } else {
    yield call(onError, questionId, AssessmentsActions.getAssessmentQuestionsFailure())
  }
}


export function* getAssessmentQuestion(api, action) {
  const { assessmentId, questionId } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken)
  ])
  const question = yield call(retrySaga, api.getAssessmentQuestion, { assessmentId, questionId }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (question.ok) {
    yield put(AssessmentsActions.getAssessmentQuestionSuccess(question.data))
  } else {
    yield call(onError, question)
  }
}

export function* postAssessmentAnswer(api, action) {
  const { assessmentId, questionId, param } = action;
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken)
  ])
  const answer = yield call(retrySaga, api.postAssessmentAnswer, { assessmentId, questionId, param }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })

  if (answer.ok) {
    yield put(AssessmentsActions.postAssessmentAnswerSuccess(answer.data))
  } else {
    yield call(onError, answer, AssessmentsActions.postAssessmentAnswerFailure(getErrorMessage(answer)))
  }
}

export function* getAssessmentSummary(api, action) {
  const { assessmentId } = action;
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken)
  ])
  const result = yield call(retrySaga, api.getAssessmentSummary, { assessmentId }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })

  if (result.ok) {
    yield put(AssessmentsActions.getAssessmentSummarySuccess(result.data))
  } else {
    yield call(onError, result)
  }
}

export function* getGamificationOverview(api) {
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken)
  ])
  const result = yield call(retrySaga, api.getGamificationOverview, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (result.ok) {
    yield put(UserActions.getGamificationOverviewSuccess(result.data))
  } else {
    yield call(onError, result)
  }
}

export function* getPollSummary(api, action) {
  const { pollId } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken)
  ])
  const summary = yield call(retrySaga, api.getPollSummary, { pollId }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })

  if (summary.ok) {
    yield put(AssessmentsActions.getPollSummarySuccess(summary.data))
  } else {
    yield call(onError, summary, AssessmentsActions.getPollSummaryFailure(getErrorMessage(summary)))
  }
}

export function* getPostDetail(api, action) {
  const { discussionId } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const postDetail = yield call(retrySaga, api.getPostDetail, { discussionId }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (postDetail.ok) {
    yield put(CommunitiesActions.getPostDetailSuccess(postDetail.data))
  } else {
    yield call(onError, postDetail, CommunitiesActions.getPostDetailFailure())
  }
}

export function* getNotifications(api, action) {
  const { isTasks, pageNumber, userId } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const notifications = yield call(retrySaga, api.getNotifications, { isTasks, pageNumber, userId }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })

  if (notifications.ok) {
    yield put(NotificationsActions.getNotificationsSuccess(isTasks, notifications.data))
  } else {
    yield call(onError, notifications, NotificationsActions.getNotificationsFailure(isTasks))
  }
}

export function* clearNotifications(api, action) {
  const { isTasks, userId } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const result = yield call(retrySaga, api.clearNotifications, { isTasks, userId }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })

  if (result.ok) {
    yield all([
      put(NotificationsActions.clearNotificationsSuccess(isTasks)),
      put(NotificationsActions.getUnreadCount(userId))
    ])
  } else {
    yield call(onError, result)
  }
}

export function* getUnreadNotificationsCount(api, action) {
  const [audiences, tasks, notifications] = yield all([
    select(UserSelectors.audiences),
    select(RemoteConfigSelectors.tasks),
    select(RemoteConfigSelectors.notifications),
  ])
  const tasksEnabled = audiences && isFeatureSupported(tasks, audiences.data)
  const notificationsEnabled = audiences && isFeatureSupported(notifications, audiences.data)
  if (!tasksEnabled && !notificationsEnabled) {
    return
  }

  const { userId } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const result = yield call(retrySaga, api.getUnreadNotificationsCount, { userId }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (result.ok) {
    const { count } = result.data;
    yield put(NotificationsActions.getUnreadCountSuccess(count))
  } else {
    yield call(onError, result)
  }
}

export function* markNotificationAsRead(api, action) {
  const { id, userId } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const result = yield call(retrySaga, api.markNotificationAsRead, { id, userId }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })

  if (result.ok) {
    yield put(NotificationsActions.getUnreadCount(userId))
  } else {
    yield call(onError, result)
  }
}

export function* markNotificationsAsRead(api, action) {
  const { ids, userId } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])

  var body = {
    ids: ids
  }

  const result = yield call(retrySaga, api.markNotificationsAsRead, { userId, body }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (result.ok) {
    yield put(NotificationsActions.getUnreadCount(userId))
  } else {
    yield call(onError, result)
  }
}

export function* getTaskDetails(api, action) {
  const { isMission, initiativeId } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const result = yield call(retrySaga, api.getTaskDetails, { isMission, initiativeId }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })

  if (result.ok) {
    yield put(NotificationsActions.getTaskDetailsSuccess(isMission, result.data))
  } else {
    yield call(onError, result, NotificationsActions.getTaskDetailsFailure())
  }
}

export function* uploadTaskFile(api, action) {
  const { fileItemId, file, initiativeId, stepId, isMission } = action
  const formData = new FormData();
  formData.append('image', file);
  console.log(formData, file)
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])

  const response = yield call(retrySaga, api.uploadTaskFile, { fileItemId, formData }, {
    'Authorization': `${tokenType} ${accessToken}`,
    'Content-Type': 'multipart/form-data',
  })

  if (response.ok) {
    yield all([
      put(NotificationsActions.uploadTaskFileSuccess()),
      put(NotificationsActions.markTaskAsComplete(initiativeId, stepId, isMission))
    ])
  } else {
    yield call(onError, response, NotificationsActions.uploadTaskFileFailure())
  }
}

export function* markTaskAsComplete(api, action) {
  const { initiativeId, stepId, isMission } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])

  const response = yield call(retrySaga, api.markTaskAsComplete, { initiativeId, stepId }, {
    'Authorization': `${tokenType} ${accessToken}`,
    'Content-Type': 'multipart/form-data',
  })

  if (response.ok) {
    yield all([
      put(NotificationsActions.markTaskAsCompleteSuccess()),
      put(NotificationsActions.getTaskDetails(isMission, initiativeId))
    ])
  } else {
    yield call(onError, response, NotificationsActions.markTaskAsCompleteFailure())
  }
}

function hasMessagingPermission() {
  return firebase.messaging().hasPermission()
}

function requestMessagingPermission() {
  return firebase.messaging().requestPermission()
    .then(() => {
      // User has authorised
      return true
    })
    .catch(error => {
      // User has rejected permissions
    })
}

function getFCMToken() {
  return firebase.messaging().getToken()
}

function getSerialNumber() {
  return DeviceInfo.getSerialNumber()
}

function getManufacturer() {
  return DeviceInfo.getManufacturer()
}

export function* optInPushNotifications(api) {
  const optedInPushNotifications = yield select(NotificationsSelectors.optedInPushNotifications)
  if (optedInPushNotifications) {
    return
  }

  var fcmToken
  const hasPermission = yield call(hasMessagingPermission)
  if (hasPermission) {
    fcmToken = yield call(getFCMToken)
  } else {
    const permissionGranted = yield call(requestMessagingPermission)
    if (permissionGranted) {
      fcmToken = yield call(getFCMToken)
    }
  }

  if (fcmToken) {
    console.log('FCM token:', fcmToken)

    const [serial, manufacturer] = yield all([
      call(getSerialNumber),
      call(getManufacturer),
    ])

    var body = {
      device_id: DeviceInfo.getUniqueId(),
      fcm_id: fcmToken,
      os_version: DeviceInfo.getSystemVersion(),
      app_version: DeviceInfo.getVersion(),
      serial,
      manufacturer,
      platform: Platform.OS,
      model: DeviceInfo.getModel(),
    }

    const [userId, tokenType, accessToken] = yield all([
      select(UserSelectors.getUserId),
      select(selectTokenType),
      select(selectAccessToken),
    ])
    const response = yield call(retrySaga, api.registerDevice, { userId, body }, {
      'Authorization': `${tokenType} ${accessToken}`,
    })
    if (response.ok) {
      yield put(NotificationsActions.optInPushNotificationsSuccess())
    } else {
      yield call(onError, response)
    }
  }
}

export function* optOutPushNotifications(api) {
  const optedInPushNotifications = yield select(NotificationsSelectors.optedInPushNotifications)
  if (!optedInPushNotifications) {
    return
  }
  const [userId, tokenType, accessToken] = yield all([
    select(UserSelectors.getUserId),
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const response = yield call(retrySaga, api.deleteDevice, { userId, deviceId: DeviceInfo.getUniqueId() }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (response.ok) {
    yield put(NotificationsActions.optOutPushNotificationsSuccess())
  } else {
    yield call(onError, response)
  }
}

export function* updateDevice(api, action) {
  const { device } = action
  const [userId, tokenType, accessToken] = yield all([
    select(UserSelectors.getUserId),
    select(selectTokenType),
    select(selectAccessToken),
  ])
  yield call(retrySaga, api.updateDevice, { userId, deviceId: DeviceInfo.getUniqueId(), device }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
}

export function* requestOTP(api, action) {
  const { email } = action
  const result = yield call(retrySaga, api.requestOTP, { email }, {
    'Content-Type': 'application/json',
  })
  if (!result.ok) {
    yield call(onError, result)
  }
}

export function* verifyOTP(api, action) {
  const { email, otp } = action
  const result = yield call(retrySaga, api.verifyOTP, { email, otp }, {
    'Content-Type': 'application/json',
  })
  if (result.ok) {
    yield put(UserActions.verifyOTPSuccess(result.data))
  } else {
    yield call(onError, result, UserActions.verifyOTPFailure())
  }
}

export function* updatePassword(api, action) {
  const { otp, email, password } = action
  const body = {
    email,
    password,
  }
  const response = yield call(retrySaga, api.updatePassword, body, {
    'Authorization': `OTP ${otp}`,
    'Content-Type': 'application/json',
  })
  if (response.ok && response.data && response.data.success) {
    yield put(UserActions.updatePasswordSuccess())
  } else {
    yield call(onError, response, UserActions.updatePasswordFailure())
  }
}

export function* postSubmitAssessments(api, action) {
  const { assessmentId } = action

  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken)
  ])
  const answers = yield call(retrySaga, api.postSubmitAssessments, { assessmentId }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })

  if (answers.ok) {
    yield put(ActivitiesActions.removeActivity({ activityId: assessmentId }))
    yield put(AssessmentsActions.postSubmitAssessmentsSuccess())
  } else {
    yield call(onError, answers, AssessmentsActions.postSubmitAssessmentsFailure())
  }
}

export function* getSearchSuggestions(api, action) {
  const { searchTerm, context } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const searchSuggestions = yield call(retrySaga, api.getSearchSuggestions, { searchTerm, context }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })

  if (searchSuggestions.ok) {
    yield put(SearchActions.getSearchSuggestionsSuccess(searchSuggestions.data))
  } else {
    yield call(onError, searchSuggestions)
  }
}

export function* searchActivities(api, action) {
  const { tab, searchTerm, pageNumber } = action
  const [tokenType, accessToken, modalities] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
    select(RemoteConfigSelectors.modalities),
  ])
  var modality = undefined
  if (modalities) {
    switch (tab) {
      case Constants.TAB_COURSES:
        modality = modalities[Constants.MODALITY_FILTERS.COURSES]
        break

      case Constants.TAB_ACTIVITIES:
        modality = modalities[Constants.MODALITY_FILTERS.ACTIVITY]
        break

      case Constants.TAB_RESOURCES:
        modality = modalities[Constants.MODALITY_FILTERS.RESOURCE]
        break

      default:
        modality = modalities[Constants.MODALITY_FILTERS.ARTICLES]
        break
    }
  }
  const response = yield call(retrySaga, api.searchActivities, { modality, searchTerm, pageNumber }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (response.ok) {
    yield put(SearchActions.searchActivitiesSuccess(tab, response.data))
  } else {
    yield call(onError, response, SearchActions.searchActivitiesFailure(tab))
  }
}

export function* getSearchResult(api, action) {
  const { searchTerm, activityType } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const result = yield call(retrySaga, api.getSearchResult, { searchTerm, activityType }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })

  if (result.ok) {
    switch (activityType) {
      case Constants.SEARCH_TAB_TYPES.ARTICLES:
        yield put(SearchActions.getArticlesSearchedSuccess(result.data))
        break;
      case Constants.SEARCH_TAB_TYPES.COURSES:
        yield put(SearchActions.getCoursesSearchedSuccess(result.data))
        break;
      case Constants.SEARCH_TAB_TYPES.RESOURCES:
        yield put(SearchActions.getResourcesSearchedSuccess(result.data))
        break;
      case Constants.SEARCH_TAB_TYPES.ACTIVITIES:
        yield put(SearchActions.getActivitiesSearchedSuccess(result.data))
        break;
      default:
        break
    }
  } else {
    switch (activityType) {
      case Constants.SEARCH_TAB_TYPES.ARTICLES:
        yield call(onError, result, SearchActions.getArticlesSearchedFailure())
        break;
      case Constants.SEARCH_TAB_TYPES.COURSES:
        yield call(onError, result, SearchActions.getCoursesSearchedFailure())
        break;
      case Constants.SEARCH_TAB_TYPES.RESOURCES:
        yield call(onError, result, SearchActions.getResourcesSearchedFailure())
        break;
      case Constants.SEARCH_TAB_TYPES.ACTIVITIES:
        yield call(onError, result, SearchActions.getActivitiesSearchedFailure())
        break;
      default:
        break;
    }
  }
}

export function* uploadFile(api, action) {
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const formData = new FormData();
  formData.append('image', action.file);
  const { communityId, fileIndex, isThumb } = action

  const response = yield call(retrySaga, api.uploadFile, { communityId, formData }, {
    'Authorization': `${tokenType} ${accessToken}`,
    'Content-Type': 'multipart/form-data',
  })

  const responseData = {}
  responseData.fileIndex = fileIndex
  if (response.ok) {

    responseData.status = "success"
    responseData.fileType = action.file.type
    if (isThumb) {
      responseData.thumbnail = response.data
    }
    else {
      responseData.data = response.data
    }

    yield put(CommunitiesActions.uploadFileSuccess(responseData))
  } else {
    responseData.status = "fail"
    yield call(onError, response, CommunitiesActions.uploadFileFailure(responseData))
  }
}

export function* likeCommunityPost(api, action) {
  const { discussionId } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const likeCommunity = yield call(retrySaga, api.likeCommunityPost, { discussionId }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (likeCommunity.ok) {
    yield put(CommunitiesActions.likeCommunityPostSuccess(likeCommunity.data))
    yield put(CommunitiesActions.getPostDetail(discussionId))
  } else {
    yield call(onError, likeCommunity, CommunitiesActions.likeCommunityPostFailure())
  }
}

export function* unlikeCommunityPost(api, action) {
  const { discussionId } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const unlikeCommunity = yield call(retrySaga, api.unlikeCommunityPost, { discussionId }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (unlikeCommunity.ok) {
    yield put(CommunitiesActions.unlikeCommunityPostSuccess())
    yield put(CommunitiesActions.getPostDetail(discussionId))
  } else {
    yield call(onError, unlikeCommunity, CommunitiesActions.unlikeCommunityPostFailure())
  }
}

export function* getPostCommentList(api, action) {
  const { discussionId } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const postCommentList = yield call(retrySaga, api.getPostCommentList, { discussionId }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (postCommentList.ok) {
    yield put(CommunitiesActions.getPostCommentSuccess(postCommentList.data))
  } else {
    yield call(onError, postCommentList, CommunitiesActions.getPostCommentFailure())
  }
}


export function* likeCommunityCommentPost(api, action) {
  const { discussionId, replyId } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const likeComment = yield call(retrySaga, api.likeCommunityCommentPost, { replyId }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (likeComment.ok) {
    yield put(CommunitiesActions.likeCommunityCommentPostSuccess(likeComment.data))
    yield put(CommunitiesActions.getPostCommentList(discussionId))
  } else {
    yield call(onError, likeComment, CommunitiesActions.likeCommunityCommentPostFailure())
  }
}

export function* dislikeCommunityCommentPost(api, action) {
  const { discussionId, replyId } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const dislikeComment = yield call(retrySaga, api.dislikeCommunityCommentPost, { replyId }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (dislikeComment.ok) {
    yield put(CommunitiesActions.dislikeCommunityCommentPostSuccess())
    yield put(CommunitiesActions.getPostCommentList(discussionId))
  } else {
    yield call(onError, dislikeComment, CommunitiesActions.dislikeCommunityCommentPostFailure())
  }
}
export function* deletePost(api, action) {
  const { discussionId } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const deletePost = yield call(retrySaga, api.deletePost, { discussionId }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })

  if (deletePost.ok) {
    yield put(CommunitiesActions.deletePostSuccess())
  } else {
    yield call(onError, deletePost, CommunitiesActions.deletePostFailure())
  }
}

export function* updatePost(api, action) {
  const { discussionId, postData } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const updatePost = yield call(retrySaga, api.updatePost, { discussionId, postData }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })

  if (updatePost.ok) {
    yield put(CommunitiesActions.updatePostSuccess())
  } else {
    yield call(onError, updatePost, CommunitiesActions.updatePostFailure())
  }
}

export function* getUsers(api, action) {
  const { page, query } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const users = yield call(retrySaga, api.getUsers, { page, query }, {
    'Request-Id': btoa(yield select(UserSelectors.getUserId)),
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (users.ok && users.data && users.data.content) {
    yield put(UserActions.getUsersSuccess(users.data))
  } else {
    yield call(onError, users, UserActions.getUsersFailure())
  }
}

export function* getSpotRewards(api, action) {
  const { page } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const spotRewards = yield call(retrySaga, api.getSpotRewards, { page }, {
    'Request-Id': btoa(yield select(UserSelectors.getUserId)),
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (spotRewards.ok) {
    yield put(RewardsActions.getSpotRewardsSuccess(spotRewards.data))
  } else {
    yield call(onError, spotRewards, RewardsActions.getSpotRewardsFailure())
  }
}

export function* postSpotRewards(api, action) {
  const { spotRewardId, recipientId, comment } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const postSpotRewardsResult = yield call(retrySaga, api.postSpotRewards, { spotRewardId, recipientId, comment }, {
    'Request-Id': btoa(yield select(UserSelectors.getUserId)),
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (postSpotRewardsResult.ok) {
    yield put(RewardsActions.postSpotRewardsSuccess())
  } else {
    yield call(onError, postSpotRewardsResult, RewardsActions.postSpotRewardsFailure())
  }
}

export function* getTransactionHistory(api, action) {
  const { categoryName, categoryString, page } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const transactionHistory = yield call(retrySaga, api.getTransactionHistory, { category: categoryString, page }, {
    'Request-Id': btoa(yield select(UserSelectors.getUserId)),
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (transactionHistory.ok) {
    yield put(UserActions.getTransactionHistorySuccess(categoryName, transactionHistory.data))
  } else {
    yield call(onError, transactionHistory, UserActions.getTransactionHistoryFailure(categoryName))
  }
}

export function* addComment(api, action) {
  const { discussionId, postData } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const addComment = yield call(retrySaga, api.addComment, { discussionId, postData }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })

  if (addComment.ok) {
    yield put(CommunitiesActions.addCommentSuccess())
  } else {
    yield call(onError, addComment, CommunitiesActions.addCommentFailure())
  }
}

export function* updateComment(api, action) {
  const { replyId, postData } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const updateComment = yield call(retrySaga, api.updateComment, { replyId, postData }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })

  if (updateComment.ok) {
    yield put(CommunitiesActions.updateCommentSuccess())
  } else {
    yield call(onError, updateComment, CommunitiesActions.updateCommentFailure())
  }
}

export function* deleteComment(api, action) {
  const { replyId } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const deleteComment = yield call(retrySaga, api.deleteComment, { replyId }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })

  if (deleteComment.ok) {
    yield put(CommunitiesActions.deleteCommentSuccess())
  } else {
    yield call(onError, deleteComment, CommunitiesActions.deleteCommentFailure())
  }
}

export function* sendFeedbackFormRequest(api, action) {
  const { form, id } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const response = yield call(retrySaga, api.sendFeedbackFormRequest, { form, id }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (response.ok) {
    yield put(UserActions.sendFeedbackFormRequestSuccess())
  } else {
    yield call(onError, response, UserActions.sendFeedbackFormRequestFailure())
  }
}

export function* getActivities(api) {
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const activities = yield call(retrySaga, api.getActivities, {
    'Request-Id': btoa(yield select(UserSelectors.getUserId)),
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (activities.ok) {
    yield put(UserActions.getActivitiesSuccess(activities.data))
  } else {
    yield call(onError, activities)
  }
}

export function* getLearning(api, action) {
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const { learningType } = action
  var params = {
    sortColumns: 3, // StartDate
    sortDirection: 0, // Descending
  }
  switch (learningType) {
    case Constants.TAB_ACTIVITIES:
      params.modalityFilter = Constants.MODALITY_FILTERS.ACTIVITY
      break

    case Constants.TAB_COURSES:
      params.modalityFilter = Constants.MODALITY_FILTERS.COURSES
      break
  }
  const response = yield call(retrySaga, api.getCourses, params, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (response.ok) {
    yield put(ActivitiesActions.getLearningSuccess(response.data))
  } else {
    yield call(onError, response, ActivitiesActions.getLearningFailure())
  }
}

export function* getSalesTracking(api, action) {
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const { campaignId, filter, page, pageSize } = action
  const salesTracking = yield call(retrySaga, api.getSalesTracking, { campaignId, filter, page, pageSize }, {
    'Request-Id': btoa(yield select(UserSelectors.getUserId)),
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (salesTracking.ok) {
    yield put(UserActions.getSalesTrackingSuccess(salesTracking.data))
  } else {
    yield call(onError, salesTracking, UserActions.getSalesTrackingFailure())
  }
}

export function* getIMEIStatus(api, action) {
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const imeiStatus = yield call(retrySaga, api.getIMEIStatus, {
    'Request-Id': btoa(yield select(UserSelectors.getUserId)),
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (imeiStatus.ok) {
    yield put(UserActions.getIMEIStatusSuccess(imeiStatus.data))
  } else {
    yield call(onError, imeiStatus, UserActions.getIMEIStatusFailure())
  }
}

export function* getAdvocateInfo(api, action) {
  const { advocateId } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const advocate = yield call(retrySaga, api.getCheilSummary, {
    'Request-Id': btoa(advocateId),
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (advocate.ok) {
    yield put(UserActions.getAdvocateInfoSuccess(advocate.data))
  } else {
    yield call(onError, advocate, UserActions.getAdvocateInfoFailure())
  }
}

export function* getAdvocateDevices(api, action) {
  const { advocateId } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const devices = yield call(retrySaga, api.getAdvocateDevices, { advocateId }, {
    'Request-Id': btoa(yield select(UserSelectors.getUserId)),
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (devices.ok) {
    yield put(UserActions.getAdvocateDevicesSuccess(devices.data))
  } else {
    yield call(onError, devices, UserActions.getAdvocateDevicesFailure())
  }
}

export function* getAdvocateDeviceHistory(api, action) {
  const { advocateId, deviceId } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const history = yield call(retrySaga, api.getAdvocateDeviceHistory, { advocateId, deviceId }, {
    'Request-Id': btoa(yield select(UserSelectors.getUserId)),
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (history.ok) {
    yield put(UserActions.getAdvocateDeviceHistorySuccess(history.data))
  } else {
    yield call(onError, history, UserActions.getAdvocateDeviceHistoryFailure())
  }
}

export function* updateAdvocateStatus(api, action) {
  const { advocateId, deviceId, statusId, deviceImei } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const updateAdvocateStatusResult = yield call(retrySaga, api.updateAdvocateStatus, { advocateId, deviceId, statusId, deviceImei }, {
    'Request-Id': btoa(yield select(UserSelectors.getUserId)),
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (updateAdvocateStatusResult.ok) {
    yield put(UserActions.updateAdvocateStatusSuccess(updateAdvocateStatusResult))
  } else {
    yield call(onError, updateAdvocateStatusResult, UserActions.updateAdvocateStatusFailure(updateAdvocateStatusResult))
  }
}

export function* getInitiatives(api, action) {
  const { initiativeType, limit, offset } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const response = yield call(retrySaga, api.getInitiatives, { adminNotes: initiativeType, limit, offset }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (response.ok) {
    yield put(UserActions.getInitiativesSuccess(initiativeType, response.data))
  } else {
    yield call(onError, response, UserActions.getInitiativesFailure(initiativeType))
  }
}

export function* getSpotReward(api, action) {
  const { userId } = action
  const [tokenType, accessToken, from] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
    select(NotificationsSelectors.lastSpotRewardDisplayed)
  ])
  const rewards = yield call(retrySaga, api.getSpotReward, { userId, from }, {
    'Request-Id': btoa(yield select(UserSelectors.getUserId)),
    'Authorization': `${tokenType} ${accessToken}`,
  })

  if (rewards.ok) {
    yield put(NotificationsActions.getSpotRewardSuccess(rewards.data.results))
  } else {
    yield call(onError, rewards)
  }
}

export function* getLeadsResolutions(api) {
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const resolutions = yield call(retrySaga, api.getLeadsResolutions, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (resolutions.ok) {
    yield put(LeadsActions.getLeadsResolutionSuccess(resolutions.data))
  } else {
    yield call(onError, resolutions)
  }
}

export function* getLeadsFilterByOptions(api) {
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const status = yield call(retrySaga, api.getLeadStatus, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (status.ok) {
    yield put(LeadsActions.getLeadsFilterByOptionsSuccess(status.data))
  } else {
    yield call(onError, status)
  }
}

export function* getLeads(api, action) {
  const { page, body } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const allLeads = yield call(retrySaga, api.getLeads, { page: page, body }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (allLeads.ok) {
    yield put(LeadsActions.getLeadsSuccess(allLeads.data))
  } else {
    yield call(onError, allLeads, LeadsActions.getLeadsFailure(allLeads))
  }
}

export function* getLeadDetail(api, action) {
  const { id } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const status = yield call(retrySaga, api.getLeadDetail, { leadID: id }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (status.ok) {
    yield put(LeadsActions.getLeadDetailSuccess(status.data))
  } else {
    yield call(onError, status)
  }
}

export function* updateLeadStatus(api, action) {
  const { form } = action
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const updateLeads = yield call(retrySaga, api.updateLeadStatus, { form }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (updateLeads.ok) {
    yield put(LeadsActions.updateLeadStatusSuccess(updateLeads.data))
  } else {
    yield call(onError, updateLeads, LeadsActions.updateLeadStatusFailure(updateLeads))
  }
}
export function* getSalesTrackingCampaign(api, action) {
  const [tokenType, accessToken] = yield all([
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const { page, pageSize } = action
  const salesTracking = yield call(retrySaga, api.getSalesTrackingCampaign, { page, pageSize }, {
    'Request-Id': btoa(yield select(UserSelectors.getUserId)),
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (salesTracking.ok) {
    yield put(UserActions.getSalesTrackingCampaignSuccess(salesTracking.data))
  } else {
    yield call(onError, salesTracking, UserActions.getSalesTrackingCampaignFailure())
  }
}

export function* checkGeofence(api, action) {
  const { latitude, longitude, radius } = action
  const [userId, tokenType, accessToken] = yield all([
    select(UserSelectors.getUserId),
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const response = yield call(retrySaga, api.checkGeofence, { userId, latitude, longitude, radius }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (response.ok && !response.data.user_within_geofence) {
    yield put(NavigationActions.showError(Constants.ERROR_TYPES.GEOFENCING))
  } else {
    yield call(onError, response)
  }
}

export function* logOut(api) {
  const optedInPushNotifications = yield select(NotificationsSelectors.optedInPushNotifications)
  if (optedInPushNotifications) {
    const [userId, tokenType, accessToken] = yield all([
      select(UserSelectors.getUserId),
      select(selectTokenType),
      select(selectAccessToken),
    ])
    yield call(api.deleteDevice, { userId, deviceId: DeviceInfo.getUniqueId() }, {
      'Authorization': `${tokenType} ${accessToken}`,
    })
  }
  yield put(AppActions.signOut())
}

export function* getChannels(api) {
  const [userId, tokenType, accessToken] = yield all([
    select(UserSelectors.getUserId),
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const response = yield call(retrySaga, api.getChannels, { userId }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (response.ok) {
    yield put(UserActions.getChannelsSuccess(response.data))
  } else {
    yield call(onError, response)
  }
}

export function* getChannel(api, action) {
  const { channelId } = action
  const [userId, tokenType, accessToken] = yield all([
    select(UserSelectors.getUserId),
    select(selectTokenType),
    select(selectAccessToken),
  ])
  const response = yield call(retrySaga, api.getChannel, { userId, channelId }, {
    'Authorization': `${tokenType} ${accessToken}`,
  })
  if (response.ok) {
    yield put(UserActions.getChannelSuccess(channelId, response.data))
  } else {
    yield all([
      put(UserActions.getChannelFailure()),
      call(onError, response),
    ])
  }
}
