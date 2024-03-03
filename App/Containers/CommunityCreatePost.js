import React, { Component } from 'react'
import {
    Animated,
    Platform,
    View,
    Keyboard,
    Text,
    BackHandler,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    NativeModules,
    Alert
} from 'react-native'
import { connect } from 'react-redux'
import { HeaderBackButton } from 'react-navigation-stack';
import ImagePicker from 'react-native-image-picker';
import {
    PERMISSIONS,
    RESULTS,
    check,
    request,
    openSettings
  } from 'react-native-permissions';
import RNThumbnail from 'react-native-thumbnail';
import RNFetchBlob from 'rn-fetch-blob'
import CustomTextInput from '@components/CustomTextInput'
import LoadingSpinner from '@components/LoadingSpinner'
import HeaderButton from '@components/HeaderButton'
import Dialog from '@components/Dialog'
import ToastMessage from '@components/ToastMessage'
import Gallery from '@components/Gallery'
import HeaderTitle from '@components/HeaderTitle'
import ImageEx from '@components/ImageEx'
import MultiLineTextInput from '@components/MultiLineTextInput'

import I18n from '@i18n'
import { isEmpty, formatString } from '@utils/TextUtils'
import  { getFileSizeInMBFromByte } from '@utils/CommonUtils'
import styles from './Styles/CommunityCreatePostStyles'
import CommunitiesActions from '@redux/CommunitiesRedux'
import AppActions from '@redux/AppRedux'
import { Colors, Constants } from '@resources'

import PaperClipIcon from '@svg/icon_paperclip.svg'
import PlayIcon from '@svg/icon_play.svg'
import CloseIcon from '@svg/icon_close.svg'

class CommunityCreatePost extends Component {

    static navigationOptions = ({ navigation }) => {
        let buttonTitle, headerTitle
        if(navigation.getParam('from')=="edit"){
            buttonTitle = I18n.t('create_post.update')
            headerTitle = navigation.getParam('communityName')
        }
        else{
            buttonTitle = I18n.t('create_post.post')
            headerTitle = I18n.t('create_post.post_new_topic')
        }
        let disable = false
        if(navigation.state.params.disable || navigation.state.params.disable==undefined){
            disable = true
        }
        else{
            disable = false
        }
        return {
            headerLeft: () => <HeaderBackButton  onPress={navigation.getParam('backEvent')} />,
            headerRight: () => (
                <HeaderButton
                    disabled={disable}
                    title={buttonTitle}
                    onPress={navigation.getParam('doPost')}
                />
            ),
            headerTitle: () => <HeaderTitle title={headerTitle} />,
        }
    }

    constructor(props) {
        super(props)
        this.isFromEdit = props.navigation.getParam('from')=="edit" ? true : false
        this.state = {
            isLoading: this.isFromEdit,
            showCancelPostDialog: false,
            showImagePickerDialog: false,
            fileArray: [],
            fileIndexArray:[],
            showGallery: false
        }
        this.keyboardHeight = new Animated.Value(0);
    }

