import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

import { currentTimeSeconds } from '@utils/DateUtils'
import { Constants } from '@resources'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  rehydrationComplete: null,
  signInSuccess: null,
  enterBackground: null,
  getAccessToken: ['grantType', 'code', 'email', 'password'],
  getAccessTokenSuccess: ['grantType', 'access_token', 'expires_in', 'token_type', 'refresh_token', 'scope'],
  getAccessTokenFailure: ['errorMessage'],
  showHideAppRatingPrompt: ['isVisible'],
  updateLastSeenAppRatingPrompt: ['lastSeenAppRatingPrompt'],
  signOut: null,
})

export const AppTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  rehydrated: false,
  signedIn: false,
  access_token: null,
  expires_in: null,
  token_type: null,
  refresh_token: null,
  scope: null,
  b2b: {},
})

/* ------------- Selectors ------------- */

export const AppSelectors = {
  isSignedIn: state => state.app.signedIn,
  getTokenType: (state, grantType) => {
    if (grantType == Constants.GRANT_TYPE.CLIENT_CREDENTIALS) {
      return state.app.b2b.token_type
    } else {
      if (state.user.channelId && state.user.channel) {
        return state.user.channel.token_type
      } else {
        return state.app.token_type
      }
    }
  },
  getAccessToken: (state, grantType) => {
    if (grantType == Constants.GRANT_TYPE.CLIENT_CREDENTIALS) {
      return state.app.b2b.access_token
    } else {
      if (state.user.channelId && state.user.channel) {
        return state.user.channel.access_token
      } else {
        return state.app.access_token
      }
    }
  },
  getRefreshToken: (state) => state.app.refresh_token,
}

/* ------------- Reducers ------------- */

export const rehydrationComplete = (state) =>
  state.merge({ rehydrated: true })

export const signInSuccess = (state) =>
  state.merge({ signedIn: true })

export const enterBackground = (state) =>
  state.merge({ lastEnterBackground: currentTimeSeconds() })

export const getAccessToken = (state) =>
  state.merge({ isGettingAccessToken: true, getAccessTokenFailure: false })

export const getAccessTokenSuccess = (state, { grantType, access_token, expires_in, token_type, refresh_token, scope }) => {
  if (grantType == Constants.GRANT_TYPE.CLIENT_CREDENTIALS) {
    return state.merge({ isGettingAccessToken: false, getAccessTokenFailure: false, b2b: { access_token, expires_in, token_type, scope } })
  } else {
    return state.merge({ isGettingAccessToken: false, getAccessTokenFailure: false, access_token, expires_in, token_type, refresh_token, scope })
  }
}

export const getAccessTokenFailure = (state, { errorMessage }) =>
  state.merge({ isGettingAccessToken: false, getAccessTokenFailure: true, errorMessage })

export const showHideAppRatingPrompt = (state, { isVisible }) =>
  state.merge({ isAppRatingPromptVisible: isVisible })

export const updateLastSeenAppRatingPrompt = (state, { lastSeenAppRatingPrompt }) =>
  state.merge({ lastSeenAppRatingPrompt })

export const signOut = (state) =>
  state.merge({ signedIn: false, access_token: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.REHYDRATION_COMPLETE]: rehydrationComplete,
  [Types.SIGN_IN_SUCCESS]: signInSuccess,
  [Types.ENTER_BACKGROUND]: enterBackground,
  [Types.GET_ACCESS_TOKEN]: getAccessToken,
  [Types.GET_ACCESS_TOKEN_SUCCESS]: getAccessTokenSuccess,
  [Types.GET_ACCESS_TOKEN_FAILURE]: getAccessTokenFailure,
  [Types.SHOW_HIDE_APP_RATING_PROMPT]: showHideAppRatingPrompt,
  [Types.UPDATE_LAST_SEEN_APP_RATING_PROMPT]: updateLastSeenAppRatingPrompt,
  [Types.SIGN_OUT]: signOut,
})
