import apisauce from 'apisauce'
import Config from 'react-native-config'
import { addParam } from '@utils/UrlUtils'
import { formatYYYYMMDD } from '@utils/CommonUtils'
import { Constants } from '@resources'

const create = () => {
  const api = apisauce.create({
    baseURL: `${Config.PROXY_BASE_URL}/proxy/cheil`,
  })

  const setConfiguration = (useProxy, baseUrl, appKey) => {
    if (useProxy) {
      api.setHeader('x-host', baseUrl)
      api.setHeader('x-elite-appkey', appKey)
    } else {
      api.setBaseURL(baseUrl)
    }
  }

  const getRewards = ({ page }, headers) => {
    let url = '/v1/rewards'
    if (page) {
      url = addParam(url, 'page', page)
    }
    return api.get(url, null, { headers })
  }

  const getPoints = (headers) => {
    return api.get('/v1/points', null, { headers })
  }

  const getRewardDetailById = ({ rewardId }, headers) => {
    return api.get(`/v1/rewards/${rewardId}`, null, { headers })
  }

  const postRewardParticipation = ({ rewardId, quantity }, headers) => {
    return api.post(`/v1/rewards/${rewardId}/participations`, { quantity }, { headers })
  }

  const getLeaderboards = ({ period, pageNumber, filter, filterId }, headers) => {
    let url = '/v1/leader-boards'
    if (period) {
      url = addParam(url, 'period', period)
    }
    if (pageNumber) {
      url = addParam(url, 'page', pageNumber)
    }
    if (filter) {
      url = addParam(url, 'filter', filter)
    }
    if (filterId) {
      url = addParam(url, 'filterId', filterId)
    }
    return api.get(url, null, { headers })
  }

  const postPoints = (body, headers) => {
    return api.post('/v1/points', body, { headers })
  }

  const postActivity = (body, headers) => {
    return api.post('/v1/activities', body, { headers })
  }

  const getCheilSummary = (headers) => {
    return api.get(`/v1/users/summary`, null, { headers })
  }

  const getWeeklyActivations = (headers) => {
    let url = '/v1/s-pay/history'
    const currentTime = new Date()
    const ONE_DAY_MILLISECONDS = 86400000
    const endDate = formatYYYYMMDD(currentTime)
    const startDate = formatYYYYMMDD(new Date(currentTime.getTime() - (currentTime.getDay() + 6) % 7 * ONE_DAY_MILLISECONDS))
    url = addParam(url, 'endDate', endDate)
    url = addParam(url, 'startDate', startDate)
    url = addParam(url, 'type', Constants.SPAY_HISTORY_TYPE.CODE_ENTERED)
    return api.get(url, null, { headers })
  }

  const getUsers = ({ page, query }, headers) => {
    let url = '/v1/users'
    if (page) {
      url = addParam(url, 'page', page)
    }
    if (query) {
      url = addParam(url, 'query', query)
    }
    return api.get(url, null, { headers })
  }

  const getSpotRewards = ({ page }, headers) => {
    let url = '/v1/spot-rewards'
    if (page) {
      url = addParam(url, 'page', page)
    }
    return api.get(url, null, { headers })
  }

  const postSpotRewards = ({ spotRewardId, recipientId, comment }, headers) => {
    let url = `/v1/spot-rewards/${spotRewardId}/payments`
    let body = { recipientId, comment }
    return api.post(url, body, { headers })
  }
  const getTransactionHistory = ({ category, page }, headers) => {
    let url = '/v1/points/history'
    if (category) {
      url = addParam(url, 'category', category)
    }
    if (page) {
      url = addParam(url, 'page', page)
    }
    return api.get(url, null, { headers })
  }

  //Activity history application status inquiry API by campaign
  const getActivities = (headers) => {
    return api.get('/v1/activities', null, { headers })
  }

  const getSalesTracking = ({campaignId,filter,period, pageNumber}, headers) => {
    let url = `/v1/sales/campaign/${campaignId}/${filter}`
    return api.get(url, null, {headers})
  }

  // Get advocate info by advocate id.
  const getIMEIStatus = (headers) => {
    let url = '/v1/imei-status';
    return api.get(url, null, { headers });
  }

  // Get advocate devices by user id.
  const getAdvocateDevices = ({ advocateId }, headers) => {
    let url = `/v1/pro-devices/${advocateId}`;
    return api.get(url, null, { headers });
  }

  // Get advocate device history by user id and device id.
  const getAdvocateDeviceHistory = ({ advocateId, deviceId }, headers) => {
    let url = `v1/pro-devices/${advocateId}/history/${deviceId}`;
    return api.get(url, null, { headers });
  }

  // Update Advocate Status
  const updateAdvocateStatus = ({ advocateId, deviceId, statusId, deviceImei }, headers) => {
    let url = `v1/pro-devices/${advocateId}`;
    let body = {
      "deviceId": deviceId,
      "statusId": statusId,
      "deviceImei": deviceImei
    };
    return api.post(url, body, { headers });
  }

  const getSalesTrackingCampaign = ({period, pageNumber}, headers) => {
    let url = '/v1/sales/campaign'
    if (period) {
      url = addParam(url, 'period', period)
    }
    if (pageNumber) {
      url = addParam(url, 'page', pageNumber)
    }
    return api.get(url, null, {headers})
  }

  return {
    setConfiguration,
    getRewards,
    getPoints,
    getRewardDetailById,
    postRewardParticipation,
    getLeaderboards,
    postPoints,
    getCheilSummary,
    getWeeklyActivations,
    getUsers,
    getSpotRewards,
    postSpotRewards,
    getActivities,
    postActivity,
    getTransactionHistory,
    getSalesTracking,
    getIMEIStatus,
    getAdvocateDevices,
    getAdvocateDeviceHistory,
    updateAdvocateStatus,
    getSalesTrackingCampaign
  }
}

export default {
  create
}
