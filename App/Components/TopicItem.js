import React from 'react'
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native'

import ImageEx from '@components/ImageEx'
import Separator from '@components/Separator'
import { Colors, Constants } from '@resources'
import { isEmpty } from '@utils/TextUtils'
import I18n from '@i18n'
import AttachmentIcon from '@svg/icon_attachment.svg'
import DocumentIcon from '@svg/icon_skills.svg'
import FolderIcon from '@svg/icon_folder.svg'
import PDFIcon from '@svg/icon_pdf.svg'
import PlayIcon from '@svg/icon_play.svg'

import styles from './Styles/TopicItemStyles'

function TopicItem(props) {
    const {
        item,
        onPressItem,
        onPressSeeAll
    } = props

    const {
        topicId,
        topicName,
        activities
    } = item

    renderHeader = (topicId, topicName) => {
        return (
            <View style={styles.sectionHeader} >
                <Text style={styles.sectionTitle}> {topicName}</Text>
                <TouchableOpacity disable={!topicId} onPress={() => onPressSeeAll(topicId, topicName)}>
                    <Text style={styles.seeAllTitle}> {I18n.t('learn_resource.see_all')}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderFileTypes = (contentType) => {
        let contentTypeName = !isEmpty(contentType) && contentType.replace('SEA_', '')

        switch (contentTypeName) {
            case Constants.RESOURCE_TYPES.DOCUMENT:
                return <>
                    <DocumentIcon fill={Colors.rgb_4a4a4a} width={14} height={13} />
                    <Text style={[styles.itemType, styles.itemTitleMargin]}>
                        {contentTypeName}
                    </Text>
                </>
            case Constants.RESOURCE_TYPES.FOLDER:
                return <>
                    <FolderIcon fill={Colors.rgb_4a4a4a} width={13} height={11} />
                    <Text style={[styles.itemType, styles.itemTitleMargin]}>
                        {contentTypeName}
                    </Text>
                </>
            case Constants.RESOURCE_TYPES.IMAGE:
            case Constants.RESOURCE_TYPES.PHOTO:
                return <>
                    <AttachmentIcon fill={Colors.rgb_4a4a4a} width={13} height={13} />
                    <Text style={[styles.itemType, styles.itemTitleMargin]}>
                        {contentTypeName}
                    </Text>
                </>
            case Constants.RESOURCE_TYPES.PDF:
                return <>
                    <PDFIcon fill={Colors.rgb_4a4a4a} width={11} height={13} />
                    <Text style={[styles.itemType, styles.itemTitleMargin]}>
                        {contentTypeName}
                    </Text>
                </>
            case Constants.RESOURCE_TYPES.VIDEO:
                return <>
                    <PlayIcon fill={Colors.rgb_4a4a4a} width={14} height={14} />
                    <Text style={[styles.itemType, styles.itemTitleMargin]}>
                        {contentTypeName}
                    </Text>
                </>
            default:
                return <Text style={styles.itemType}>
                    {contentTypeName}
                </Text>
        }
    }

    renderActivityItem = (activity) => {
        const { activityId, activityName, activityType, activityImage, contentType } = activity
        let contentTypeName = !isEmpty(contentType) && contentType.replace('SEA_', '')
        let imageProps = {
            style: styles.itemImage,
            source: { uri: activityImage }
        };
        if(contentTypeName === Constants.RESOURCE_TYPES.PDF || contentTypeName === Constants.RESOURCE_TYPES.DOCUMENT){
            imageProps.renderDefaultSource = () => { return getDefaultImageSource(contentTypeName) };
        }
        return (
            <View key={activityId.toString()}>
                <TouchableOpacity style={styles.itemContainer} disabled={!onPressItem} onPress={() => onPressItem(activity)}>
                    <View style={styles.itemImageContainer}>
                        <ImageEx {...imageProps} />
                        {activityType == Constants.ACTIVITY_TYPES.VIDEO &&
                            <View style={styles.itemTypeImage}>
                                <PlayIcon fill={Colors.rgb_ececec} width={24} height={24} />
                            </View>
                        }
                    </View>

                    <View style={styles.itemDetailContainer}>
                        <Text style={styles.itemTitle} numberOfLines={2}>{activityName}</Text>
                        <View style={styles.itemTypeContainer}>
                            {this.renderFileTypes(contentType)}
                        </View>
                    </View>
                </TouchableOpacity>
                <Separator style={styles.itemSeparator} />
            </View>
        )
    }

    getDefaultImageSource = (contentType) => {
        if(contentType === Constants.RESOURCE_TYPES.PDF){
            return(
                <TouchableOpacity disabled={true}>
                  <View style={[styles.itemImage, { backgroundColor: Colors.rgb_f9f9f9, alignItems: 'center', justifyContent: 'center' }]}>
                    <PDFIcon width={45} height='30%' fill={Colors.rgb_9b9b9b} />
                  </View>
                </TouchableOpacity>
            );
        }else if(contentType === Constants.RESOURCE_TYPES.DOCUMENT){
            return(
                <TouchableOpacity disabled={true}>
                  <View style={[styles.itemImage, { backgroundColor: Colors.rgb_f9f9f9, alignItems: 'center', justifyContent: 'center' }]}>
                    <DocumentIcon width={45} height='30%' fill={Colors.rgb_9b9b9b} />
                  </View>
                </TouchableOpacity>
            );
        }else{
            return null;
        }
    }

    if (activities && activities.length) {
        return (
            <View style={[styles.sectionContainer]}>
                {this.renderHeader(topicId, topicName)}
                {activities.map((activity) => {
                    return this.renderActivityItem(activity)
                })}
            </View>
        )
    } else {
        return null
    }
}

export default TopicItem
