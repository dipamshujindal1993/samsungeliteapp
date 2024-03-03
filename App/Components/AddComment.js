import React, { Component } from 'react'
import {
    BackHandler,
    Platform,
    View,
    Keyboard,
    Text,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    NativeModules,
    Alert,
    Animated
} from 'react-native'
import { connect } from 'react-redux'
import RNFetchBlob from 'rn-fetch-blob'
import ImagePicker from 'react-native-image-picker';
import {
    PERMISSIONS,
    RESULTS,
    check,
    request,
    openSettings
  } from 'react-native-permissions';
import RNThumbnail from 'react-native-thumbnail';
import LoadingSpinner from '@components/LoadingSpinner'
import ToastMessage from '@components/ToastMessage'
import Gallery from '@components/Gallery'
import ImageEx from '@components/ImageEx'
import MultiLineTextInput from '@components/MultiLineTextInput'

import I18n from '@i18n'
import { isEmpty, formatString } from '@utils/TextUtils'
import  { getFileSizeInMBFromByte } from '@utils/CommonUtils'
import styles from './Styles/AddCommentStyle'
import CommunitiesActions from '@redux/CommunitiesRedux'
import NotificationsActions from '@redux/NotificationsRedux';
import { Colors, Constants } from '@resources'

import CloseIcon from '@svg/icon_close.svg'
import PaperClipIcon from '@svg/icon_paperclip.svg'
import PlayIcon from '@svg/icon_play.svg'

class AddComment extends Component {

    constructor(props){
        super(props)
        this.isFromEdit = props.replyData ? true : false
        this.state = {
            isLoading: this.isFromEdit ? true : false,
            fileArray: [],
            fileIndexArray:[],
            showImagePickerDialog: false,
            showGallery: false
        }
        this.keyboardHeight = new Animated.Value(0);
    }

