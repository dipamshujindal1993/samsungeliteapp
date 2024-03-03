import { Constants } from '@resources'

export default {
  setConfiguration: () => {
    return {
      ok: true,
    }
  },

  getAccessToken: () => {
    return {
      ok: true,
      data: require('../Fixtures/accessTokenByClientCredentials.json')
    }
  },

  getStores: () => {
    return {
      ok: true,
      data: require('../Fixtures/stores.json')
    }
  },

  getRoles: () => {
    return {
      ok: true,
      data: require('../Fixtures/roles.json')
    }
  },

  getUserAudiences: () => {
    return {
      ok: true,
      data: require('../Fixtures/userAudiences.json')
    }
  },

  getUserSummary: () => {
    return {
      ok: true,
      data: require('../Fixtures/userSummary.json')
    }
  },

  updateUserSummary: () => {
    return {
      ok: true,
      data: require('../Fixtures/userSummary.json')
    }
  },

  getRewards: (params) => {
    const { page } = params
    const rewardsList = require('../Fixtures/rewardsList.json')
    const rewardsData = rewardsList.content
    return {
      ok: true,
      data: {
        "pagination": {
          "page": page,
          "pageSize": 10,
          "totalCount": rewardsData.length,
          "totalPageCount":  Math.ceil(rewardsData.length / 10)
        },
        "content": rewardsData.slice((page - 1) * 10, page * 10)
      }
    }
  },

  getPoints: () => {
    return {
      ok: true,
      data: require('../Fixtures/points.json')
    }
  },

  getRewardDetailById: (params) => {
    const { rewardId } = params
    const rewardsList = require('../Fixtures/rewardsList.json')
    const listContent = rewardsList.content
    const selectedReward = listContent.find(item => item.rewardId === rewardId)
    // eligible for even, ineligable for odd
    const eligible = rewardId % 2 === 0
    switch (selectedReward.type) {
      case Constants.REWARD_TYPES.REDEMPTION:
        const dataRedemption = require('../Fixtures/rewardDetail1.json')
        return {
          ok: true,
          data: { ...dataRedemption, ...{ rewardId: rewardId, title: 'REDEMPTION ' + rewardId }, ...{ status: eligible ? 'CLOSED' : 'PENDING' } }
        }
      case Constants.REWARD_TYPES.SWEEPSTAKES:
        const dataSweepstakes = require('../Fixtures/rewardDetail2.json')
        return {
          ok: true,
          data: { ...dataSweepstakes, ...{ rewardId: rewardId, title: 'SWEEPSTAKES ' + rewardId }, ...{ status: eligible ? 'CLOSED' : 'PENDING' } }
        }
      case Constants.REWARD_TYPES.INSTANT_WHEEL:
        const dataInstantWin = require('../Fixtures/rewardDetail3.json')
        return {
          ok: true,
          data: { ...dataInstantWin, ...{ rewardId: rewardId } }
        }
      default:
        return {
          ok: false,
          data: null
        }
    }
  },

  postRewardParticipation: (params) => {
    switch (params.rewardId) {
      case 1:
        return {
          ok: true,
          data: require('../Fixtures/rewardParticipationResult1.json')
        }
      case 2:
        return {
          ok: true,
          data: require('../Fixtures/rewardParticipationResult2.json')
        }
      case 3:
        // Have 1/5 chance for each of the prizes, 2/5 chance lose, change if needed
        // Prize 1 and 2 are products, Prize 3 is points
        const returnNumber = Math.floor(Math.random() * 5)
        switch (returnNumber) {
          case 1:
            return {
              ok: true,
              data: require('../Fixtures/rewardParticipationResult3_prize1.json')
            }
          case 2:
            return {
              ok: true,
              data: require('../Fixtures/rewardParticipationResult3_prize2.json')
            }
          case 3:
            return {
              ok: true,
              data: require('../Fixtures/rewardParticipationResult3_prize3.json')
            }
          default:
            return {
              ok: true,
              data: require('../Fixtures/rewardParticipationResult3_lose.json')
            }
        }
      default:
        return {
          ok: false,
          data: null
        }
    }
  },

  getActivity: (params) => {
    switch (params.activityId) {
      case 88404:
        return {
          ok: true,
          data: require('../Fixtures/activityDetail.json')
        }
      case 37378:
        return {
          ok: true,
          data: require('../Fixtures/activityDetailSurvey.json')
        }
      case 37372:
      case 37373:
        return {
          ok: true,
          data: require('../Fixtures/activityDetailPoll.json')
        }

      default:
        return {
          ok: true,
          data: require('../Fixtures/activityDetail.json')
        }
    }
  },

  getActivityChild: () => {
    return {
      ok: true,
      data: require('../Fixtures/carouselActivities.json')
    }
  },

  registerActivity: () => {
    return {
      ok: true,
      data: require('../Fixtures/registerActivity.json')
    }
  },

  completeActivity: () => {
    return {
      ok: true,
      data: require('../Fixtures/completeCarouselActivity.json')
    }
  },

  postPoints: () => {
    return {
      ok: true,
      data: require('../Fixtures/points.json')
    }
  },

  getCommunities: () => {
    return {
      ok: true,
      data: require('../Fixtures/communitiesList.json')
    }
  },

  getCommunityPost: () => {
    return {
      ok: true,
      data: require('../Fixtures/communityPostList.json')
    }
  },

  getPostDetail: () => {
    return {
      ok: true,
      data: require('../Fixtures/postDetail.json')
    }
  },

  getCourses: (params) => {
    switch (params.activityType) {
      case 'Game':
        return {
          ok: true,
          data: require('../Fixtures/getGames.json')
        }
      case 'Activities':
        return {
          ok: true,
          data: require('../Fixtures/learnerActivities.json')
        }
      default:
        return {
          ok: true,
          data: require('../Fixtures/courses.json')
        }
    }
  },

  getCourseModules: () => {
    return {
      ok: true,
      data:  require('../Fixtures/carouselActivities.json')
    }
  },

  getSubTopics: () => {
    return {
      ok: true,
      data: require('../Fixtures/subTopics.json')
    }
  },

  getTopicActivities: () => {
    return {
      ok: true,
      data: require('../Fixtures/topicActivities.json')
    }
  },

  getAssessmentQuestions: (params) => {
    switch (params.assessmentId) {
      case 37353:
        return {
          ok: true,
          data: require('../Fixtures/AssessmentQuestions.json')
        }
      case 37352:
        return {
          ok: true,
          data: require('../Fixtures/AssessmentQuestions1.json')
        }
      case 37378 || 88404:
        return {
          ok: true,
          data: require('../Fixtures/survey.json')
        }
      case 37372:
        return {
          ok: true,
          data: require('../Fixtures/pollSingleSelect.json')
        }
      case 37373:
        return {
          ok: true,
          data: require('../Fixtures/pollMultiSelect.json')
        }
    }
  },

  getAssessmentQuestion: (params) => {
    switch (params.questionId) {
      case "42019":
      case "42020":
      case "42029":
        return {
          ok: true,
          data: require('../Fixtures/multiChoiceQuestions.json')
        }
      case "42018":
        return {
          ok: true,
          data: require('../Fixtures/trueFalseQuestions.json')
        }
      case "42021":
      case "42030":
        return {
          ok: true,
          data: require('../Fixtures/multiSelectQuestion.json')
        }
      case "42031":
        return {
          ok: true,
          data: require('../Fixtures/descriptiveQuestion.json')
        }
      case "42032":
        return {
          ok: true,
          data: require('../Fixtures/rankingQuestion.json')
        }

      default:
        return {
          ok: false,
          data: null
        }
    }
  },

  postAssessmentAnswer: () => {
    return {
      ok: true,
      data: require('../Fixtures/AssessmentAnswer.json')
    }
  },

  postSubmitAssessments: () => {
    return {
      ok: true,
      data: require('../Fixtures/submitAnswers.json')
    }
  },

  getPollSummary: (params) => {
    switch (params.pollId) {
      case 37372:
        return {
          ok: true,
          data: require('../Fixtures/pollSingleSelectSummary.json')
        }
      case 37373:
        return {
          ok: true,
          data: require('../Fixtures/pollMultiSelectSummary.json')
        }
    }
  },

  getLeaderboards: () => {
    return {
      ok: true,
      data: require('../Fixtures/leaderList.json')
    }
  },

  getCheilSummary: () => {
    return {
      ok: true,
      data: require('../Fixtures/cheilSummary.json')
    }
  },

  getOrganizationDetail: () => {
    return {
      ok: true,
      data: require('../Fixtures/organizationDetail.json')
    }
  },

  getBanners: (params) => {
    switch (params.pageNumber) {
      case 0:
        return {
          ok: true,
          data: require('../Fixtures/newsBannersPage0.json')
        }
      case 1:
        return {
          ok: true,
          data: require('../Fixtures/newsBannersPage1.json')
        }
      case 2:
        return {
          ok: true,
          data: require('../Fixtures/newsBannersPage2.json')
        }
      default:
        return {
          ok: true,
          data: require('../Fixtures/newsBannersPageEmpty.json')
        }
    }
  },

  getNotifications: (params) => {
    switch (params.pageNumber) {
      case 0:
        return {
          ok: true,
          data: require('../Fixtures/notifications0.json')
        }
      case 1:
        return {
          ok: true,
          data: require('../Fixtures/notifications1.json')
        }
      case 2:
        return {
          ok: true,
          data: require('../Fixtures/notifications2.json')
        }
      default:
        return {
          ok: true,
          data: require('../Fixtures/notificationsEmpty.json')
        }
    }
  },

  clearNotifications: () => {
    return {
      ok: true,
    }
  },

  getUnreadNotificationsCount: () => {
    return {
      ok: true,
      data: require('../Fixtures/unreadNotificationsCount.json')
    }
  },

  markNotificationAsRead: () => {
    return {
      ok: true
    }
  },

  markNotificationsAsRead: () => {
    return {
      ok: true
    }
  },

  getTaskDetails: (params) => {
    const { isMission } = params
    return {
      ok: true,
      data: isMission ? require('../Fixtures/MissionDetail.json') : require('../Fixtures/TaskDetail.json')
    }
  },

  healthcheck: () => {
    return {
      ok: true,
      data: require('../Fixtures/healthcheck.json')
    }
  },

  getSearchSuggestions: (params) => {
    return {
      ok: true,
      data: require('../Fixtures/searchSuggestions.json')
    }
  },

  likeCommunityCommentPost: () => {
    return {
      ok: true,
      data: require('../Fixtures/postDetailsCommentLike.json')
    }
  },


  getPostCommentList: () => {
    return {
      ok: true,
      data: require('../Fixtures/commentsDetail.json')
    }
  },

  likeCommunityPost: () => {
    return {
      ok: true,
      data: require('../Fixtures/postDetailLike.json')
    }
  },

  getTnc: () => {
    return {
      ok: true,
      data: require('../Fixtures/termsConditions.json')
    }
  },

  getGamificationOverview: () => {
    return {
      ok: true,
      data: require('../Fixtures/gamificationOverview.json')
    }
  },

  getUsers: (params) => {
    const { page, query } = params
    const data = require('../Fixtures/repUsers.json')
    let content
    if (query) {
      content = data.content.filter(item => {
        return item.fullName.toLowerCase().includes(query.toLowerCase()) || item.email.toLowerCase().includes(query.toLowerCase()) || item.repCode.includes(query)
      })
    } else {
      content = data.content
    }
    if (page) {
      const slicedContent = content.slice((page - 1) * 10, (page * 10))
      return {
        ok: true,
        data: {
          "pagination": {
            "page": page,
            "pageSize": 10,
            "totalCount": content.length,
            "totalPageCount": Math.ceil(data.content.length / 10)
          },
          "content": slicedContent
        }
      }
    } else {
      return {
        ok: true,
        data: data
      }
    }
  },

  getSpotRewards: (params) => {
    const { page } = params
    const data = require('../Fixtures/spotRewardsList.json')
    const slicedContent = data.content.slice((page - 1) * 10, (page * 10))
    return {
      ok: true,
      data: {
        "pagination": {
          "page": page,
          "pageSize": 10,
          "totalCount": data.pagination.totalCount,
          "totalPageCount": Math.ceil(data.content.length / 10)
        },
        "content": slicedContent
      }
    }
  },

  postSpotRewards: () => {
    return {
      ok: true,
    }
  },

  //Cheil api
  getActivities: () => {
    return {
      ok: true,
      data: require('../Fixtures/activities.json')
    }
  },

  getWeeklyActivations: () => {
    return {
      ok: true,
      data: require('../Fixtures/spayHistory.json')
    }
  },

  getTransactionHistory: (params) => {
    const { category, page } = params
    const rawData = require('../Fixtures/transactionHistory.json')
    const categoryNames = category.split(',')
    const categoryData = rawData.filter(item => {
      for (let categoryName of categoryNames) {
        if (item.category === categoryName) {
          return true
        }
      }
    })
    const returnData = categoryData.slice((page - 1) * 10, page * 10)
    return {
      ok: true,
      data: {
        pagination: {
          "page": page,
          "pageSize": 10,
          "totalCount": categoryData.length,
          "totalPageCount": Math.ceil(categoryData / 10)
        },
        content: returnData
      }
    }
  },

  getSalesTracking: () => {
    return {
      ok: true,
      data: require('../Fixtures/salesTracking')
    }
  },

  getIMEIStatus: () => {
    return {
      ok: true,
      data: require('../Fixtures/imeiStatus.json')
    }
  },

  getAdvocateInfo: () => {
    return {
      ok: true,
      data: require('../Fixtures/advocateInfo.json')
    }
  },

  getAdvocateDevices: () => {
    return {
      ok: true,
      data: require('../Fixtures/advocateDevices.json')
    }
  },

  getAdvocateDeviceHistory: () => {
    return {
      ok: true,
      data: require('../Fixtures/advocateDeviceHistory.json')
    }
  },

  updateAdvocateStatus: () => {
    return {
      ok: true,
    }
  },

  getSpotReward: (params) => {
    return {
      ok: true,
      data: require('../Fixtures/spotReward.json')
    }
  },

  getSalesTrackingCampaign(){
    return {
      ok: true,
      data: require('../Fixtures/salesTrackingCampaign')
    }
  },

  getLeads: () => {
    return {
      ok: true,
      data: require('../Fixtures/leads.json')
    }
  },

  getLeadsResolutions: () => {
    return {
      ok: true,
      data: require('../Fixtures/leadsResolutions.json')
    }
  },

  getLeadStatus: () => {
    return {
      ok: true,
      data: require('../Fixtures/leadsStatus.json')
    }
  },

  getLeadDetail: () => {
    return {
      ok: true,
      data: require('../Fixtures/leadDetail.json')
    }
  }
}
