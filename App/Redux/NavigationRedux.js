import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loadHomeScreen: null,
  loadHomeScreenSuccess: ['homeTabs', 'learnTabs'],
  showMaintenance: null,
  forceUpdate: null,
  showError: ['errorType'],
  hideError: null,
  updatePeriod: ['period'],
  reset: null,
  showLoading: null,
  hideLoading: null,
})

export const NavigationTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  homeTabs: [],
  learnTabs: [],
  maintMode: false,
  forceUpdate: false,
  showError: false,
  errorType: null,
})

/* ------------- Reducers ------------- */

export const loadHomeScreenSuccess = (state, { homeTabs, learnTabs }) =>
  state.merge({ homeTabs, learnTabs })

export const showMaintenance = (state) =>
  state.merge({ maintMode: true })

export const forceUpdate = (state) =>
  state.merge({ forceUpdate: true })

export const showError = (state, { errorType }) =>
  state.merge({ showError: true, errorType })

export const hideError = (state) =>
  state.merge({ showError: false })

export const updatePeriod = (state, { period }) =>
  state.merge({ period })

export const reset = () => INITIAL_STATE

export const showLoading = (state) =>
  state.merge({ isLoading: true })

export const hideLoading = (state) =>
  state.merge({ isLoading: false })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOAD_HOME_SCREEN_SUCCESS]: loadHomeScreenSuccess,
  [Types.SHOW_MAINTENANCE]: showMaintenance,
  [Types.FORCE_UPDATE]: forceUpdate,
  [Types.SHOW_ERROR]: showError,
  [Types.HIDE_ERROR]: hideError,
  [Types.UPDATE_PERIOD]: updatePeriod,
  [Types.RESET]: reset,
  [Types.SHOW_LOADING]: showLoading,
  [Types.HIDE_LOADING]: hideLoading,
})