    componentDidUpdate(prevProps) {
        const { postSuccess, 
                postFailure, 
                uploadFileSuccess, 
                uploadFileFailure, 
                attachedFiles, 
                navigation,
                updatePostSuccess,
                updatePostFailure,
        } = this.props
        const { fileArray } = this.state
        if(uploadFileSuccess && attachedFiles.length>0 && attachedFiles!==prevProps.attachedFiles){
            let successFileLength = JSON.stringify(attachedFiles).split("success").length - 1
            if((successFileLength+this.httpFileLength) == fileArray.length){
                let emptyURLArray = attachedFiles.filter((file) => isEmpty(file.data))
                if(emptyURLArray.length==0) {
                    this.createPostAPI()
                }
            }
            if(JSON.stringify(attachedFiles).includes("fail") && attachedFiles.length == fileArray.length){
                this.setState({isLoading: false})
                navigation.setParams({ disable: false });
            }
        }
      
        if(uploadFileFailure && attachedFiles.length>0 && attachedFiles!==prevProps.attachedFiles){
            if(attachedFiles.length == fileArray.length){
                this.setState({isLoading: false})
                navigation.setParams({ disable: false });
            }
        }
        
        if(postSuccess && postSuccess!==prevProps.postSuccess){
            navigation.setParams({ disable: false }); 
            ToastMessage(I18n.t('create_post.save_success'))
            navigation.getParam('onRefresh')("success")
            navigation.goBack()
            this.setState({isLoading: false})
        }

        if(postFailure && postFailure!==prevProps.postFailure){
            navigation.setParams({ disable: false });
            ToastMessage(I18n.t('create_post.save_error'))
            this.setState({isLoading: false})
        }

        if(updatePostSuccess && updatePostSuccess!==prevProps.updatePostSuccess){
            navigation.setParams({ disable: false });
            ToastMessage(I18n.t('create_post.update_success'))
            navigation.getParam('onRefresh')("success")
            navigation.goBack()
            this.setState({isLoading: false})
        }

        if(updatePostFailure && updatePostFailure!==prevProps.updatePostFailure){
            navigation.setParams({ disable: false });
            ToastMessage(I18n.t('create_post.update_error'))
            this.setState({isLoading: false})
        }
    }

