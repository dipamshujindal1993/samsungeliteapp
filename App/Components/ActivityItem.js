import React from 'react'
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native'

import ImageEx from '@components/ImageEx'
import { Colors, Constants } from '@resources'
import I18n from '@i18n'
import { isEmpty, formatDate, formatNumber } from '@utils/TextUtils'
import PlayIcon from '@svg/icon_play.svg'
import PDFIcon from '@svg/icon_pdf'
import DocumentIcon from '@svg/icon_skills.svg'
import ProTag from '@components/ProTag'

import styles from './Styles/ActivityItemStyles'

function ActivityItem(props) {
    const { item, onPress, style, employeeType } = props

    const {
        activityId,
        activityName,
        activityType,
        activityImageUrl,
        contentType,
        startDate,
        pointsRange,
    } = item

    let showProTag = employeeType === Constants.EMPLOYEE_TYPES.ADVOCATE
        && (item.category == Constants.NEWS_CATEGORIES.PRO || item.optionalInteger1 == Constants.PRO_CONTENT)
    let contentTypeName = !isEmpty(contentType) ? contentType.replace('SEA_', '') : ''
    let imageProps = {
        style: styles.itemImage,
        source: { uri: activityImageUrl }
    };
    if(contentTypeName === Constants.RESOURCE_TYPES.PDF || contentTypeName === Constants.RESOURCE_TYPES.DOCUMENT){
        imageProps.renderDefaultSource = () => { return getDefaultImageSource(contentTypeName) };
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

    return (
        <TouchableOpacity style={[styles.itemContainer, { ...style }]} disabled={!onPress} onPress={() => onPress(activityId, activityName, contentTypeName)}>
            <View style={styles.itemImageContainer}>
                <ImageEx {...imageProps} />
                {activityType == Constants.ACTIVITY_TYPES.VIDEO &&
                    <View style={styles.itemTypeImage}>
                        <PlayIcon fill={Colors.rgb_ececec} width={24} height={24} />
                    </View>
                }
            </View>

            <View style={styles.itemDetailContainer}>
                <Text numberOfLines={2} style={styles.itemTitle}>{activityName}</Text>
                <Text style={styles.itemPostedDate}>{`${formatDate(new Date(startDate))}  |  ${contentTypeName}`}</Text>
                {pointsRange && pointsRange.max != 0 &&
                    <View style={styles.itemPointsContainer}>
                        <Text style={styles.itemPoints}>{formatNumber(pointsRange.max)}</Text>
                        <Text style={styles.itemPointsTitle}>{I18n.t('activities.pts')}</Text>
                    </View>
                }
                {showProTag && <ProTag style={styles.proTag} />}
            </View>
        </TouchableOpacity>
    )
}

export default ActivityItem