    componentDidMount() {
        const { removeAllAttachedFiles, replyData } = this.props
        if (Platform.OS === 'ios') {
            this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow)
            this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide)
        }
        else{
            this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this._keyboardWillShow)
            this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this._keyboardWillHide)
            this.backHandler = BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
        }
        
        removeAllAttachedFiles()
        
        if(this.isFromEdit && replyData){
            let _message
            var images = []
            try {
                let obj = JSON.parse(replyData.content);
                _message = obj.message
                images = obj.images
            } catch (error) {
                _message = replyData.content
            }
            
            images.map((item) => {
                this.state.fileIndexArray.push(-2)
            })
            this.setState({
                isLoading: false,
                message: _message,
                fileArray: images,
            })
        }
        else{
            this.setState({
                isLoading: false,
                message: "",
                fileArray: [],
            })
        }
    }

    componentDidUpdate(prevProps) {
        const { addCommentSuccess, 
                addCommentFailure, 
                uploadFileSuccess, 
                uploadFileFailure, 
                attachedFiles,
                updateCommentSuccess,
                updateCommentFailure,
                onDismiss,
                markTaskAsComplete,
                navigation
        } = this.props

        const { fileArray } = this.state

        if(uploadFileSuccess && attachedFiles.length>0 && attachedFiles!==prevProps.attachedFiles){
            let successFileLength = JSON.stringify(attachedFiles).split("success").length - 1
            if((successFileLength+this.httpFileLength) == fileArray.length){
                let emptyURLArray = attachedFiles.filter((file) => isEmpty(file.data))
                emptyURLArray.length==0 && this.addCommentAPI()
            }
            if(JSON.stringify(attachedFiles).includes("fail") && attachedFiles.length == fileArray.length){
                this.setState({isLoading: false})
            }
        }
      
        if(uploadFileFailure && attachedFiles.length>0 && attachedFiles!==prevProps.attachedFiles){
            if(attachedFiles.length == fileArray.length){
                this.setState({isLoading: false})
            }
        }
        
        if(addCommentSuccess && addCommentSuccess!==prevProps.addCommentSuccess){
            ToastMessage(I18n.t('add_comment.save_success'))
            onDismiss(true)
            this.setState({isLoading: false})
            const { initiativeId, stepId, isMission } = navigation.state.params;
            initiativeId && markTaskAsComplete(initiativeId, stepId, isMission)
        }

        if(addCommentFailure && addCommentFailure!==prevProps.addCommentFailure){
            ToastMessage(I18n.t('add_comment.save_error'))
            this.setState({isLoading: false})
        }

        if(updateCommentSuccess && updateCommentSuccess!==prevProps.updateCommentSuccess){
            ToastMessage(I18n.t('add_comment.update_success'))
            onDismiss(true)
            this.setState({isLoading: false})
        }

        if(updateCommentFailure && updateCommentFailure!==prevProps.updateCommentFailure){
            ToastMessage(I18n.t('add_comment.update_error'))
            this.setState({isLoading: false})
        }
    }

    componentWillUnmount() {
        this.keyboardWillShowSub.remove()
        this.keyboardWillHideSub.remove()
        Platform.OS === 'android' && this.backHandler.remove()  
    }

    _handleBackPress = () => {
        this.props.onDismiss()
        return true
    }

    _keyboardWillHide = (e) => {
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
            duration: e.duration,
            toValue: 0,
            })
            ]).start();

    }

    _keyboardWillShow = (e) => {
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
            duration: e.duration,
            toValue:  Platform.OS === 'ios' ? e.endCoordinates.height : 0,
            })
            ]).start();

    }

    permissionHandler = (permissionFor) => {
        this.setState({ showImagePickerDialog: false})
        let selectedPermission = null
        if(permissionFor==='gallery'){
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
                if(selectedPermission===PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE || selectedPermission===PERMISSIONS.IOS.PHOTO_LIBRARY){
                    request(selectedPermission).then(status => status===RESULTS.GRANTED && this.onGalleryPermissionGrant());
                }
                else{
                    request(selectedPermission).then(status => status===RESULTS.GRANTED && this.onCameraPermissionGrant());
                }
                break;
              case RESULTS.GRANTED:
                if(selectedPermission===PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE || selectedPermission===PERMISSIONS.IOS.PHOTO_LIBRARY){
                    this.onGalleryPermissionGrant()
                }
                else{
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
            console.error("error",error)
          });
    }

    onGalleryPermissionGrant() {
        this.setState({
            showGallery: true,
        })
    }

    onCameraPermissionGrant() {
        if (this.state.fileIndexArray.length < Constants.CREATE_COMMENT_MAX_FILE) {
            this.openCamera()
        }
    }

    showPermissionRationalAlert(title, description){
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
            {cancelable: false},
          );
    }

    _openSetting = () => {
        openSettings().catch(() => console.error('cannot open settings'));
    }

    isParamChange(){
        const { message } = this.state
        const { replyData } = this.props
        let _message
        if(replyData) {
            try {
                let obj = JSON.parse(replyData.content);
                _message = obj.message
            } catch (error) {
                _message = replyData.content
            }
        }
        if(!isEmpty(message)){
            if(this.isFromEdit && message==_message){
                return false
            }
            return true
        }
        else{
            false
        }
    }

    addCommentAPI() {
        const { isLoading, message, fileArray } = this.state
        const { attachedFiles, 
                updateComment, 
                addComment, 
                discussionId, 
                replyData,
                onDismiss 
            } = this.props
        let images = []
        
        fileArray.map((item) => {
            item.url && images.push(item)
        })
        
        attachedFiles.map((file) => {
            let image = {
                "url": file.data,
                "type": file.fileType,
                "thumbnail": file.thumbnail
            }
            images.push(image)
        })
        !isLoading && this.setState({isLoading: true})
        let description = {
            "message" : message,
            "images" : images
        }
        const requestData = {
            "replyText": JSON.stringify(description)
        }
        
        if(this.isFromEdit){
            if(this.isParamChange() || this.isFileChanged){
                updateComment(replyData.id,requestData)
            }
            else{
                onDismiss(false)
            }
        }
        else{
            addComment(discussionId,requestData)
        }
    }

    _doPost = () => {
        const { isLoading, fileArray, fileIndexArray } = this.state
        const {navigation, uploadFile } = this.props
        const communityId = navigation.getParam('communityId')
        this.setState({ showGallery: false })
        if(fileArray.length==0){
            this.addCommentAPI()
        }
        else {
            let localFileLength = 0
            this.httpFileLength = 0
            this.setState({isLoading: !isLoading && true})
            for(let i=0; i< fileArray.length; i++){
                let _file = fileArray[i]
                let uri = _file.uri
                if(uri){
                    localFileLength++
                    if (Platform.OS == "ios") {
                        if(!isEmpty(_file.thumbnail)){
                            let fileObj = this.createFileObject(uri,_file.type)
                            Object.assign(fileObj, {"uri": _file.thumbnail})
                            uploadFile(communityId,fileObj,_file.fileIndex,true)
                        }
                        const isVideo = _file.type.includes("video")
                        this.changePHUrlToURI(uri, isVideo, (image) => {
                            let fileObj = this.createFileObject(image,_file.type)
                            Object.assign(fileObj, {"uri": image})
                            uploadFile(communityId,fileObj,_file.fileIndex)
                        })
                    }
                    else {
                        if(this.fileSelectionType=='video') {
                            if(!isEmpty(_file.thumbnail)){
                                let fileObj = this.createFileObject(_file.thumbnail,"image")
                                Object.assign(fileObj, {"uri": _file.thumbnail})
                                uploadFile(communityId,fileObj,fileIndexArray[i],true)
                            }
                            uploadFile(communityId,_file,fileIndexArray[i])
                        }
                        else if(this.fileSelectionType=='image') {
                            let fileObj = this.createFileObject(uri,"image")
                            Object.assign(fileObj, {"uri": uri})
                            uploadFile(communityId,fileObj,fileIndexArray[i])
                        }
                        else {
                            if(!isEmpty(_file.thumbnail)){
                                let fileObj = this.createFileObject(_file.thumbnail,"image")
                                Object.assign(fileObj, {"uri": _file.thumbnail})
                                uploadFile(communityId,fileObj,fileIndexArray[i],true)
                            }
                            let fileObj = {
                                "uri": _file.uri,
                                "name": _file.filename,
                                "type": _file.type
                            }
                            uploadFile(communityId,fileObj,fileIndexArray[i])
                            
                        }
                    }   
                }
                else{
                    this.httpFileLength++
                }
            }
            if(localFileLength==0){
                this.addCommentAPI()
            }
        }
    }

    createFileObject(uri,type){
        let fileStr = uri.split('/');
        const fileName = fileStr[fileStr.length - 1];
        let fileType = fileName.split(".")
        if(fileType[1] == undefined){
            fileType[1]="jpeg"
            type = "image"
        }
        fileType[1] == undefined ? fileType[1]="jpeg" : fileType[1]
        const fileObj = {
            type: `${type}/${fileType[1]}`,
            name: `${fileType[0]}.${fileType[1]}`,
        }
        return fileObj
    }

    render () {
        const {
            onDismiss, visible
        } = this.props

        const { 
            isLoading, message, messageError, showGallery
        } = this.state
    
        const postCTADisable = !this.isParamChange() && !this.isFileChanged
        const CTAStyle = postCTADisable ? styles.CTADisable : styles.CTA
        return (
            visible ? 
                <View style={styles.background}>
                <Animated.View style={[styles.container, { paddingBottom: this.keyboardHeight }]}>
                    <TouchableOpacity disabled={isLoading} onPress={() => onDismiss()} style={styles.hideModal}>
                        <CloseIcon width={16} height={16} fill={Colors.white}/>
                    </TouchableOpacity>
                    <View style={styles.ViewContainer}>
                        <View style={styles.inputContainer}>
                            <View style={styles.titleContainer}> 
                                <Text style={styles.title}> {I18n.t('add_comment.title')} </Text>
                                <TouchableOpacity disabled={postCTADisable} onPress={() => this._doPost()} style={styles.postView}>
                                { 
                                    <Text style={isEmpty(message)? styles.CTADisable : CTAStyle}>{this.isFromEdit ? I18n.t('create_post.update') : I18n.t('create_post.post')}</Text>
                                }
                                </TouchableOpacity>
                            </View>

                            <MultiLineTextInput
                                autoFocus={isEmpty(message)}
                                style={styles.messageContainer}
                                placeholder={I18n.t('add_comment.message')}
                                placeholderTextColor={Colors.rgb_a3a3a3}
                                value={message && message.trim()}
                                error={messageError}
                                onFocus={() => this.setState({showGallery: false})}
                                onChangeText={(message) => {
                                    this.setState({
                                        message,
                                        messageError: isEmpty(message),
                                    })
                                }}
                                editable={!isLoading}
                            />
                        </View>
                        {this.renderInsertImageBottomView()}
                        { this.renderFilePickerDialog() }
                        <View style={{ height: showGallery ? 246 : 0, backgroundColor: Colors.white }} />
                        { showGallery && this.renderGalleryPicker() }
                        {isLoading && <LoadingSpinner />}
                    </View>
                    </Animated.View>
                </View> : null
        )
    }

    renderInsertImageBottomView(){
        const { fileArray, showGallery } = this.state
        const { attachedFiles } = this.props
        let styleThumbnailViewContainer = fileArray.length > 0 ? {...styles.thumbnailViewContainer, padding:12, paddingHorizontal: 8} : styles.thumbnailView
        const isAnyFailed = JSON.stringify(attachedFiles) && JSON.stringify(attachedFiles).split("fail").length - 1 > 0
        return(
            <>
                <View style={styles.bottomView}>
                    <View style={styles.sizeLimitContainer}>
                        <Text style={styles.sizeLimit}>{formatString(I18n.t('create_post.size_limit'),Constants.FILE_MAX_SIZE_TO_UPLOAD)}</Text>
                    </View>
                    <View style={styles.insetImageContainer}>
                        <TouchableOpacity onPress={()=> this.onInsertImageClick()}>
                            <PaperClipIcon width={18} height={18} fill={Colors.rgb_4297ff}/>
                        </TouchableOpacity>
                        <Text style={styles.insertImage}>{fileArray.length}/{Constants.CREATE_COMMENT_MAX_FILE}</Text>
                    </View>
                    <View>
                    {
                        fileArray.length>0 &&  showGallery ?
                        <TouchableOpacity onPress={() => this.setState({ showGallery: false })}>
                            <Text style={styles.CTA}>{I18n.t('create_post.done')}</Text>
                        </TouchableOpacity>
                        :
                        isAnyFailed && fileArray.length>0 &&
                        <Text style={styles.failed_upload}>{I18n.t('create_post.upload_fail_error')}</Text>
                    }
                    </View>
                </View>

                <View style={styleThumbnailViewContainer}>
                {
                    fileArray.map((file, index) => {
                        let isFileFail = attachedFiles && attachedFiles.length>0 && attachedFiles[index] && attachedFiles[index].status=="fail"
                        return(
                            <TouchableOpacity key={index} style={styles.thumbnailView} onPress={()=> this.onFileRemove(index)}>
                                <ImageEx
                                    style={styles.itemImage}
                                    source={{ uri: isEmpty(file.uri) ? file.url : file.uri}}
                                    resizeMode={'cover'}
                                />
                                <View style={[styles.commonIcon, isFileFail ? styles.failedIconView: styles.removeIconView]}>
                                    <CloseIcon width={6} height={6} fill={ isFileFail ? Colors.white : Colors.rgb_0074d4} />
                                </View>
                                {
                                    file.type.includes("video") &&
                                    <PlayIcon width={16} height={16} fill={Colors.rgb_d8d8d8} style={{position: "absolute"}}/>
                                }
                            </TouchableOpacity>
                        )
                      }
                    )
                }
                </View>

            </>
        )
    }

    renderFilePickerDialog(){
        return(
            <Modal
                transparent
                hardwareAccelerated
                visible={this.state.showImagePickerDialog}
            >
                <TouchableWithoutFeedback onPress={() => this.setState({showImagePickerDialog : false})}>
                    <View style={styles.pickerBackground}>
                        <View style={styles.pickerView}>
                            <Text style={styles.galleryPickerTitle}>{I18n.t('edit_profile.select_a_photo')}</Text>
                            <TouchableOpacity onPress={() => {this.fileSelectionType = "image";this.permissionHandler("camera")}}>
                                <Text style={styles.galleryPickerOption}>{I18n.t('edit_profile.take_a_photo')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {this.fileSelectionType = "video";this.permissionHandler("camera")}}>
                                <Text style={styles.galleryPickerOption}>{I18n.t('edit_profile.take_a_video')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.permissionHandler("gallery")}>
                                <Text style={styles.galleryPickerOption}>{I18n.t('edit_profile.pick_from_gallery')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ showImagePickerDialog: false})}>
                                <Text style={[styles.galleryPickerCancel]}>{I18n.t('create_post.cancel')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    renderGalleryPicker(){
        return (
            <Gallery
                visible={this.state.showGallery}
                onFileSelect={(selectedFile) => this.onFileSelect(selectedFile)}
                selectedFileIndexArray={this.state.fileIndexArray}
            />
        )
    }

    onInsertImageClick(){
        this.setState({showImagePickerDialog : true})
        Keyboard.dismiss()
    }

    onFileRemove(index){
        const { fileArray,fileIndexArray } = this.state
        const { attachedFiles, removeAttachedFile } = this.props
        fileArray.splice(index,1)
        fileIndexArray.splice(index,1)
        attachedFiles && attachedFiles.length > 0 && removeAttachedFile(attachedFiles[index].fileIndex)
        this.setState({fileArray,fileIndexArray})
        if(this.isFromEdit)
        this.isFileChanged = true
        else
        this.isFileChanged = false
    }

    async changePHUrlToURI(uri, isVideo, callback) {
        let myAssetId = uri.slice(5);
        await NativeModules.ReadImageData.readImage(myAssetId, isVideo, (image) => {
            callback(image)
        });
    }

    onFileSelect(selectedFile){
        let { fileArray, fileIndexArray } = this.state;
        const index = selectedFile.fileIndex
        if (fileIndexArray.indexOf(index) == -1) {
            if (fileIndexArray.length < Constants.CREATE_COMMENT_MAX_FILE) {
                fileIndexArray.push(index)
                if(this.isFromEdit)
                this.isFileChanged = true
                else
                 this.isFileChanged = false
                if(selectedFile.type.includes("video")){
                    if(Platform.OS == 'ios'){
                        this.changePHUrlToURI(selectedFile.uri, true, (url)=>{
                            try{
                                RNThumbnail.get(url).then((result) => {
                                    if(result){
                                        Object.assign(selectedFile, {thumbnail: result.path});
                                        fileArray.push(selectedFile)
                                        this.setState({fileArray, fileIndexArray})
                                    }
                                })
                            }
                            catch(e){
                                console.warn("Error with thumbnail")
                            }
                        })
                    }else{
                        RNThumbnail.get(selectedFile.uri).then((result) => {
                            if(result){
                                Object.assign(selectedFile, {thumbnail: result.path});
                                fileArray.push(selectedFile)
                                this.setState({fileArray, fileIndexArray})
                            }
                        })
                    }
                }
                else{
                    Object.assign(selectedFile, {thumbnail: ''});
                    fileArray.push(selectedFile)
                    this.setState({fileArray, fileIndexArray})
                }
            }
        } else {
            fileIndexArray = fileIndexArray.filter((value, item) => value != index)
            fileArray = fileArray.filter((value,item)=> value.fileIndex != index)
            this.setState({fileArray, fileIndexArray})
        }       
    }

    openCamera(){
        const { fileArray, fileIndexArray } = this.state
        const {navigation} = this.props
        var options = {
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
            mediaType: this.fileSelectionType,
            videoQuality: 'low',
        };

        ImagePicker.launchCamera(options, (response) => {
            if(response.uri){
                let isValidSize = false
                const url = this.fileSelectionType=="image" ? response.path : response.uri
                RNFetchBlob.fs.stat(url)
                .then((stats) => {
                    const fileSizeMB = getFileSizeInMBFromByte(stats.size)
                    isValidSize = fileSizeMB <=Constants.FILE_MAX_SIZE_TO_UPLOAD
                    if(isValidSize) {
                        let selectedFile = null
                        if(this.fileSelectionType=="video" && response.path) {
                            const fileObj = this.createFileObject(response.path,"video")
                            if(fileObj) {
                                selectedFile = {
                                    uri: response.uri,
                                    type: fileObj.type,
                                    name: fileObj.name,
                                    path: response.path
                                }
                            }
                        } else {
                            selectedFile = {
                                uri: response.uri,
                                type: response.type,
                                name: response.fileName
                            }
                        }
                        if (fileIndexArray.length < Constants.CREATE_POST_MAX_FILE && selectedFile) {
                            fileIndexArray.push(-2)
                            this.isFromEdit && navigation.setParams({ disable: false });
                            if(selectedFile.type.includes("video")){
                                RNThumbnail.get(selectedFile.path).then((result) => {
                                    if(result){
                                        Object.assign(selectedFile, {thumbnail: result.path});
                                        fileArray.push(selectedFile)
                                        this.setState({fileArray, fileIndexArray})
                                    }
                                })
                            }
                            else{
                                Object.assign(selectedFile, {thumbnail: ''});
                                fileArray.push(selectedFile)
                                this.setState({fileArray, fileIndexArray})
                            }
                        }
                    }
                    else{
                        ToastMessage(formatString(I18n.t('create_post.oversize'),Constants.FILE_MAX_SIZE_TO_UPLOAD))
                    }
                })
                .catch((err) => {console.log("err",err)})
            }
        });
    }
}

