import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { Constants } from '@resources'


/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getCourses: ['activityType', 'pageNumber', 'pageSize'],
  getCoursesSuccess: ['courses', 'activityType'],
  getCoursesFailure: ['activityType'],
  getCourseModules: ['activityId'],
  getCourseModulesSuccess: ['courseModules', 'activityId'],
  getCourseModulesFailure: [],
  getSubTopics: ['topicId', 'topicType', 'activityCount', 'pageNumber'],
  getSubTopicsSuccess: ['topics', 'topicType'],
  getSubTopicsFailure: ['topicType'],
  getTopicActivities: ['topicId', 'pageLimit', 'pageNumber'],
  getTopicActivitiesSuccess: ['topicActivities'],
  getTopicActivitiesFailure: [],
  getActivity: ['activityId'],
  postActivity: ['category', 'subCategory', 'availableDate'],
  getActivitySuccess: ['activity'],
  getActivityFailure: ['activityId'],
  getActivityChild: ['activityId'],
  getActivityChildSuccess: ['activityId', 'child'],
  registerActivity: ['activityId', 'userId'],
  registerActivitySuccess: ['activityId'],
  registerActivityFailure: ['activityId'],
  completeActivity: ['activityId', 'status', 'parentActivityId', 'elapsedSeconds'],
  completeActivitySuccess: ['activityId', 'updatedActivityData', 'parentActivityId', 'elapsedSeconds'],
  completeActivityFailure: ['activityId', 'updatedActivityData', 'parentActivityId'],
  postPoints: ['point', 'referenceId', 'category', 'reason', 'subCategory'],
  removeActivity: ['activityId'],
  getLearning: ['learningType'],
  getLearningSuccess: ['learning'],
  getLearningFailure: null,
  getActivityDetail: ['activityId'],
  getActivityDetailSuccess: ['activityDetail'],
  getActivityDetailFailure: null,
  signOut: null,
})

export const ActivitiesTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  activities: [],
  faqs: [],
  promos: [],
  articleDetails: [],
  questionDetails: []
})

/* ------------- Selectors ------------- */

export const ActivitySelectors = {
}

/* ------------- Reducers ------------- */

export const getCourses = (state, { activityType }) => {
  switch (activityType) {
    case Constants.ACTIVITY_TYPES.PROMO:
      return state.merge({ isLoadingPromos: true, promosFailure: false })

    case Constants.ACTIVITY_TYPES.FAQ:
      return state.merge({ isLoadingFaq: true, faqFailure: false })

    case Constants.ACTIVITY_TYPES.GAME:
      return state.merge({ isLoadingGames: true, gamesFailure: false })

    case Constants.ACTIVITY_TYPES.SIMPLIFIED_CURRICULUM:
      return state.merge({ isLoadingCourses: true, coursesFailure: false })

    default:
      return state.merge({ isLoadingActivities: true, activitiesFailure: false })
  }
}

export const getCoursesSuccess = (state, { courses, activityType }) => {
  switch (activityType) {
    case Constants.ACTIVITY_TYPES.PROMO:
      return state.merge({ isLoadingPromos: false, promos: courses.data })

    case Constants.ACTIVITY_TYPES.FAQ:
      return state.merge({ isLoadingFaq: false, faqs: courses.data })

    case Constants.ACTIVITY_TYPES.GAME:
      return state.merge({ isLoadingGames: false, games: courses.data })

    case Constants.ACTIVITY_TYPES.SIMPLIFIED_CURRICULUM:
      return state.merge({ isLoadingCourses: false, learnerCourses: courses })

    default:
      let learnerActivities = state.learnerActivities
      if (learnerActivities && learnerActivities.data && learnerActivities.data.length) {
        let data = learnerActivities.data
        let pagination = courses.pagination

        if (pagination.offset == 0) {
          data = Object.assign([], { ...courses.data })
        } else if (learnerActivities.pagination.offset == pagination.offset) {
          data = Object.assign([], { ...data, ...courses.data })
        } else if (learnerActivities.pagination.offset < pagination.offset) {
          data = Object.assign([], { ...learnerActivities.data })
          data.push(...courses.data)
        }
        learnerActivities = Object.assign({}, { ...learnerActivities, pagination, data })
      } else {
        learnerActivities = courses
      }
      
      return state.merge({ isLoadingActivities: false, learnerActivities })
  }
}

export const getCoursesFailure = (state, { activityType }) => {
  switch (activityType) {
    case Constants.ACTIVITY_TYPES.PROMO:
      return state.merge({ isLoadingPromos: false, promosFailure: true })

    case Constants.ACTIVITY_TYPES.FAQ:
      return state.merge({ isLoadingFaq: false, faqFailure: true })

    case Constants.ACTIVITY_TYPES.GAME:
      return state.merge({ isLoadingGames: false, gamesFailure: true })

    case Constants.ACTIVITY_TYPES.SIMPLIFIED_CURRICULUM:
      return state.merge({ isLoadingCourses: false, coursesFailure: true })

    default:
      return state.merge({ isLoadingActivities: false, activitiesFailure: true })
  }
}

