import {
    Linking,
    PermissionsAndroid,
    Platform,
} from 'react-native'
import AndroidOpenSettings from 'react-native-android-open-settings'
import qs from 'querystringify'
import RNExitApp from 'react-native-exit-app'
import RNFetchBlob from 'rn-fetch-blob'
import Url from 'url-parse'
import { isEmpty } from '@utils/TextUtils'
import { checkOrRequestPermission } from '@utils/PermissionUtils'
import { Constants } from '@resources'
import NavigationService from '@services/NavigationService'
import ToastMessage from '@components/ToastMessage'
import I18n from '@i18n'

export function open(event) {
    if (!event || isEmpty(event.url)) return

    var { url, headerTitle } = event
    if (url === 'about:blank') {
        return true
    } else if (url.startsWith(Constants.DEEPLINK_PREFIX)) {
        url = url.replace(Constants.DEEPLINK_PREFIX, Constants.APP_SCHEME)
    }

    const urlToOpen = new Url(url)
    const {
        origin,
        hash,
    } = urlToOpen
    switch (origin) {
        case Constants.OPEN_EXTERNAL:
            openURL(hash.substring(Constants.HASH_URL.length))
            break

        case Constants.OPEN_WEBVIEW:
            openInAppBrowser(hash.substring(Constants.HASH_URL.length))
            break

        case Constants.OPEN_SCREEN:
            const screenParams = hash.replace('#', '')
            const screenAndParam = screenParams.split("?")
            const screenData = screenAndParam.length > 0 && qs.parse(screenAndParam[0])
            const params = screenAndParam.length > 1 && qs.parse(screenAndParam[1])
            NavigationService.navigate(screenData.screen, params)
            break

        default:
            if (url.match(Constants.URL_PATTERN)) {
                if (!url.startsWith(Constants.APP_SCHEME)) {
                    openInAppBrowser(url, headerTitle)
                }
            }
            break
    }
}

export const openInAppBrowser = (url, headerTitle) => {
    Linking.canOpenURL(url).then(supported => {
        if (supported) {
            NavigationService.navigate('InAppBrowserScreen', { url, headerTitle })
        } else {
            console.log('Can\'t handle url:', url)
        }
    })
        .catch(err => console.log('An error occurred', err))
}

const openURL = (urlToOpen) => {
    Linking.canOpenURL(urlToOpen).then(supported => {
        if (!supported) {
            console.log('Can\'t handle the url:', urlToOpen)
        } else {
            return Linking.openURL(urlToOpen)
                .catch(error => console.log('Error opening the url: ', error))
        }
    }).catch(err => console.log('An error occurred', err))
}

const openSettings = () => {
    if (Platform.OS === 'android') {
        AndroidOpenSettings.wirelessSettings();
    } else {
        openURL('App-prefs:root=WIFI')
    }
}

const openStoreApp = () => {
    let storeURL = Platform.OS === 'android' ? Constants.STORE_URLS.PLAY_STORE : Constants.STORE_URLS.APP_STORE
    openURL(storeURL)
}

const closeEliteApp = () => {
    RNExitApp.exitApp()
}

export function sendEmail(to, subject) {
    // Create email link query
    const query = qs.stringify({
        subject: subject,
    }, true);

    return openURL(`mailto:${to}${query}`)
}

export async function downloadFile(sourceObj, options, loadingHandler) {
    if (Platform.OS === 'android') {
        const urlToDownload = sourceObj.uri
        const opts = Object.assign({
            showNotification: true,    // by default a notification is shown when download is complete
            saveToDevice: true,        // by default the file is downloaded to a user accessible folder
            overwrite: false,          // by default we don't overwrite an existing file
            fileCache: true,
        }, options)

        let rationale = {
            title: I18n.t('rationale.read_write_title'),
            message: I18n.t('rationale.read_write_message'),
            buttonNeutral: I18n.t('rationale.ask_me_later'),
            buttonNegative: I18n.t('rationale.cancel'),
            buttonPositive: I18n.t('rationale.ok'),
        }

        const readGranted = await checkOrRequestPermission(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, rationale)
        if (!readGranted) {
            loadingHandler && loadingHandler(false)
            return false
        }
        const writeGranted = await checkOrRequestPermission(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, rationale)
        if (!writeGranted) {
            loadingHandler && loadingHandler(false)
            return false
        }

        const dirs = RNFetchBlob.fs.dirs
        let dir = dirs.DownloadDir
        const DIR_PATH = `${dir}${'/'}${I18n.t('app.app_name')}`
        let fileName = `${'elite_'}${new Date().getTime()}${'.'}${sourceObj.extension}`
        let path = `${DIR_PATH}${'/'}${fileName}`

        RNFetchBlob.fs.mkdir(DIR_PATH)
            .catch((err) => {
                console.log("Can't create dir/or already exists")
            })

        const fetchConfig = {
            path,
            overwrite: opts.overwrite
        }

        if (opts.showNotification && opts.saveToDevice) {
            fetchConfig.addAndroidDownloads = {
                useDownloadManager: true,
                path,
                title: fileName,
                description: urlToDownload,
                mediaScannable: true,
                notification: true,
            }
        }

        return RNFetchBlob
            .config(fetchConfig)
            .fetch('GET', sourceObj.uri, sourceObj.headers)
            .then(response => {
                return response.path()
            })
            .catch((error, statusCode) => {
                console.log(`${'Error downloading: '} ${urlToDownload} ${'Error'} - ${error} ${'StatusCode='}${statusCode}`)
                return statusCode
            })
    }
}

