import apisauce from 'apisauce'
import Config from 'react-native-config'
import { addParam } from '@utils/UrlUtils'

const create = () => {
  const api = apisauce.create({
    baseURL: `${Config.PROXY_BASE_URL}/proxy/sumtotal`,
  })

  const setConfiguration = (useProxy, baseUrl, appKey) => {
    if (useProxy) {
      api.setHeader('x-host', baseUrl)
      api.setHeader('x-elite-appkey', appKey)
    } else {
      api.setBaseURL(baseUrl)
    }
  }

  const getAccessToken = (data, headers) => {
    return api.post('/apisecurity/connect/token', data, { headers })
  }

  const getStores = ({ orgdomainInd, zip, affiliationCode, limit }, headers) => {
    var url = '/apis/api/v1/organizations/search'
    if (zip) {
      url = addParam(url, 'zip', zip)
    }
    if (affiliationCode) {
      url = addParam(url, 'optionalText2', affiliationCode)
    }
    if (orgdomainInd != undefined) {
      url = addParam(url, 'orgdomainInd', orgdomainInd)
    }
    url = addParam(url, 'includeOptional', false)
    if (limit) {
      url = addParam(url, 'limit', limit)
    }
    return api.get(url, null, { headers })
  }

  const getRoles = (params, headers) => {
    return api.get('/apis/api/v1/jobs', params, { headers })
  }

  const signUp = (data, headers) => {
    return api.post('/apis/api/v1/advanced/users', data, { headers })
  }

  const refreshAudiences = ({ userId }, headers) => {
    return api.get(`/apis/api/v1/audiences/users${userId ? `/${userId}` : ''}/refresh`, null, { headers })
  }

  const getUserAudiences = (params, headers) => {
    const {
      userId,
      limit,
    } = params
    return api.get(`/apis/api/v1/users${userId ? `/${userId}` : ''}/audiences`, { limit }, { headers })
  }

  const getUserSummary = (data, headers) => {
    return api.get('/apis/api/v1/users/summary', null, { headers })
  }

  const updateUserSummary = ({ body }, headers) => {
    return api.patch('/apis/api/v1/users/summary', body, { headers })
  }

  const postUserProfileImage = (data, headers) => {
    return api.post('/apis/api/v1/users/picture', data, { headers })
  }

  const getActivity = ({ activityId }, headers) => {
    return api.get(`/apis/api/v1/learner/activities${activityId ? `/${activityId}` : ''}`, null, { headers })
  }

  const getActivityChild = ({ activityId }, headers) => {
    return api.get(`/apis/api/v1/learner/activities${activityId ? `/${activityId}` : ''}/children`, null, { headers })
  }

  const registerActivity = ({ activityId, userId }, headers) => {
    return api.put(`/apis/api/v1/users${userId ? `/${userId}` : ''}/activities/${activityId}/register`, null, { headers })
  }

  const completeActivity = (params, headers) => {
    const { activityId, requestBody } = params
    return api.put(`/apis/api/v1/learner/activities${activityId ? `/${activityId}` : ''}/progress`, requestBody, { headers })
  }

  const getCommunities = ({ pageNumber }, headers) => {
    var url = '/apis/api/v1/social/communities'
    url = addParam(url, 'isMember', true)
    url = addParam(url, 'offset', pageNumber)
    return api.get(url, null, { headers })
  }

  const getCommunityPost = ({ communityId, pageNumber }, headers) => {
    var url = `/apis/api/v1/social/communities/${communityId}/discussions`
    url = addParam(url, 'offset', pageNumber)
    return api.get(url, null, { headers })
  }

  const getCourses = ({ activityType, pageNumber, pageSize, sortColumns, sortDirection, modalityFilter }, headers) => {
    var url = `/apis/api/v1/users/courses`
    if (activityType != undefined) {
      url = addParam(url, 'activityType', activityType)
    }
    if (modalityFilter != undefined) {
      url = addParam(url, 'modalityFilter', modalityFilter)
    }
    if (pageNumber != undefined) {
      url = addParam(url, 'offSet', pageNumber)
    }
    if (pageSize != undefined) {
      url = addParam(url, 'limit', pageSize)
    }
    if (sortColumns != undefined) {
      url = addParam(url, 'sortColumns', sortColumns)
    }
    if (sortDirection != undefined) {
      url = addParam(url, 'sortDirection', sortDirection)
    }
    return api.get(url, null, { headers })
  }

  const getCourseModules = ({ activityId }, headers) => {
    return api.get(`/apis/api/v1/learner/activities${activityId ? `/${activityId}` : ''}/children`, null, { headers })
  }

  const getSubTopics = ({ topicId, activityCount, pageNumber }, headers) => {
    var url = `apis/api/v1/topics/${topicId}/subtopics/activities`
    if (activityCount != undefined) {
      url = addParam(url, 'activityCount', activityCount)
    }
    if (pageNumber != undefined) {
      url = addParam(url, 'offSet', pageNumber)
    }
    return api.get(url, null, { headers })
  }

  const getTopicActivities = ({ topicId, pageLimit, pageNumber }, headers) => {
    var url = `apis/api/v1/topics/${topicId}/activities`

    if (pageLimit != undefined) {
      url = addParam(url, 'limit', pageLimit)
    }
    if (pageNumber != undefined) {
      url = addParam(url, 'offSet', pageNumber)
    }
    return api.get(url, null, { headers })
  }

  const getOrganizationDetail = ({ organizationId }, headers) => {
    var url = '/apis/api/v1/organizations/search'
    url = addParam(url, 'organizationId', organizationId)
    return api.get(url, null, { headers })
  }

  const getBanners = ({ pageNumber }, headers) => {
    var url = '/apis/api/v1/users/banners'
    if (pageNumber) {
      url = addParam(url, 'offset', pageNumber)
    }
    return api.get(url, null, { headers })
  }

  const createPost = (params, headers) => {
    const { communityId, postData } = params
    var url = `/apis/api/v1/social/communities/${communityId}/discussions`
    return api.post(url, postData, { headers })
  }

  const getAssessmentQuestions = ({ assessmentId }, headers) => {
    return api.get(`/apis/api/v1/users/assessments/${assessmentId}/questions`, null, { headers })
  }

  const getAssessmentQuestion = ({ assessmentId, questionId }, headers) => {
    return api.get(`/apis/api/v1/users/assessments/${assessmentId}/questions/${questionId}`, null, { headers })
  }

  const postAssessmentAnswer = ({ assessmentId, questionId, param }, headers) => {
    return api.post(`/apis/api/v1/users/assessments/${assessmentId}/questions/${questionId}/answers`, param, { headers })
  }

  const getAssessmentSummary = ({ assessmentId }, headers) => {
    return api.get(`/apis/api/v1/users/assessments/${assessmentId}/summary`, null, { headers })
  }

  const postSubmitAssessments = ({ assessmentId }, headers) => {
    return api.post(`/apis/api/v1/users/assessments/${assessmentId}`, null, { headers })
  }

  const getPollSummary = ({ pollId }, headers) => {
    return api.get(`/apis/api/v1/users/polls/${pollId}/summary`, null, { headers })
  }

  const getSearchSuggestions = ({ searchTerm, context }, headers) => {
    return api.get(`/apis/api/v1/search/suggestions?searchTerm=${searchTerm}&context=${context}`, null, { headers })
  }

  const searchActivities = ({ modality, searchTerm, pageNumber }, headers) => {
    var url = `/apis/api/v1/activities/search?limit=10`
    if (searchTerm) {
      url = addParam(url, 'searchTerm', searchTerm)
    }
    if (modality) {
      url = addParam(url, 'modality', modality)
    }
    if (pageNumber) {
      url = addParam(url, 'offset', pageNumber)
    }
    return api.get(url, null, { headers })
  }

  const getSearchResult = ({ searchTerm, activityType }, headers) => {
    return api.get(`/apis/api/v1/activities/search?searchTerm=${searchTerm}&activityType=${activityType}`, null, { headers })
  }

  const uploadFile = ({ communityId, formData }, headers) => {
    return api.post(`/apis/api/v1/social/communities/${communityId}/files`, formData, { headers })
  }

  const getPostDetail = ({ discussionId }, headers) => {
    var url = `/apis/api/v1/social/discussions/${discussionId}`
    return api.get(url, null, { headers })
  }

  const likeCommunityPost = ({ discussionId }, headers) => {
    var url = `/apis/api/v1/social/discussions/${discussionId}/like`
    return api.put(url, null, { headers })
  }

  const unlikeCommunityPost = ({ discussionId }, headers) => {
    var url = `/apis/api/v1/social/discussions/${discussionId}/like`
    return api.delete(url, null, { headers })
  }

  const getPostCommentList = ({ discussionId }, headers) => {
    var url = `/apis/api/v1/social/discussions/${discussionId}/replies?page=0`
    return api.get(url, null, { headers })
  }

  const likeCommunityCommentPost = ({ replyId }, headers) => {
    var url = `/apis/api/v1/social/replies/${replyId}/like`
    return api.put(url, null, { headers })
  }

  const dislikeCommunityCommentPost = ({ replyId }, headers) => {
    var url = `/apis/api/v1/social/replies/${replyId}/like`
    return api.delete(url, null, { headers })
  }

  const getGamificationOverview = (headers) => {
    return api.get(`/apis/api/v1/users/gamification/overview`, null, { headers })
  }

  const deletePost = ({ discussionId }, headers) => {
    var url = `/apis/api/v1/social/discussions/${discussionId}`
    return api.delete(url, null, { headers })
  }

  const updatePost = (params, headers) => {
    const { discussionId, postData } = params
    var url = `/apis/api/v1/social/discussions/${discussionId}`
    return api.patch(url, postData, { headers })
  }

  const addComment = (params, headers) => {
    const { discussionId, postData } = params
    var url = `/apis/api/v1/social/discussions/${discussionId}/replies`
    return api.post(url, postData, { headers })
  }

  const updateComment = (params, headers) => {
    const { replyId, postData } = params
    var url = `/apis/api/v1/social/replies/${replyId}`
    return api.patch(url, postData, { headers })
  }

  const deleteComment = ({ replyId }, headers) => {
    var url = `/apis/api/v1/social/replies/${replyId}`
    return api.delete(url, null, { headers })
  }

  const getTaskDetails = ({ initiativeId }, headers) => {
    var url = `/apis/api/v1/users/initiatives/${initiativeId}`
    return api.get(url, null, { headers })
  }

  const uploadTaskFile = ({ fileItemId, formData }, headers) => {
    return api.post(`/apis/api/v1/users/initiatives/files/${fileItemId}`, formData, { headers })
  }

  const markTaskAsComplete = ({ initiativeId, stepId }, headers) => {
    return api.post(`/apis/api/v1/users/initiatives/${initiativeId}/${stepId}/completion`, null, { headers })
  }

  const getInitiatives = ({ adminNotes, limit, offset }, headers) => {
    var url = '/apis/api/v1/users/initiatives/list'
    if (adminNotes) {
      url = addParam(url, 'adminNotes', adminNotes)
    }
    if (limit) {
      url = addParam(url, 'limit', limit)
    }
    if (offset) {
      url = addParam(url, 'offset', offset)
    }
    return api.get(url, null, { headers })
  }

  return {
    setConfiguration,
    getAccessToken,
    getCourses,
    getCourseModules,
    getSubTopics,
    getTopicActivities,
    getActivity,
    getActivityChild,
    registerActivity,
    completeActivity,
    getStores,
    getRoles,
    signUp,
    refreshAudiences,
    getUserSummary,
    getUserAudiences,
    postUserProfileImage,
    getCommunities,
    getCommunityPost,
    getAssessmentQuestions,
    getAssessmentQuestion,
    postAssessmentAnswer,
    getAssessmentSummary,
    postSubmitAssessments,
    getPollSummary,
    getBanners,
    updateUserSummary,
    getOrganizationDetail,
    getGamificationOverview,
    getSearchSuggestions,
    searchActivities,
    getSearchResult,
    createPost,
    uploadFile,
    getPostDetail,
    likeCommunityPost,
    unlikeCommunityPost,
    getPostCommentList,
    likeCommunityCommentPost,
    dislikeCommunityCommentPost,
    deletePost,
    updatePost,
    addComment,
    updateComment,
    deleteComment,
    getTaskDetails,
    uploadTaskFile,
    markTaskAsComplete,
    getInitiatives,
  }
}

export default {
  create
}