export const getCourseModules = (state) =>
  state.merge({ isLoadingCourseModules: true })

export const getCourseModulesSuccess = (state, { courseModules, activityId }) => {

  if (state.learnerCourses && state.learnerCourses.data) {
    let currentCourse
    for (let i = 0; i < state.learnerCourses.data.length; i++) {
      if (state.learnerCourses.data[i].activityId == activityId) {
        currentCourse = Object.assign({}, state.learnerCourses.data[i])
        break
      }
    }

    if (currentCourse) {
      for (let i = 0; i < state.learnerCourses.data.length; i++) {
        if (state.learnerCourses.data[i].activityId == activityId) {
          return state.merge({
            isLoadingCourseModules: false, courseModulesFail: false, courseModules,
            learnerCourses: {
              ...state.learnerCourses,
              data: Object.assign([], {
                ...state.learnerCourses.data,
                [i]: {
                  ...state.learnerCourses.data[i],
                  childActivity: courseModules.childActivities
                }
              })
            }
          })
        }
      }
    }
  }
  return state.merge({ isLoadingCourseModules: false, courseModulesFail: false, courseModules })
}

export const getCourseModulesFailure = (state) =>
  state.merge({ isLoadingCourseModules: false, courseModulesFail: true })

export const getSubTopics = (state, { topicType }) => {
  switch (topicType) {
    case Constants.TOPIC_TYPES.DEMOS:
      return state.merge({ isLoadingDemos: true, demosFailure: false })

    case Constants.TOPIC_TYPES.MERCHANDISING:
      return state.merge({ isLoadingMerchandises: true, merchandisesFailure: false })

    case Constants.TOPIC_TYPES.RESOURCES:
      return state.merge({ isLoadingResources: true, resourcesFailure: false })

    default:
      break
  }
}

export const getSubTopicsSuccess = (state, { topics, topicType }) => {
  switch (topicType) {
    case Constants.TOPIC_TYPES.DEMOS:
      return state.merge({ isLoadingDemos: false, demos: topics })

    case Constants.TOPIC_TYPES.MERCHANDISING:
      return state.merge({ isLoadingMerchandises: false, merchandises: topics })

    case Constants.TOPIC_TYPES.RESOURCES:
      return state.merge({ isLoadingResources: false, resources: topics })

    default:
      break
  }
}

export const getSubTopicsFailure = (state, { topicType }) => {
  switch (topicType) {
    case Constants.TOPIC_TYPES.DEMOS:
      return state.merge({ isLoadingDemos: false, demosFailure: true })

    case Constants.TOPIC_TYPES.MERCHANDISING:
      return state.merge({ isLoadingMerchandises: false, merchandisesFailure: true })

    case Constants.TOPIC_TYPES.RESOURCES:
      return state.merge({ isLoadingResources: false, resourcesFailure: true })

    default:
      break
  }
}

export const getTopicActivities = (state) =>
  state.merge({ isLoadingTopicActivities: true, topicActivitiesFailure: false })

export const getTopicActivitiesSuccess = (state, { topicActivities }) =>
  state.merge({ isLoadingTopicActivities: false, topicActivities })

export const getTopicActivitiesFailure = (state) =>
  state.merge({ isLoadingTopicActivities: false, topicActivitiesFailure: true })

export const getActivitySuccess = (state, { activity }) => {
  switch (activity.activityType) {
    case Constants.ACTIVITY_TYPES.ARTICLE:
    case Constants.ACTIVITY_TYPES.FAQ:
    case Constants.ACTIVITY_TYPES.GAME:
    case Constants.ACTIVITY_TYPES.PROMO:
      const articleDetails = state.articleDetails.filter(activityDetail => activityDetail.activityId != activity.activityId)
      return state.merge({ articleDetails: [...articleDetails, activity] })

    case Constants.ACTIVITY_TYPES.QUICK_ASSESSMENT:
    case Constants.ACTIVITY_TYPES.POLLS_OR_SURVEYS:
      const questionDetails = state.questionDetails.filter(quesDetails => quesDetails.activityId != activity.activityId)
      return state.merge({ questionDetails: [...questionDetails, activity] })

    default:
      const activities = state.activities.filter(prevDetail => prevDetail.activityId != activity.activityId)
      return state.merge({ activities: [...activities, activity] })
  }
}

export const getActivityFailure = (state, { activityId }) => {
  const newArticleDetails = state.articleDetails.filter(activityDetail => activityDetail.activityId != activityId)
  const newActivities = state.activities.filter(activityDetail => activityDetail.activityId != activityId)
  return state.merge({ articleDetails: newArticleDetails, activities: newActivities })
}

