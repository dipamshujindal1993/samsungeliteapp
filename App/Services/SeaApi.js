import apisauce from 'apisauce'
import Config from 'react-native-config'

import { addParam } from '@utils/UrlUtils'

const create = (baseURL = Config.PROXY_BASE_URL) => {
    const api = apisauce.create({
        baseURL,
    })

    const setConfiguration = (appKey) => {
        api.setHeader('x-elite-appkey', appKey)
    }

    const healthcheck = (headers) => {
        return api.get('/api/v1/healthcheck', null, { headers })
    }

    const checkExists = (params, headers) => {
        return api.get('/api/v1/user/exists', params, { headers })
    }

    const signUp = (data, headers) => {
        return api.post('/api/v1/auth/user/register', data, { headers })
    }

    const getAccessToken = (data, headers) => {
        return api.post('/api/v1/auth/user/token', data, { headers })
    }

    const refreshToken = (data, headers) => {
        return api.post('/api/v1/auth/user/token/refresh', data, { headers })
    }

    const getUserSummary = ({ userId }, headers) => {
        return api.get(`/api/v1/user/${userId}`, null, { headers })
    }

    const updateUserSummary = ({ userId, body }, headers) => {
        return api.patch(`/api/v1/user/${userId}`, body, { headers })
    }

    const requestOTP = (data, headers) => {
        return api.post('/api/v1/user/otp', data, { headers })
    }

    const verifyOTP = (data, headers) => {
        return api.put('/api/v1/user/otp/verify', data, { headers })
    }

    const updatePassword = (data, headers) => {
        return api.put('/api/v1/user/password', data, { headers })
    }

    const getTnc = (data, headers) => {
        return api.get('/api/v1/tnc', data, { headers })
    }

    const getNotifications = ({ isTasks, pageNumber, userId }, headers) => {
        const type = isTasks ? 'task' : 'notification'
        return api.get(`/api/v1/user/${userId}/notification?type=${type}&page=${pageNumber + 1}`, null, { headers })
    }

    const clearNotifications = ({ isTasks, userId }, headers) => {
        const type = isTasks ? 'task' : 'notification'
        return api.delete(`/api/v1/user/${userId}/notification?type=${type}`, null, { headers })
    }

    const getUnreadNotificationsCount = ({ userId }, headers) => {
        return api.get(`/api/v1/user/${userId}/notification/unread/count`, null, { headers })
    }

    const markNotificationAsRead = ({ id, userId }, headers) => {
        return api.put(`/api/v1/user/${userId}/notification/${id}/read`, null, { headers })
    }

    const markNotificationsAsRead = ({ userId, body }, headers) => {
        return api.put(`/api/v1/user/${userId}/notification/read`, body, { headers })
    }

    const registerDevice = ({ userId, body }, headers) => {
        return api.post(`/api/v1/user/${userId}/device`, body, { headers })
    }

    const updateDevice = ({ userId, deviceId, device }, headers) => {
        return api.put(`/api/v1/user/${userId}/device/${deviceId}`, device, { headers })
    }

    const deleteDevice = ({ userId, deviceId }, headers) => {
        return api.delete(`/api/v1/user/${userId}/device/${deviceId}`, null, { headers })
    }

    const sendFeedbackFormRequest = (data, headers) => {
        let url = `/api/v1/user/${data.id}/feedback`
        return api.post(url, data.form, { headers })
    }

    const getSpotReward = ({ userId, from }, headers) => {
        let url = `/api/v1/user/${userId}/notification?read=false&events=fsm_spot_reward`
        if (from) {
            url = addParam(url, 'from', from)
        }
        return api.get(url, null, { headers })
    }

    const getLeads = (data, headers) => {
        let url = `api/v1/leadgen/leads?page=${data.page}`
        return api.post(url, data.body, { headers })
    }

    const getLeadsResolutions = (headers) => {
        return api.get('/api/v1/leadgen/resolutions', null, { headers })
    }

    const getLeadStatus = (headers) => {
        return api.get('/api/v1/leadgen/status', null, { headers })
    }

    const getLeadDetail = ({ leadID }, headers) => {
        return api.get(`/api/v1/leadgen/lead/${leadID}`, null, { headers })
    }

    const updateLeadStatus = (data, headers) => {
        let url = '/api/v1/leadgen/lead/status'
        return api.put(url, data.form, { headers })
    }

    const checkGeofence = ({ userId, latitude, longitude, radius }, headers) => {
        return api.get(`/api/v1/user/${userId}/geofence`, { latitude, longitude, radius }, { headers })
    }

    const getChannels = ({ userId }, headers) => {
        return api.get(`/api/v1/user/${userId}/multichannel/profile/list`, null, { headers })
    }

    const getChannel = ({ userId, channelId }, headers) => {
        return api.get(`/api/v1/user/${userId}/multichannel/profile/${channelId}/login`, null, { headers })
    }

    return {
        setConfiguration,
        healthcheck,
        checkExists,
        signUp,
        getAccessToken,
        refreshToken,
        getUserSummary,
        updateUserSummary,
        requestOTP,
        verifyOTP,
        updatePassword,
        getTnc,
        getNotifications,
        clearNotifications,
        getUnreadNotificationsCount,
        markNotificationAsRead,
        markNotificationsAsRead,
        registerDevice,
        updateDevice,
        deleteDevice,
        sendFeedbackFormRequest,
        getSpotReward,
        getLeadsResolutions,
        getLeadStatus,
        getLeadDetail,
        getLeads,
        updateLeadStatus,
        checkGeofence,
        getChannels,
        getChannel,
    }
}

export default {
    create
}