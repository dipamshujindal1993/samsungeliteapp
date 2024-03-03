import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { Constants } from '@resources'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
    showHideSearchSuggestions: ['isVisible'],
    getSearchSuggestions: ['searchTerm', 'context'],
    getSearchSuggestionsSuccess: ['searchSuggestions'],
    triggerSearching: null,
    searchActivities: ['tab', 'searchTerm', 'pageNumber'],
    searchActivitiesSuccess: ['tab', 'searchResults'],
    searchActivitiesFailure: ['tab'],
    getArticlesSearched: ['searchTerm', 'activityType'],
    getArticlesSearchedSuccess: ['articlesSearchResult'],
    getArticlesSearchedFailure: null,
    getCoursesSearched: ['searchTerm', 'activityType'],
    getCoursesSearchedSuccess: ['coursesSearchResult'],
    getCoursesSearchedFailure: null,
    getResourcesSearched: ['searchTerm', 'activityType'],
    getResourcesSearchedSuccess: ['resourcesSearchResult'],
    getResourcesSearchedFailure: null,
    getActivitiesSearched: ['searchTerm', 'activityType'],
    getActivitiesSearchedSuccess: ['activitiesSearchResult'],
    getActivitiesSearchedFailure: null,
    updateSearchTerm: ['searchTerm'],
})

export const SearchTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    searchSuggestions: [],
    articlesSearchResult: [],
    coursesSearchResult: [],
    resourcesSearchResult: [],
    activitiesSearchResult: [],
    searchTerm: '',
    errorLoadingArticlesSearched: false,
    errorLoadingCourcesSearched: false,
    errorLoadingResourcesSearched: false,
    errorLoadingActivitiesSearched: false
})

/* ------------- Selectors ------------- */

export const SearchSelectors = {
}

/* ------------- Reducers ------------- */

export const showHideSearchSuggestions = (state, { isVisible }) =>
    state.merge({ shouldShowSearchSuggestions: isVisible })

export const getSearchSuggestionsSuccess = (state, { searchSuggestions }) =>
    state.merge({ searchSuggestions })

export const triggerSearching = (state) =>
    state.merge({ triggerSearching: !state.triggerSearching })

export const searchActivities = (state, { tab }) => {
    switch (tab) {
        case Constants.TAB_COURSES:
            return state.merge({ searchCoursesSuccess: false, searchCoursesFailure: false })

        case Constants.TAB_RESOURCES:
            return state.merge({ searchResourcesSuccess: false, searchResourcesFailure: false })

        case Constants.TAB_ACTIVITIES:
            return state.merge({ searchActivitiesSuccess: false, searchActivitiesFailure: false })

        default:
            return state.merge({ searchArticlesSuccess: false, searchArticlesFailure: false })
    }
}

export const searchActivitiesSuccess = (state, { tab, searchResults }) => {
    switch (tab) {
        case Constants.TAB_COURSES:
            return state.merge({ courses: searchResults, searchCoursesSuccess: true, searchCoursesFailure: false })

        case Constants.TAB_RESOURCES:
            return state.merge({ resources: searchResults, searchResourcesSuccess: true, searchResourcesFailure: false })

        case Constants.TAB_ACTIVITIES:
            return state.merge({ activities: searchResults, searchActivitiesSuccess: true, searchActivitiesFailure: false })

        default:
            return state.merge({ articles: searchResults, searchArticlesSuccess: true, searchArticlesFailure: false })
    }
}

export const searchActivitiesFailure = (state, { tab }) => {
    switch (tab) {
        case Constants.TAB_COURSES:
            return state.merge({ searchCoursesSuccess: false, searchCoursesFailure: true })

        case Constants.TAB_RESOURCES:
            return state.merge({ searchResourcesSuccess: false, searchResourcesFailure: true })

        case Constants.TAB_ACTIVITIES:
            return state.merge({ searchActivitiesSuccess: false, searchActivitiesFailure: true })

        default:
            return state.merge({ searchArticlesSuccess: false, searchArticlesFailure: true })
    }
}

export const getArticlesSearched = (state) =>
    state.merge({ errorLoadingArticlesSearched: false })

export const getArticlesSearchedSuccess = (state, { articlesSearchResult }) =>
    state.merge({ articlesSearchResult })

export const getArticlesSearchedFailure = (state) =>
    state.merge({ errorLoadingArticlesSearched: true })

export const getCoursesSearched = (state) =>
    state.merge({ errorLoadingCourcesSearched: false })

export const getCoursesSearchedSuccess = (state, { coursesSearchResult }) =>
    state.merge({ coursesSearchResult })

export const getCoursesSearchedFailure = (state) =>
    state.merge({ errorLoadingCourcesSearched: true })

export const getResourcesSearched = (state) =>
    state.merge({ errorLoadingResourcesSearched: false })

export const getResourcesSearchedSuccess = (state, { resourcesSearchResult }) =>
    state.merge({ resourcesSearchResult })

export const getResourcesSearchedFailure = (state) =>
    state.merge({ errorLoadingResourcesSearched: true })

export const getActivitiesSearched = (state) =>
    state.merge({ errorLoadingActivitiesSearched: false })

export const getActivitiesSearchedSuccess = (state, { activitiesSearchResult }) =>
    state.merge({ activitiesSearchResult })

export const getActivitiesSearchedFailure = (state) =>
    state.merge({ errorLoadingActivitiesSearched: true })

export const updateSearchTerm = (state, { searchTerm }) =>
    state.merge({ searchTerm })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.SHOW_HIDE_SEARCH_SUGGESTIONS]: showHideSearchSuggestions,
    [Types.GET_SEARCH_SUGGESTIONS_SUCCESS]: getSearchSuggestionsSuccess,
    [Types.TRIGGER_SEARCHING]: triggerSearching,
    [Types.SEARCH_ACTIVITIES]: searchActivities,
    [Types.SEARCH_ACTIVITIES_SUCCESS]: searchActivitiesSuccess,
    [Types.SEARCH_ACTIVITIES_FAILURE]: searchActivitiesFailure,
    [Types.GET_ARTICLES_SEARCHED]: getArticlesSearched,
    [Types.GET_ARTICLES_SEARCHED_SUCCESS]: getArticlesSearchedSuccess,
    [Types.GET_ARTICLES_SEARCHED_FAILURE]: getArticlesSearchedFailure,
    [Types.GET_COURSES_SEARCHED]: getCoursesSearched,
    [Types.GET_COURSES_SEARCHED_SUCCESS]: getCoursesSearchedSuccess,
    [Types.GET_COURSES_SEARCHED_FAILURE]: getCoursesSearchedFailure,
    [Types.GET_RESOURCES_SEARCHED]: getResourcesSearched,
    [Types.GET_RESOURCES_SEARCHED_SUCCESS]: getResourcesSearchedSuccess,
    [Types.GET_RESOURCES_SEARCHED_FAILURE]: getResourcesSearchedFailure,
    [Types.GET_ACTIVITIES_SEARCHED]: getActivitiesSearched,
    [Types.GET_ACTIVITIES_SEARCHED_SUCCESS]: getActivitiesSearchedSuccess,
    [Types.GET_ACTIVITIES_SEARCHED_FAILURE]: getActivitiesSearchedFailure,
    [Types.UPDATE_SEARCH_TERM]: updateSearchTerm
})
