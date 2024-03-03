import {
  Platform,
} from 'react-native'
import {
  all,
  call,
  fork,
  put,
  select,
} from 'redux-saga/effects'
import RemoteConfigActions from '@redux/RemoteConfigRedux'
import AppActions, { AppSelectors } from '@redux/AppRedux'
import { UserSelectors } from '../Redux/UserRedux'
import NavigationActions from '@redux/NavigationRedux'
import {
  getRemoteConfigValues,
  queryDb,
} from '@utils/FirebaseUtils'
import { getVersionCode } from '@utils/VersionUtils'

function* execHealthcheck(api) {
  const response = yield call(api.healthcheck)
  if (!response.ok || !response.data.online) {
    yield put(NavigationActions.showMaintenance())
  }
}

function* fetchRemoteConfigs() {
  const remoteConfigs = yield call(getRemoteConfigValues)
  if (remoteConfigs) {
    yield put(RemoteConfigActions.getRemoteConfigSuccess(remoteConfigs))
  }
}

// process STARTUP actions
export function* startup(seaApi, stApi, chApi) {
  const [apiConfig, featureConfig] = yield all([
    call(queryDb, 'api_config'),
    call(queryDb, 'feature_config'),
  ])

  if (featureConfig && featureConfig.maint_mode) {
    yield put(NavigationActions.showMaintenance())
    return
  }

  if (featureConfig && getVersionCode() < featureConfig[`min_version_code_${Platform.OS}`]) {
    yield put(NavigationActions.forceUpdate())
    return
  }

  yield put(RemoteConfigActions.getRemoteConfigSuccess({ apiConfig, featureConfig }))

  if (apiConfig) {
    yield all([
      call(seaApi.setConfiguration, apiConfig.app_key),
      call(stApi.setConfiguration, apiConfig.use_proxy, apiConfig.st_base_url, apiConfig.app_key),
      call(chApi.setConfiguration, apiConfig.use_proxy, apiConfig.ch_base_url, apiConfig.app_key),
    ])
    if (apiConfig.use_proxy) {
      yield fork(execHealthcheck, seaApi)
    }
  }

  yield fork(fetchRemoteConfigs)

  const isSignedIn = yield select(AppSelectors.isSignedIn)
  const hasNewTermsConditions = yield select(UserSelectors.hasNewTermsConditions)
  if (isSignedIn && !hasNewTermsConditions) {
    yield put(NavigationActions.loadHomeScreen())
  } else {
    yield put(AppActions.rehydrationComplete())
  }
}
