import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, Platform, Alert } from 'react-native';
import Url from 'url-parse'
import ImageEx from '@components/ImageEx'
import ContentHtml from '@components/ContentHtml'
import Dialog from '@components/Dialog';
import LoadingSpinner from '@components/LoadingSpinner'
import HeaderTitle from '@components/HeaderTitle'
import ToastMessage from '@components/ToastMessage'
import ErrorScreen from '@containers/ErrorScreen'
import styles from './Styles/TaskAndMissionDetailScreenStyles';
import { Constants, Colors } from '@resources'
import CommentIcon from '@svg/icon_text_chat.svg'
import CourseIcon from '@svg/icon_features.svg'
import IconComplete from '@svg/icon_complete.svg'
import UploadIcon from '@svg/icon_upload.svg'
import LearnIcon from '@svg/icon_skills'
import { connect } from 'react-redux'
import ImagePicker from 'react-native-image-picker';
import {
    PERMISSIONS,
    RESULTS,
    check,
    request,
    openSettings
} from 'react-native-permissions';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob'
import NotificationsActions from '@redux/NotificationsRedux';
import AppActions from '@redux/AppRedux'
import I18n from '@i18n'
import { formatAMPM, formatYYYYMMDD } from '@utils/DateUtils'
import { addParam } from '@utils/UrlUtils'
import { getFileSizeString, getFileSizeInMBFromByte } from '@utils/CommonUtils'
import DocumentPicker from 'react-native-document-picker';
import { openActivityDetail } from '@services/LinkHandler'
import { open } from '@services/LinkHandler'

