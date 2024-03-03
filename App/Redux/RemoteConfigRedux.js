import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getRemoteConfigSuccess: ['remoteConfigs'],
})

export const RemoteConfigTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  apiConfig: {},
  featureConfig: {},
})

/* ------------- Selectors ------------- */

export const RemoteConfigSelectors = {
  apiConfig: state => state.remoteConfig.apiConfig,
  retryCount: state => state.remoteConfig.apiConfig ? state.remoteConfig.apiConfig.retry_count : null,
  samsungDomainId: state => state.remoteConfig.featureConfig ? state.remoteConfig.featureConfig.samsung_domain_id : null,
  encryptionKey: state => state.remoteConfig.apiConfig ? state.remoteConfig.apiConfig.encryption_key : null,
  homeTabs: state => state.remoteConfig.featureConfig ? state.remoteConfig.featureConfig.home_tabs : null,
  learnTabs: state => state.remoteConfig.featureConfig ? state.remoteConfig.featureConfig.learn_tabs : null,
  tasks: state => state.remoteConfig.featureConfig ? state.remoteConfig.featureConfig.tasks : null,
  notifications: state => state.remoteConfig.featureConfig ? state.remoteConfig.featureConfig.notifications : null,
  spotRewards: state => state.remoteConfig.featureConfig ? state.remoteConfig.featureConfig.spot_rewards : null,
  modalities: state => state.remoteConfig.featureConfig ? state.remoteConfig.featureConfig.modalities : null,
  geofencing: state => state.remoteConfig.featureConfig ? state.remoteConfig.featureConfig.geofencing : null,
}

/* ------------- Reducers ------------- */

export const getRemoteConfigSuccess = (state, action) => {
  const { remoteConfigs } = action
  return state.merge(remoteConfigs)
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_REMOTE_CONFIG_SUCCESS]: getRemoteConfigSuccess,
})