export const getActivityChildSuccess = (state, { activityId, child }) => {
  const activities = state.activities.map(activity =>
    activity.activityId == activityId ? { ...activity, childActivities: child } : activity
  )
  return state.merge({ activities })
}

export const completeActivitySuccess = (state, { activityId, updatedActivityData, parentActivityId, elapsedSeconds }) => {
  if (parentActivityId != null) {
    let currentActivity;
    let isCourse = false
    state.activities.filter(activity => {
      if (activity.activityId == parentActivityId) {
        currentActivity = activity
      }
    })

    if (state.learnerCourses && state.learnerCourses.data && state.learnerCourses.data.length) {
      for (let i = 0; i < state.learnerCourses.data.length; i++) {
        if (state.learnerCourses.data[i].activityId == parentActivityId) {
          isCourse = true
          currentActivity = Object.assign({}, state.learnerCourses.data[i])
          break
        }
      }
    }

    if (!isCourse && currentActivity && currentActivity.childActivities) {
      let updatedChildActivity = [];
      currentActivity.childActivities.find(child => {
        if (child.activityId == activityId) {
          updatedChildActivity.push(Object.assign({}, child, { ...updatedActivityData }))
        }
      })
      const updatedActivities = currentActivity.childActivities.map(prevChild => updatedChildActivity.find(obj => obj.activityId == prevChild.activityId) || prevChild)
      const activities = state.activities.map(activity =>
        activity.activityId == parentActivityId ? { ...activity, childActivities: updatedActivities } : activity
      )
      return state.merge({ activities })
    } else if (isCourse === true && currentActivity && currentActivity.childActivity) {
      let updatedChildActivity = [];
      currentActivity.childActivity.find(child => {
        if (child.activityId == activityId) {
          updatedChildActivity.push(Object.assign({}, child, { ...updatedActivityData }))
        }
      })
      const updatedchildActivity = currentActivity.childActivity.map(prevChild => updatedChildActivity.find(obj => obj.activityId == prevChild.activityId) || prevChild)

      for (let i = 0; i < state.learnerCourses.data.length; i++) {
        if (state.learnerCourses.data[i].activityId == parentActivityId) {
          return state.merge({
            learnerCourses: {
              ...state.learnerCourses, data: Object.assign([], {
                ...state.learnerCourses.data, [i]: { ...state.learnerCourses.data[i], childActivity: updatedchildActivity }
              })
            }
          })
        }
      }
    }
  } else {
    const activities = state.activities.map(activity => {
      if (activity.activityId == activityId) {
        let progressDetails = elapsedSeconds && activity.progressDetails ? { ...activity.progressDetails, elapsedSeconds } : { ...activity.progressDetails }
        return { ...activity, progressDetails, ...updatedActivityData }
      } else {
        return activity
      }
    }
    )
    return state.merge({ activities })
  }
  return state
}

export const completeActivityFailure = (state, { activityId, updatedActivityData, parentActivityId }) => {
  let isCourse = false
  let currentActivity
  const activities = state.activities.map(activity => {
    if (activity.activityId == activityId) {
      return { ...activity, ...updatedActivityData }
    } else {
      return activity
    }
  })

  if (parentActivityId && state.learnerCourses && state.learnerCourses.data && state.learnerCourses.data.length) {
    for (let i = 0; i < state.learnerCourses.data.length; i++) {
      if (state.learnerCourses.data[i].activityId == parentActivityId) {
        isCourse = true
        currentActivity = Object.assign({}, state.learnerCourses.data[i])
        break
      }
    }
  }

  if (isCourse === true && currentActivity && currentActivity.childActivity) {
    let updatedChildActivity = [];
    currentActivity.childActivity.find(child => {
      if (child.activityId == activityId) {
        updatedChildActivity.push(Object.assign({}, child, { ...updatedActivityData }))
      }
    })
    const updatedchildActivity = currentActivity.childActivity.map(prevChild => updatedChildActivity.find(obj => obj.activityId == prevChild.activityId) || prevChild)

    for (let i = 0; i < state.learnerCourses.data.length; i++) {
      if (state.learnerCourses.data[i].activityId == parentActivityId) {
        return state.merge({
          learnerCourses: {
            ...state.learnerCourses, data: Object.assign([], {
              ...state.learnerCourses.data, [i]: { ...state.learnerCourses.data[i], childActivity: updatedchildActivity }
            })
          }
        })
      }
    }
  }
  return state.merge({ activities })
}

