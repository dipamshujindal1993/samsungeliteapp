import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

const { Types, Creators } = createActions({
  getLeads:['page', 'body'],
  getLeadsSuccess:['allLeads'],
  getLeadsFailure:['failure'],
  getLeadsResolutions: null,
  getLeadsResolutionSuccess: ['resolutions'],
  getLeadsFilterByOptions: null,
  getLeadsFilterByOptionsSuccess: ['leadStatus'],
  getLeadDetail:['id'],
  getLeadDetailSuccess:['leadDetails'],
  updateLeadStatus:['form'],
  updateLeadStatusSuccess:['leadUpdateData'],
  updateLeadStatusFailure:['leadUpdateDataFailure'],
  isUpdatingLeadStatus: ['inProgress'],
  shouldRefreshLeads: ['shouldRefresh'],
  clearData: null,
});
 
export const LeadsTypes = Types;
export default Creators

export const defaultLeadsFilter = Immutable({
  Id: 0,
  IsActive: true,
  Name: "All Leads"
})

const INITIAL_STATE = Immutable({
  leadsFilterByOptions: [defaultLeadsFilter],
  isFetchingFilterList: true,
  isFetchingLeadDetail: true,
  shouldRefreshLeads: false,
  isUpdatingLeadStatus: false,
  isLeadResolutionsLoading: true,
  resolutions: [],
  leadDetails: null,
  isLeadsFetching: false,
  allLeads: null,
  allLeadsError: null
});

export const getLeadsFilterByOptionsSuccess = (state, { leadStatus }) => {
  if (leadStatus) {
    return state.merge({
      leadsFilterByOptions: [defaultLeadsFilter, ...leadStatus],
      isFetchingFilterList: false
    })
  }
  return state;
};

export const getLeadsResolutionSuccess = (state, { resolutions }) => {
  return state.merge({ resolutions: resolutions })
};

export const shouldRefreshLeads = (state, { shouldRefresh }) => {
    return state.merge({
      shouldRefreshLeads: shouldRefresh
    })
};

export const isUpdatingLeadStatus = (state, { inProgress }) => {
    return state.merge({
      isUpdatingLeadStatus: inProgress,
    })
}

export const getLeadDetail = (state, { id }) => {
  return state.merge({ isFetchingFilterList: true })
}

export const getLeadDetailSuccess = (state, { leadDetails }) => {
    return state.merge({ leadDetails: leadDetails, isFetchingFilterList: false })
}

export const getLeads = (state) => {
  return state.merge({ isLeadsFetchingError: false })
}

export const getLeadsSuccess = (state, { allLeads }) => {
    return state.merge({ allLeads: allLeads, isLeadsFetchingError: false })
}

export const getLeadsFailure = (state) => {
  return state.merge({ isLeadsFetchingError: true })
}

export const updateLeadStatus = state => {
  return state.merge({  isLeadStatusUpdating: true, isLeadUpdateStatusFailed: false })
}

export const updateLeadStatusSuccess = (state, { leadUpdateData }) => {
    return state.merge({ leadUpdateData: leadUpdateData, isLeadStatusUpdating: false, isLeadUpdateStatusFailed: false })
}

export const updateLeadStatusFailure = (state) => {
  return state.merge({ isLeadUpdateStatusFailed: true, isLeadStatusUpdating: false })
}

export const clearData = (state) => INITIAL_STATE

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_LEADS_FILTER_BY_OPTIONS_SUCCESS]: getLeadsFilterByOptionsSuccess,
  [Types.SHOULD_REFRESH_LEADS]: shouldRefreshLeads,
  [Types.CLEAR_DATA]: clearData,
  [Types.IS_UPDATING_LEAD_STATUS]: isUpdatingLeadStatus,
  [Types.GET_LEADS_RESOLUTION_SUCCESS]: getLeadsResolutionSuccess,
  [Types.GET_LEAD_DETAIL]: getLeadDetail,
  [Types.GET_LEAD_DETAIL_SUCCESS]: getLeadDetailSuccess,
  [Types.GET_LEADS]: getLeads,
  [Types.GET_LEADS_SUCCESS]: getLeadsSuccess,
  [Types.GET_LEADS_FAILURE]: getLeadsFailure,
  [Types.UPDATE_LEAD_STATUS]: updateLeadStatus,
  [Types.UPDATE_LEAD_STATUS_SUCCESS]: updateLeadStatusSuccess,
  [Types.UPDATE_LEAD_STATUS_FAILURE]: updateLeadStatusFailure
});