const mapStateToProps = (state) => ({
    addCommentSuccess : state.communities.addCommentSuccess,
    addCommentFailure : state.communities.addCommentFailure,
    uploadFileSuccess: state.communities.uploadFileSuccess,
    uploadFileFailure: state.communities.uploadFileFailure,
    attachedFiles: state.communities.attachedFiles,
    updateCommentSuccess: state.communities.updateCommentSuccess,
    updateCommentFailure: state.communities.updateCommentFailure,
})

const mapDispatchToProps = (dispatch) => ({
    addComment: (discussionId, requestData) => dispatch(CommunitiesActions.addComment(discussionId, requestData)),
    uploadFile: (communityId, file, fileIndex, isThumb) => dispatch(CommunitiesActions.uploadFile(communityId, file, fileIndex, isThumb)),
    removeAllAttachedFiles: () => dispatch(CommunitiesActions.removeAllAttachedFiles()),
    removeAttachedFile: (index) => dispatch(CommunitiesActions.removeAttachedFile(index)),
    updateComment: (replyId, requestData) => dispatch(CommunitiesActions.updateComment(replyId, requestData)),
    markTaskAsComplete: (initiativeId, stepId, isMission) => dispatch(NotificationsActions.markTaskAsComplete(initiativeId, stepId, isMission)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddComment)