export const openPhoneApp = phoneNumber => {
    return openURL(`tel:${phoneNumber}`);
}

export const openMessageApp = (phoneNumber, body) => {
    if (!phoneNumber) {
        return
    }
    return openURL(`sms:${phoneNumber}${Platform.OS === "ios" ? "&" : "?"}body=${body}`);
}

export default {
    openSettings,
    openStoreApp,
    openURL,
    closeEliteApp
};

export function openActivityDetail(activity, headerTitle, sourceObj, cookiesObj, loadingHandler, onClose) {
    const {
        contentType,
        activityId,
        activityName,
        modalities,
        activityType,
    } = activity
    const modality = modalities && modalities.length > 0 ? modalities[0] : ''

    switch (modality) {
        case Constants.MODALITY_FILTERS.ARTICLES:
            NavigationService.navigate('ArticleDetailScreen', { activityId, headerTitle })
            return

        case Constants.MODALITY_FILTERS.ACTIVITY:
            switch (contentType) {
                case Constants.CONTENT_TYPES.CAROUSEL:
                    NavigationService.navigate('CarouselDetailScreen', { activityId, activityName })
                    return

                case Constants.CONTENT_TYPES.HYBRID:
                    NavigationService.navigate('HybridActivityScreen', { activityId, activityName })
                    return

                case Constants.CONTENT_TYPES.POLL:
                    NavigationService.navigate('PollScreen', { activityId, activityName })
                    return

                case Constants.CONTENT_TYPES.QUIZ:
                    NavigationService.navigate('AssessmentQuestionScreen', { activityId, activityName })
                    return

                case Constants.CONTENT_TYPES.SURVEY:
                    NavigationService.navigate('SurveyScreen', { activityId, activityName })
                    return

                case Constants.CONTENT_TYPES.VIDEO:
                    NavigationService.navigate('VideoActivityScreen', { activityId, activityName })
                    return
            }
            break

        case Constants.MODALITY_FILTERS.COURSES:
            switch (contentType) {
                case Constants.CONTENT_TYPES.SCORM:
                    NavigationService.navigate('ScormScreen', { activityId })
                    return

                default:
                    NavigationService.navigate('CourseDetailScreen', { activityId })
                    return
            }

        default:
            switch (activityType) {
                case Constants.ACTIVITY_TYPES.ARTICLE:
                case Constants.ACTIVITY_TYPES.FAQ:
                case Constants.ACTIVITY_TYPES.GAME:
                case Constants.ACTIVITY_TYPES.PROMO:
                    NavigationService.navigate('ArticleDetailScreen', { activityId, headerTitle })
                    return
            }

            switch (contentType) {
                case Constants.CONTENT_TYPES.VIDEO:
                    NavigationService.navigate('VideoScreen', { activityId, activityName, activityType, contentType, headerTitle, sourceObj, cookiesObj, onClose })
                    return

                case Constants.CONTENT_TYPES.PDF:
                case Constants.CONTENT_TYPES.DOCUMENT:
                    if (Platform.OS === 'android') {
                        if (!sourceObj.extension) {
                            ToastMessage(I18n.t('generic_error.unsupported_content'))
                            return
                        }
                        loadingHandler && loadingHandler(true)
                        downloadFile(sourceObj).then(response => {
                            if (response) {
                                sourceObj = {
                                    uri: response
                                }
                            } else if (response === false) {
                                loadingHandler && loadingHandler(false)
                                return
                            }
                            loadingHandler && loadingHandler(false)
                            NavigationService.navigate('InAppBrowserScreen', { activityType, contentType, headerTitle, sourceObj, cookiesObj, onClose })
                        }).catch(error => {
                            loadingHandler && loadingHandler(false)
                            ToastMessage(I18n.t('generic_error.unsupported_content'))
                        })
                    } else {
                        NavigationService.navigate('InAppBrowserScreen', { activityType, contentType, headerTitle, sourceObj, cookiesObj, onClose })
                    }
                    return

                case Constants.CONTENT_TYPES.PHOTO:
                    NavigationService.navigate('InAppBrowserScreen', { sourceObj })
                    return
            }
    }

    ToastMessage(I18n.t('generic_error.unsupported_content'))
    loadingHandler && loadingHandler(false)
}