import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getRewards: ['page'],
  getRewardsSuccess: ['rewards'],
  getRewardDetail: ['rewardId'],
  getRewardDetailSuccess: ['rewardDetail'],
  getRewardDetailFailure: ['rewardId'],
  getRewardParticipationResult: ['rewardId', 'quantity'],
  getRewardParticipationResultSuccess: ['participationResult'],
  getRewardParticipationResultFailure: null,
  getSpotRewards: ['page'],
  getSpotRewardsSuccess: ['spotRewards'],
  getSpotRewardsFailure: null,
  postSpotRewards: ['spotRewardId', 'recipientId', 'comment'],
  postSpotRewardsSuccess: null,
  postSpotRewardsFailure: null,
})

export const RewardsTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  rewards: [],
  rewardDetails: [],
  participationResult: {},
  spotRewards: null,
  getSpotRewardsSuccess: null,
  postSpotRewardsResult: null,
})

/* ------------- Selectors ------------- */

export const RewardsSelectors = {

}

/* ------------- Reducers ------------- */

export const getRewardsSuccess = (state, { rewards }) =>
  state.merge({ rewards })

export const getRewardDetailSuccess = (state, { rewardDetail }) => {
  const rewardDetails = state.rewardDetails.filter(prevDetail => prevDetail.rewardId !== rewardDetail.rewardId)
  return state.merge({ rewardDetails: [...rewardDetails, rewardDetail] })
}

export const getRewardDetailFailure = (state, { rewardId } ) => {
  const rewardDetails = state.rewardDetails.filter(prevDetail => prevDetail.rewardId !== rewardId)
  return state.merge({ rewardDetails: rewardDetails })
}

export const getRewardParticipationResultSuccess = (state, { participationResult }) => 
  state.merge({ participationResult })
  
export const getRewardParticipationResultFailure = (state) => 
  state.merge({ participationResult: {} })

export const getSpotRewards = (state) => 
  state.merge({ getSpotRewardsSuccess: null })

export const getSpotRewardsSuccess = (state, { spotRewards }) =>
  state.merge({ getSpotRewardsSuccess: true, spotRewards })

export const getSpotRewardsFailure = (state) =>
  state.merge({ getSpotRewardsSuccess: false })

export const postSpotRewards = (state) =>
  state.merge({ postSpotRewardsResult: null })

export const postSpotRewardsSuccess = (state) =>
  state.merge({ postSpotRewardsResult: { ok: true } })

export const postSpotRewardsFailure = (state) =>
  state.merge({ postSpotRewardsResult: { ok: false } })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_REWARDS_SUCCESS]: getRewardsSuccess,
  [Types.GET_REWARD_DETAIL_SUCCESS]: getRewardDetailSuccess,
  [Types.GET_REWARD_DETAIL_FAILURE]: getRewardDetailFailure,
  [Types.GET_REWARD_PARTICIPATION_RESULT_SUCCESS]: getRewardParticipationResultSuccess,
  [Types.GET_REWARD_PARTICIPATION_RESULT_FAILURE]: getRewardParticipationResultFailure,
  [Types.GET_SPOT_REWARDS]: getSpotRewards,
  [Types.GET_SPOT_REWARDS_SUCCESS]: getSpotRewardsSuccess,
  [Types.GET_SPOT_REWARDS_FAILURE]: getSpotRewardsFailure,
  [Types.POST_SPOT_REWARDS]: postSpotRewards,
  [Types.POST_SPOT_REWARDS_SUCCESS]: postSpotRewardsSuccess,
  [Types.POST_SPOT_REWARDS_FAILURE]: postSpotRewardsFailure,
})