    componentDidMount() {
        const { navigation, removeAllAttachedFiles, postViewData } = this.props

        if (Platform.OS === 'ios') {
            this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow)
            this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide)
        }
        else{
            this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this._keyboardWillShow)
            this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this._keyboardWillHide)
        }
        
        
        navigation.setParams({ disable: true, doPost: this._doPost, backEvent: this._handleBackPress });
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
        removeAllAttachedFiles()
        if(this.isFromEdit && postViewData){
            let _message
            var images = []
            try {
                let obj = JSON.parse(postViewData.description);
                _message = obj.message
                images = obj.images
            } catch (error) {
                _message = postViewData.description
            }
            images.map((item) => {
                this.state.fileIndexArray.push(-2)
            })
            this.setState({
                isLoading: false,
                title: postViewData.title,
                message: _message,
                fileArray: images,
            })
        }
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
            showGallery: true
        })
    }

    onCameraPermissionGrant() {
        if (this.state.fileIndexArray.length < Constants.CREATE_POST_MAX_FILE) {
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

    componentWillUnmount() {
        this.keyboardWillShowSub.remove()
        this.keyboardWillHideSub.remove()
        this.backHandler.remove()
        this.props.postSuccess && this.props.showHideAppRatingPrompt(true)
    }

    _keyboardWillShow = (e) => {
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
            duration: e.duration,
            toValue:  Platform.OS === 'ios' ? e.endCoordinates.height : 0,
            })
            ]).start();
    }

    _keyboardWillHide = (e) => {
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
            duration: e.duration,
            toValue: 0,
            })
            ]).start();
    }

    _handleBackPress = () => {
        const { navigation } = this.props
        if(this.isParamChange()){
            this.setState({showCancelPostDialog: true})
            return true
        }
        else{
            navigation.goBack()
            return true
        }
    }

    isParamChange(){
        const { title, message } = this.state
        const { postViewData } = this.props
        let _message
        if(postViewData) {
            try {
                let obj = JSON.parse(postViewData.description);
                _message = obj.message
            } catch (error) {
                _message = postViewData.description
            }
        }
        if((!isEmpty(title)) && !isEmpty(message)){
            if(this.isFromEdit && title==postViewData.title && message==_message){
                return false
            }
            return true
        }
        else{
            false
        }
    }

    createPostAPI() {
        const { isLoading, title, message, fileArray } = this.state
        const { attachedFiles, updatePost, savePost, navigation } = this.props
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
            "title": title,
            "description": JSON.stringify(description)
        }
        this.isFromEdit ? 
            updatePost(navigation.getParam('discussionId'),requestData) :
            savePost(navigation.getParam('communityId'),requestData)
    }

    _doPost = () => {
        const { isLoading, fileArray, fileIndexArray } = this.state
        const {navigation, uploadFile } = this.props
        const communityId = navigation.getParam('communityId')
        this.setState({ showGallery: false, isLoading: !isLoading })
        navigation.setParams({ disable: true });
        if(fileArray.length==0){
            this.createPostAPI()
        }
        else {
            let localFileLength = 0
            this.httpFileLength = 0
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
                this.createPostAPI()
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

    onChangeText = () => {
        const {navigation} = this.props
        if(this.isParamChange()){
            navigation.setParams({ disable: false });
        }
        else{
            navigation.setParams({ disable: true });
        }
    }

    render() {
        const {
            isLoading,
            showGallery,
            showCancelPostDialog
        } = this.state
        return (
            <Animated.View style={[styles.container, { paddingBottom: this.keyboardHeight }]}>
                { this.renderInputs() }
                <View style={styles.space} />
                { this.renderInsertImageBottomView() }
                <View style={{ height: showGallery ? 246 : 0 }} />
                { this.renderFilePickerDialog() }
                { showGallery && this.renderGalleryPicker() }
                { showCancelPostDialog && this.renderCancelPostDialog() }
                {isLoading && <LoadingSpinner />}
            </Animated.View>
        )
    }

    renderInputs(){
        const {
            isLoading,
            title,
            titleError,
            message,
            messageError
        } = this.state
        return(
            <View style={styles.inputContainer}>
                <CustomTextInput
                    inputRef={component => this._titleRef = component}
                    inputStyle={styles.inputText}
                    label={!isEmpty(title) && I18n.t('create_post.title')}
                    labelStyle={styles.inputLabel}
                    placeholder={I18n.t('create_post.title')}
                    placeholderTextColor={Colors.rgb_d8d8d8}
                    onChangeText={(index, title) => {
                        this.setState({
                            title,
                            titleError: isEmpty(title),
                        },()=>this.onChangeText())
                    }}
                    value={title && title.trim()}
                    onBlur={() => this.setState({ titleError: isEmpty(title)})}
                    error={titleError}
                    onSubmitEditing={() => {
                        if (!isEmpty(title)) {
                            this._messageRef.focus()
                        } else {
                            this.setState({
                                titleError: true,
                            })
                        }
                    }}
                    blurOnSubmit={false}
                    editable={!isLoading}
                    onFocus={() => this.setState({showGallery: false})}
                    autoFocus={true}
                />
                <MultiLineTextInput
                    inputRef={component => this._messageRef = component}
                    style={styles.messageContainer}
                    inputStyle={isEmpty(message) ? styles.inputText : styles.inputMessage}
                    label={!isEmpty(message) && I18n.t('create_post.message')}
                    labelStyle={styles.inputLabel}
                    placeholder={I18n.t('create_post.message')}
                    placeholderTextColor={Colors.rgb_d8d8d8}
                    value={message && message.trim()}
                    error={messageError}
                    onFocus={() => { this.setState({showGallery: false, isMessageFocused: true})}}
                    onChangeText={(message) => {
                        this.setState({
                            message,
                            messageError: isEmpty(message),
                        },()=>this.onChangeText())
                    }}
                    editable={!isLoading}
                    onBlur={() => this.setState({ isMessageFocused: false, messageError: isEmpty(message)})}
                />
            </View>
        )
    }

    renderInsertImageBottomView(){
        const { fileArray, showGallery } = this.state
        const { attachedFiles } = this.props
        let styleThumbnailViewContainer = fileArray.length > 0 ? {...styles.thumbnailViewContainer, padding:12, paddingHorizontal: 8} : styles.thumbnailView
        const isAnyFailed = JSON.stringify(attachedFiles).split("fail").length - 1 > 0
        return(
            <View>
                <View style={styles.bottomView}>
                    <View style={styles.sizeLimitContainer}>
                        <Text style={styles.sizeLimit}>{formatString(I18n.t('create_post.size_limit'),Constants.FILE_MAX_SIZE_TO_UPLOAD)}</Text>
                    </View>
                    <View style={styles.insetImageContainer}>
                        <TouchableOpacity onPress={()=> this.onInsertImageClick()}>
                            <PaperClipIcon width={18} height={18} fill={Colors.rgb_4297ff}/>
                        </TouchableOpacity>
                        <Text style={styles.insertImage}>{fileArray.length}/{Constants.CREATE_POST_MAX_FILE}</Text>
                    </View>
                    <View>
                    {
                        fileArray.length>0 &&  showGallery ?
                        <TouchableOpacity onPress={() => this.setState({ showGallery: false })}>
                            <Text style={styles.done}>{I18n.t('create_post.done')}</Text>
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
                        let isFileFail = attachedFiles.length>0 && attachedFiles[index] && attachedFiles[index].status=="fail"
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

            </View>
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

    renderCancelPostDialog(){
        return(
            <Dialog 
                visible={this.state.showCancelPostDialog}
                title={I18n.t('create_post.cancel_post_dialog_title')}
                message={I18n.t('create_post.cancel_post_dialog_message')}
                negative={I18n.t('create_post.cancel_post_dialog_cta_negative')}
                positive={I18n.t('create_post.cancel_post_dialog_cta_positive')}
                negativeOnPress={() => this.setState({showCancelPostDialog: false})}
                positiveOnPress={() => this.onPostCanclePositive()}
                textAlign={'left'}
                cancelable={false}
            />
        )
    }

    onInsertImageClick(){
        this.setState({showImagePickerDialog : true})
        Keyboard.dismiss()
    }

    onFileRemove(index){
        const { fileArray,fileIndexArray } = this.state
        const { attachedFiles, removeAttachedFile, navigation } = this.props
        fileArray.splice(index,1)
        fileIndexArray.splice(index,1)
        attachedFiles.length > 0 && removeAttachedFile(attachedFiles[index].fileIndex)
        this.setState({fileArray,fileIndexArray})
        this.isFromEdit && navigation.setParams({ disable: false });
    }

    async changePHUrlToURI(uri, isVideo, callback) {
        let myAssetId = uri.slice(5);
        await NativeModules.ReadImageData.readImage(myAssetId, isVideo, (image) => {
            callback(image)
        });
    }

    onFileSelect(selectedFile){
        let { fileArray, fileIndexArray } = this.state;
        const {navigation} = this.props
        const index = selectedFile.fileIndex
        if (fileIndexArray.indexOf(index) == -1) {
            if (fileIndexArray.length < Constants.CREATE_POST_MAX_FILE) {
                fileIndexArray.push(index)
                this.isFromEdit && navigation.setParams({ disable: false });
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
            this.isFromEdit && navigation.setParams({ disable: true });
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

    onPostCanclePositive(){
        this.setState({showCancelPostDialog: false})
        this.props.navigation.goBack()
    }
    
}

const mapStateToProps = (state) => ({
    postSuccess : state.communities.postSuccess,
    postFailure : state.communities.postFailure,
    uploadFileSuccess: state.communities.uploadFileSuccess,
    uploadFileFailure: state.communities.uploadFileFailure,
    attachedFiles: state.communities.attachedFiles,
    updatePostSuccess: state.communities.updatePostSuccess,
    updatePostFailure: state.communities.updatePostFailure,
    postViewData: state.communities.postViewData
})

const mapDispatchToProps = (dispatch) => ({
    savePost: (communityId, requestData) => dispatch(CommunitiesActions.savePost(communityId, requestData)),
    uploadFile: (communityId, file, fileIndex, isThumb) => dispatch(CommunitiesActions.uploadFile(communityId, file, fileIndex, isThumb)),
    removeAllAttachedFiles: () => dispatch(CommunitiesActions.removeAllAttachedFiles()),
    removeAttachedFile: (index) => dispatch(CommunitiesActions.removeAttachedFile(index)),
    updatePost: (discussionId, requestData) => dispatch(CommunitiesActions.updatePost(discussionId, requestData)),
    showHideAppRatingPrompt: (isVisible) => dispatch(AppActions.showHideAppRatingPrompt(isVisible))
})

export default connect(mapStateToProps, mapDispatchToProps)(CommunityCreatePost)