class TaskAndMissionDetailScreen extends Component {

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        const isMission = params ? params.isMission : false;
        return {
            headerTitle: () => <HeaderTitle title={I18n.t(isMission ? 'missionDetails.title' : 'taskDetails.title')} />
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            showCompletionPopup: false,
            isLoading: true,
            data: null,
            showFilePickerPopup: false,
            showSizeValidationPopup: false
        }
    }

    componentDidMount() {
        this._getTaskDetails()
    }

    _getTaskDetails() {
        const { params } = this.props.navigation.state;
        this.isMission = params ? params.isMission : false;
        this.initiativeId = params ? params.initiativeId : null;
        this.props.getTaskDetails(this.isMission, this.initiativeId)
    }

    componentDidUpdate(prevProps) {
        const { missionDetails, taskDetails, uploadTaskFileFailure, markTaskAsCompleteSuccess } = this.props;
        if (this.isMission) {
            if (missionDetails != prevProps.missionDetails) {
                if (missionDetails) {
                    this.setState({
                        isLoading: false,
                        data: missionDetails.initiatives[0]
                    })
                }
            }
        } else {
            if (taskDetails != prevProps.taskDetails) {
                if (taskDetails) {
                    this.setState({
                        isLoading: false,
                        data: taskDetails.initiatives[0]
                    })
                }
            }
        }

        if (uploadTaskFileFailure != prevProps.uploadTaskFileFailure) {
            if (uploadTaskFileFailure) {
                ToastMessage(I18n.t('taskDetails.error_uploading'))
            }
        }

        if (markTaskAsCompleteSuccess && markTaskAsCompleteSuccess != prevProps.markTaskAsCompleteSuccess) {
            const { data } = this.state
            if (data) {
                const processStepGroups = data ? data.processStepGroups : null;
                const actions = processStepGroups ? processStepGroups[0] ? processStepGroups[0].processSteps : null : null;
                if (actions && actions.length > 0) {
                    let count = 0
                    actions.map((v, i) => {
                        if (v['stepStatus '] == 'Complete') {
                            count++
                        }
                    })
                    this.shouldPrompAppRating = count == actions.length
                }
            }
        }
    }

    async _getFile() {
        try {
            const res = await DocumentPicker.pick({
                type: [
                    DocumentPicker.types.images,
                    DocumentPicker.types.video,
                    DocumentPicker.types.pdf
                ],
            });
            setTimeout(() => {
                let url = res.uri
                const split = url.split('/');
                const name = split.pop();
                const inbox = split.pop();
                const realPath = Platform.OS == 'ios' ? `${RNFS.TemporaryDirectoryPath}${inbox}/${name}` : res.uri;
                this._uploadFile(realPath, res.name, res.type, res.size)
            }, 300);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }

    renderFilePickerDialog(){
        return(
            <Modal
                transparent
                hardwareAccelerated
                visible={this.state.showFilePickerPopup}
            >
                <TouchableWithoutFeedback onPress={() => this.setState({showFilePickerPopup : false})}>
                    <View style={styles.pickerBackground}>
                        <View style={styles.pickerView}>
                            <Text style={styles.galleryPickerTitle}>{I18n.t('taskDetails.select_a_file')}</Text>
                            <TouchableOpacity onPress={() => {this.fileSelectionType = "image";this.permissionHandler("camera")}}>
                                <Text style={styles.galleryPickerOption}>{I18n.t('taskDetails.take_a_photo')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {this.fileSelectionType = "video";this.permissionHandler("camera")}}>
                                <Text style={styles.galleryPickerOption}>{I18n.t('taskDetails.take_a_video')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.permissionHandler("gallery")}>
                                <Text style={styles.galleryPickerOption}>{I18n.t('taskDetails.select_file')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ showFilePickerPopup: false})}>
                                <Text style={[styles.galleryPickerCancel]}>{I18n.t('taskDetails.cancel')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    _uploadFile(uri, name, type, size) {
        if (getFileSizeInMBFromByte(size) > Constants.FILE_MAX_SIZE_TO_UPLOAD) {
            setTimeout(() => {
                this.setState({ showSizeValidationPopup: true })
            }, 200);
        } else {
            const { uploadTaskFile } = this.props;
            const file = {
                type,
                name,
                uri
            }
            uploadTaskFile(this.fileItemId, file, this.initiativeId, this.stepId, this.isMission)
        }
    }

    permissionHandler = (permissionFor) => {
        this.setState({ showFilePickerPopup: false })
        let selectedPermission = null
        if (permissionFor === 'gallery') {
            selectedPermission = Platform.select({
                android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
                ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
            })
        }

        if(permissionFor==='camera'){
            selectedPermission = Platform.select({
                android: PERMISSIONS.ANDROID.CAMERA,
                ios: PERMISSIONS.IOS.CAMERA,
            })
        }
        check(selectedPermission).then(result => {
            switch (result) {
                case RESULTS.UNAVAILABLE:
                    break;
                case RESULTS.DENIED:
                    if (selectedPermission === PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE || selectedPermission === PERMISSIONS.IOS.PHOTO_LIBRARY) {
                        request(selectedPermission).then(status => status === RESULTS.GRANTED && this.onGalleryPermissionGrant());
                    }
                    else{
                        request(selectedPermission).then(status => status===RESULTS.GRANTED && this.onCameraPermissionGrant());
                    }
                    break;
                case RESULTS.GRANTED:
                    if (selectedPermission === PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE || selectedPermission === PERMISSIONS.IOS.PHOTO_LIBRARY) {
                        this.onGalleryPermissionGrant()
                    }
                    else {
                        this.onCameraPermissionGrant()
                    }
                    break;
                case RESULTS.BLOCKED:
                    permissionFor==="gallery" ? 
                    this.showPermissionRationalAlert('create_post.write_storage_rationale_title','create_post.write_storage_rationale_message') : 
                    this.showPermissionRationalAlert('create_post.camera_rationale_title','create_post.camera_rationale_message')
                    break;
            }
        }).catch(error => {
            console.error("error", error)
        });
    }

    showPermissionRationalAlert(title, description) {
        Alert.alert(
            I18n.t(title),
            I18n.t(description),
            [
                {
                    text: I18n.t('create_post.rational_negative_cta'),
                },
                {
                    text: I18n.t('create_post.rational_positive_cta'),
                    onPress: () => this._openSetting(),
                },

            ],
            { cancelable: false },
        );
    }

    _openSetting = () => {
        openSettings().catch(() => console.error('cannot open settings'));
    }

    onGalleryPermissionGrant() {
        setTimeout(() => {
            this._getFile()
        }, 100)
    }

    onCameraPermissionGrant() {
        this.openCamera()
    }

    openCamera() {
        const options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            mediaType: this.fileSelectionType,
            videoQuality: 'low',
        };

        ImagePicker.launchCamera(options, (response) => {
            if (response.uri) {
                if (this.fileSelectionType == "video") {
                    RNFetchBlob.fs.stat(response.uri)
                        .then((stats) => {
                            const fileName = stats.filename;
                            let fileType = fileName.split(".")
                            let type = `video/${fileType[1] ? fileType[1] : 'mp4'}`
                            this._uploadFile(response.uri, fileName, type, stats.fileSize)
                        })
                        .catch((err) => { console.log("err", err) })
                }
                else {
                    this._uploadFile(response.uri, response.fileName, response.type, response.fileSize)
                }
            }
        });
    }


    _renderTaskImage() {
        const { cardImageIdentifier } = this.state.data;
        return (
            <View style={styles.taskImageContainer}>
                <ImageEx style={styles.taskImage} source={{ uri: cardImageIdentifier }} />
            </View>
        )
    }

    _renderTitle(title, style) {
        return <Text style={[styles.taskTitle, style]}>{title}</Text>
    }

    _renderStatus(actions) {
        let count = 0
        let status = ''
        if (actions && actions.length > 0) {
            actions.map((v, i) => {
                if (v['stepStatus '] == 'Complete') {
                    count++
                }
            })
        }

        status = count == 0 ? 'open' : (count == actions.length ? 'completed' : 'in_progress')
        return (
            <View style={styles.taskStatusOverallView}>
                <Text style={styles.taskStatusOverallText}>{I18n.t(`taskDetails.${status}`)}</Text>
            </View>
        )
    }

    _dateComponent(dateTitle, date) {
        const dateComponent = new Date(date)
        return <View style={styles.dateContainer}>
            <Text style={styles.dateTitleText}>{dateTitle}</Text>
            <Text style={styles.dateText}>{formatYYYYMMDD(dateComponent) + ' ' + formatAMPM(dateComponent)}</Text>
        </View>
    }

    _renderDate() {
        const { assignedDate, endDate } = this.state.data;
        return (
            <View style={styles.dateMainContainer}>
                {this._dateComponent(I18n.t('taskDetails.start_date'), assignedDate)}
                {this._dateComponent(I18n.t('taskDetails.due_date'), endDate)}
            </View>
        )
    }

    _renderHtmlContent() {
        const { description } = this.state.data;
        return <ContentHtml spinnerEnable={true} htmlContent={description} style={styles.webView} />
    }

    _renderMarkAsCompleteCTA() {
        return (
            <TouchableOpacity style={styles.markAsCompleteCTAView} onPress={() => this.setState({ showCompletionPopup: true })}>
                <Text style={styles.markAsCompleteCTAViewText}>{I18n.t('taskDetails.mark_as_complete')}</Text>
            </TouchableOpacity>
        )
    }

    _renderAction(actions) {
        return (
            <View>
                {
                    actions.map((v, i) => {
                        return this._getActionType(v, i)
                    })
                }
            </View>
        )
    }

    _renderUploadedMedia(media) {
        let { apiConfig } = this.props;
        let { fileName, fileUrl, fileSize } = media;
        const baseUrl = new Url(apiConfig.st_base_url, true)
        if (fileUrl.includes('$HOST_NAME')) {
            fileUrl = fileUrl.replace('$HOST_NAME', baseUrl.hostname)
        }
        return (
            <View style={styles.uploadedImageView}>
                <TouchableOpacity style={styles.uploadedImageTextConatiner} onPress={() => this._openActivityDetail(fileUrl)}>
                    <ImageEx style={styles.uploadedImage}
                        source={{ uri: fileUrl }} />
                    <View style={styles.uploadedImageTextView}>
                        <Text numberOfLines={1} style={styles.uploadedImageName}>{fileName}</Text>
                        <Text numberOfLines={1} style={styles.uploadedImageSize}>{getFileSizeString(fileSize)}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    showLoading = (isFileDownloading) => {
        this.setState({
            isFileDownloading
        })
    }

    _openActivityDetail(mediaUrl) {
        const {
            accessToken,
            apiConfig,
            tokenType
        } = this.props
        const headers = {
            Authorization: `${tokenType} ${accessToken}`
        }
        const urlSplit = mediaUrl.split('.');
        const ext = urlSplit[urlSplit.length - 1]
        const baseUrl = new Url(apiConfig.st_base_url, true)
        let uri = mediaUrl;
        if (uri.includes('$HOST_NAME')) {
            uri = uri.replace('$HOST_NAME', baseUrl.hostname)
        }
        let contentType = ''
        let activityType = ''
        if (ext == "webm" || ext == "avi" || ext == "mp4" || ext == "3gp" || ext == "flv" || ext == "mov") {
            contentType = Constants.CONTENT_TYPES.VIDEO
            activityType = Constants.ACTIVITY_TYPES.VIDEO
        } else if (ext == 'pdf' || ext == 'docs') {
            contentType = Constants.CONTENT_TYPES.PDF
            activityType = Constants.ACTIVITY_TYPES.DOCUMENT
        } else {
            contentType = Constants.CONTENT_TYPES.PHOTO
        }
        let cookiesObj = {}
        let sourceObj = {
            uri,
            headers
        }

        if (Platform.OS == 'android' && contentType != Constants.CONTENT_TYPES.PHOTO) {
            sourceObj.extension = ext
        }
        const activity = {
            contentType,
            activityType,
            activityImage: mediaUrl
        }
        openActivityDetail(activity, null, sourceObj, cookiesObj, (isLoad) => this.showLoading(isLoad))
    }

    _getActionType(action, index) {
        const { stepKey, stepName, stepDescription, processEntityStepStates } = action;
        const isComplete = action['stepStatus '] == 'Complete'
        const { stepData } = processEntityStepStates[0];
        let Icon;
        let uploadedImage;
        switch (stepKey) {
            case Constants.TASKS_ACTION_TYPES.UPLOAD_DOCUMENT:
                if (stepData.length > 0) {
                    var { fileUploadsRequested } = stepData[0];
                    var { fileUrl, fileItemId, fileName, fileSize } = fileUploadsRequested[0]
                    this.fileItemId = fileItemId
                }
                Icon = isComplete ? <IconComplete width={30} height={30} fill={Colors.rgb_54da8d} /> : <UploadIcon width={18} height={18} fill={Colors.white} />
                uploadedImage = isComplete && this._renderUploadedMedia({ fileName, fileUrl, fileSize })
                break;
            case Constants.TASKS_ACTION_TYPES.COMMENT_ON_A_POST:
                Icon = isComplete ? <IconComplete width={30} height={30} fill={Colors.rgb_54da8d} /> : <CommentIcon width={18} height={18} fill={Colors.white} />
                break;
            case Constants.TASKS_ACTION_TYPES.ADHOC_ACTION_WITH_USER_CONFIRMATION:
                if (stepData && stepData.length > 0) {
                    var { externalUrl } = stepData[0];
                }
                Icon = isComplete ? <IconComplete width={30} height={30} fill={Colors.rgb_54da8d} /> :
                    (externalUrl ? <LearnIcon width={18} height={18} fill={Colors.white} /> : <CourseIcon width={18} height={18} fill={Colors.white} />)
                break;
            default:
                break;
        }
        return (
            <View style={styles.actionContainer} key={'action' + index}>
                <TouchableOpacity style={styles.actionItemMainView} onPress={() => this._onPressAction(action)} disabled={isComplete}>
                    <View style={styles.actionItemView}>
                        <Text numberOfLines={1} style={styles.actionTitleText}>{stepName}</Text>
                        <Text numberOfLines={2} style={styles.actionDescText}>{stepDescription}</Text>
                    </View>
                    <View style={[styles.actionIconContainer, {
                        backgroundColor: isComplete ? null : Colors.rgb_4297ff,
                    }]}>
                        {Icon}
                    </View>
                </TouchableOpacity>
                {uploadedImage}
            </View>
        )
    }

    _onPressAction(action) {
        const { stepKey, stepId, processEntityStepStates } = action;
        const stepData = processEntityStepStates.length > 0 ? processEntityStepStates[0].stepData : [];
        this.stepId = stepId;
        let url = stepData && stepData.length > 0 ? stepData[0].externalUrl : null
        switch (stepKey) {
            case Constants.TASKS_ACTION_TYPES.UPLOAD_DOCUMENT:
                this.setState({ showFilePickerPopup: true })
                break;
            case Constants.TASKS_ACTION_TYPES.ADHOC_ACTION_WITH_USER_CONFIRMATION:
                if (url) {
                    url = addParam(url, 'initiativeId', this.initiativeId)
                    url = addParam(url, 'stepId', this.stepId)
                    url = addParam(url, 'isMission', this.isMission)
                    open({ url })
                } else {
                    this.setState({ showCompletionPopup: true })
                }
                break;
            case Constants.TASKS_ACTION_TYPES.COMMENT_ON_A_POST:
                if (url) {
                    url = addParam(url, 'initiativeId', this.initiativeId)
                    url = addParam(url, 'stepId', this.stepId)
                    url = addParam(url, 'isMission', this.isMission)
                    open({ url })
                }
                break;
            default:
                break;
        }
    }

    _renderActions(actions) {
        if (actions) {
            return (
                <View style={styles.actionsContainer}>
                    {
                        actions.length == 0 ? this._renderMarkAsCompleteCTA() : this._renderAction(actions)
                    }
                </View>
            )
        }
    }

    _renderMissionCompletionPopup() {
        const { showCompletionPopup, data } = this.state;
        const { name } = data;
        return <Dialog
            visible={showCompletionPopup}
            title={name}
            message={I18n.t(`${this.isMission ? 'missionDetails' : 'taskDetails'}.have_you_completed`)}
            positive={I18n.t('taskDetails.cta_positive')}
            negative={I18n.t('taskDetails.cta_negative')}
            negativeOnPress={() => this.setState({ showCompletionPopup: false })}
            positiveOnPress={() => {
                this.setState({ showCompletionPopup: false });
                this.props.markTaskAsComplete(this.initiativeId, this.stepId, this.isMission)
            }}
            textAlign='left'
        />
    }

    componentWillUnmount() {
        this.shouldPrompAppRating && this.props.showHideAppRatingPrompt(true);
    }

    _renderSizeValidationPopup() {
        const { showSizeValidationPopup } = this.state;
        return <Dialog
            visible={showSizeValidationPopup}
            title={I18n.t('taskDetails.size_validation_title')}
            message={I18n.t(`taskDetails.size_validation_body`)}
            positive={I18n.t('taskDetails.size_validation_cta')}
            positiveOnPress={() => this.setState({ showSizeValidationPopup: false })}
            textAlign='left'
        />
    }

    render() {
        const { loadingError, isUploading } = this.props;
        const { isLoading, data, isFileDownloading } = this.state
        const processStepGroups = data ? data.processStepGroups : null;
        const actions = processStepGroups ? processStepGroups[0] ? processStepGroups[0].processSteps : null : null;

        if (loadingError) {
            return <ErrorScreen
                title={I18n.t('taskDetails.error_screen_title')}
                message={I18n.t('taskDetails.error_screen_body')}
                cta={I18n.t('taskDetails.error_screen_cta')}
                ctaOnPress={() => this._getTaskDetails()}
            />
        }
        else {
            return (isLoading ? <LoadingSpinner /> :
                <View style={styles.container}>
                    <ScrollView >
                        <View style={styles.padding_24}>
                            {this._renderTaskImage()}
                            {this._renderTitle(data ? data.name : '')}
                            {this._renderStatus(actions)}
                            {this._renderDate()}
                            {this._renderHtmlContent()}
                        </View>
                        <View>
                            {actions && actions.length > 0 && this._renderTitle(I18n.t('taskDetails.actions'), styles.padding_24)}
                            {this._renderActions(actions)}
                        </View>
                    </ScrollView>
                    {(isUploading || isFileDownloading) && <LoadingSpinner />}
                    {this._renderMissionCompletionPopup()}
                    {this.renderFilePickerDialog()}
                    {this._renderSizeValidationPopup()}
                </View>
            )
        }
    }
}

const mapStateToProps = (state) => ({
    taskDetails: state.notifications.taskDetails,
    missionDetails: state.notifications.missionDetails,
    uploadTaskFileSuccess: state.notifications.uploadTaskFileSuccess,
    uploadTaskFileFailure: state.notifications.uploadTaskFileFailure,
    userId: state.user.summary ? state.user.summary.userId : undefined,
    apiConfig: state.remoteConfig.apiConfig,
    accessToken: state.app.access_token,
    tokenType: state.app.token_type,
    loadingError: state.notifications.loadingError,
    isUploading: state.notifications.isUploading,
    markTaskAsCompleteSuccess: state.notifications.markTaskAsCompleteSuccess
})

const mapDispatchToProps = (dispatch) => ({
    getTaskDetails: (isMission, initiativeId) => dispatch(NotificationsActions.getTaskDetails(isMission, initiativeId)),
    uploadTaskFile: (fileItemId, file, initiativeId, stepId, isMission) => dispatch(NotificationsActions.uploadTaskFile(fileItemId, file, initiativeId, stepId, isMission)),
    markTaskAsComplete: (initiativeId, stepId, isMission) => dispatch(NotificationsActions.markTaskAsComplete(initiativeId, stepId, isMission)),
    showHideAppRatingPrompt: (isVisible) => dispatch(AppActions.showHideAppRatingPrompt(isVisible))
})

export default connect(mapStateToProps, mapDispatchToProps)(TaskAndMissionDetailScreen)