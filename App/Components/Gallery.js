import React, { Component } from 'react';
import {
    Platform,
    View,
    FlatList,
    TouchableOpacity,
    Text
} from 'react-native';

import CameraRoll from "react-native-cameraroll"
import  { getFileSizeInMBFromByte } from '@utils/CommonUtils'
import styles from './Styles/GalleryStyles'
import { Colors, Constants } from '@resources'
import { formatString } from '@utils/TextUtils'
import I18n from '@i18n'
import ImageEx from '@components/ImageEx'

import CompleteIcon from '@svg/icon_complete.svg'
import PlayIcon from '@svg/icon_play.svg'

export default class Gallery extends Component {

    isFetchingPhotos = false
    pagesFetched = 0
    currentPageInfo = { has_next_page: true }

    constructor(props) {
        super(props);
        this.state = {
            images: [],
            isCameraLoaded: false,
        }
    }

    componentDidMount() {
        this.loadPhotos()
    }

    loadPhotos = async () => {
        if (this.isFetchingPhotos || !this.currentPageInfo.has_next_page) {
            return
        }

        this.isFetchingPhotos = true

        try {
            const cameraRollParams = {
                first: 10,
                after: this.currentPageInfo.end_cursor,
                assetType: 'All',
            }
            if (Platform.OS == "ios") {
                cameraRollParams.groupTypes = 'All'
            }

            const data = await CameraRoll.getPhotos(cameraRollParams)
            this.setState({
                images: [...this.state.images, ...data.edges],
                isCameraLoaded: true
            })
            this.pagesFetched++
            this.currentPageInfo = data.page_info
        } catch (e) {
        } finally {
            this.isFetchingPhotos = false
        }
    }

    _renderGrid(image, index) {
        const { selectedFileIndexArray } = this.props;

        const fileSizeMB = getFileSizeInMBFromByte(image.node.image.fileSize)
        let isValidSize = fileSizeMB <=Constants.FILE_MAX_SIZE_TO_UPLOAD

        let imageContainerStyle = {}
        if(index%3 == 2)
            imageContainerStyle = {...styles.imageContainer, paddingRight: 0}
        else
            imageContainerStyle = styles.imageContainer

        return (
            <TouchableOpacity
                style={imageContainerStyle}
                key={index}
                activeOpacity={0.8}
                onPress={() => isValidSize && this.onImageClick(index)}>
                <ImageEx style={styles.image} source={{ uri: image.node.image.uri }} />
                {!isValidSize ?
                    <View style={styles.oversizeTextContainer}>
                        <Text style={styles.oversizeText}>{formatString(I18n.t('create_post.oversize'),Constants.FILE_MAX_SIZE_TO_UPLOAD)}</Text>
                    </View>
                :
                     selectedFileIndexArray.indexOf(index) != -1? 
                        <CompleteIcon width={24} height={24} fill={Colors.rgb_4297ff} style={styles.selectBox}/>: 
                        <View style={styles.unselectBox} />
                }
                {
                    image.node.type.includes("video") &&
                    <View style={styles.playIconContainer}>
                        <PlayIcon width={34} height={34} fill={Colors.rgb_d8d8d8}/>
                    </View>
                }
             </TouchableOpacity>
        )
    }

    onImageClick(index) {
        const { images } = this.state;
        const { onFileSelect } = this.props;
        onFileSelect({ ...images[index].node.image, type: images[index].node.type,fileIndex:index })
    }

    render() {
        
        const { visible } = this.props;
        const { images } = this.state;
        if (!visible || !images.length) {
            return null
        }
        
        return (
            <View style={styles.containder} >
                <FlatList
                    numColumns={3}
                    onEndReachedThreshold={0.1}
                    onEndReached={this.loadPhotos}
                    data={images}
                    extraData={this.state}
                    keyExtractor={(image, index) => index.toString()}
                    renderItem={({ item, index }) => this._renderGrid(item, index)}
                />
            </View>
        )
    }

}