export const registerActivitySuccess = (state, { activityId }) => {
  let currentActivity
  for (let i = 0; i < state.activities.length; i++) {
    if (state.activities[i].activityId == activityId) {
      currentActivity = Object.assign({}, state.activities[i])
      break
    }
  }
  if (currentActivity) {
    currentActivity.isRegistered = true

    const activities = state.activities.filter(activity => activity.activityId != activityId)
    return state.merge({ activities: [...activities, currentActivity] })
  } else {
    return state
  }
}

export const registerActivityFailure = (state, { activityId }) => {
  let currentActivity
  for (let i = 0; i < state.activities.length; i++) {
    if (state.activities[i].activityId == activityId) {
      currentActivity = Object.assign({}, state.activities[i])
      break
    }
  }
  if (currentActivity) {
    currentActivity.registerActivityFailure = true

    const activities = state.activities.filter(activity => activity.activityId != activityId)
    return state.merge({ activities: [...activities, currentActivity] })
  } else {
    return state
  }
}

export const removeActivity = (state, { activityId }) => {
  const activities = state.activities.filter(prevActivity => prevActivity.activityId != activityId)
  const questionDetails = state.questionDetails.filter(prevActivity => prevActivity.activityId != activityId)

  let learnerActivities = state.learnerActivities

  if (learnerActivities && learnerActivities.data && learnerActivities.data.length) {
    let data = []
    pagination = learnerActivities.pagination

    learnerActivities.data.filter(learnActivity => {
      if (learnActivity.activityId != activityId) {
        data.push(learnActivity)
      } else {
        if (pagination && pagination.total > 0) {
          pagination = Object.assign({}, { ...pagination, total: pagination.total - 1 })
        }
      }
    })
    learnerActivities = Object.assign({}, { ...learnerActivities, pagination, data })
  }
  return state.merge({ activities, questionDetails, learnerActivities })
}

export const getLearning = (state) =>
  state.merge({ isLoadingLearning: true, learningFailure: false })

export const getLearningSuccess = (state, { learning }) =>
  state.merge({ isLoadingLearning: false, learningFailure: false, learning })

export const getLearningFailure = (state) =>
  state.merge({ isLoadingLearning: false, learningFailure: true })

export const getActivityDetail = (state) =>
  state.merge({ isLoadingActivityDetail: true, isLoadingActivityDetailFailure: false })

export const getActivityDetailSuccess = (state, { activityDetail }) =>
  state.merge({ isLoadingActivityDetail: false, isLoadingActivityDetailFailure: false, activityDetail })

export const getActivityDetailFailure = (state) =>
  state.merge({ isLoadingActivityDetail: false, isLoadingActivityDetailFailure: true })

export const signOut = () => INITIAL_STATE

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_COURSES]: getCourses,
  [Types.GET_COURSES_SUCCESS]: getCoursesSuccess,
  [Types.GET_COURSES_FAILURE]: getCoursesFailure,
  [Types.GET_COURSE_MODULES]: getCourseModules,
  [Types.GET_COURSE_MODULES_SUCCESS]: getCourseModulesSuccess,
  [Types.GET_COURSE_MODULES_FAILURE]: getCourseModulesFailure,
  [Types.GET_SUB_TOPICS]: getSubTopics,
  [Types.GET_SUB_TOPICS_SUCCESS]: getSubTopicsSuccess,
  [Types.GET_SUB_TOPICS_FAILURE]: getSubTopicsFailure,
  [Types.GET_TOPIC_ACTIVITIES]: getTopicActivities,
  [Types.GET_TOPIC_ACTIVITIES_SUCCESS]: getTopicActivitiesSuccess,
  [Types.GET_TOPIC_ACTIVITIES_FAILURE]: getTopicActivitiesFailure,
  [Types.GET_ACTIVITY_SUCCESS]: getActivitySuccess,
  [Types.GET_ACTIVITY_FAILURE]: getActivityFailure,
  [Types.GET_ACTIVITY_CHILD_SUCCESS]: getActivityChildSuccess,
  [Types.COMPLETE_ACTIVITY_SUCCESS]: completeActivitySuccess,
  [Types.COMPLETE_ACTIVITY_FAILURE]: completeActivityFailure,
  [Types.REGISTER_ACTIVITY_SUCCESS]: registerActivitySuccess,
  [Types.REGISTER_ACTIVITY_FAILURE]: registerActivityFailure,
  [Types.REMOVE_ACTIVITY]: removeActivity,
  [Types.GET_LEARNING]: getLearning,
  [Types.GET_LEARNING_SUCCESS]: getLearningSuccess,
  [Types.GET_LEARNING_FAILURE]: getLearningFailure,
  [Types.GET_ACTIVITY_DETAIL]: getActivityDetail,
  [Types.GET_ACTIVITY_DETAIL_SUCCESS]: getActivityDetailSuccess,
  [Types.GET_ACTIVITY_DETAIL_FAILURE]: getActivityDetailFailure,
  [Types.SIGN_OUT]: signOut,
})
