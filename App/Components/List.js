import React from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableOpacity
} from 'react-native'

import ErrorScreen from '@containers/ErrorScreen'
import Separator from '@components/Separator'
import ImageEx from '@components/ImageEx'
import ProTag from '@components/ProTag'
import { isEmpty } from '@utils/TextUtils'
import { Constants } from '@resources'

import styles from './Styles/ListStyles'

renderSeparator = () => {
    return <Separator style={styles.separator} />
}

renderItem = (item, onItemPress, employeeType) => {
    const showProTag = employeeType === Constants.EMPLOYEE_TYPES.ADVOCATE
        && (item.category == Constants.NEWS_CATEGORIES.PRO || item.optionalInteger1 == Constants.PRO_CONTENT)
    return (
        <TouchableOpacity disabled={!onItemPress} onPress={() => onItemPress(item.activityId)}>
            <View style={styles.itemContainer}>
                {showProTag && <ProTag style={styles.proTag}/>}
                <ImageEx
                    style={styles.itemImage}
                    source={{ uri: item.activityImageUrl }}
                />
                <View style={styles.itemDetailContainer}>
                    <Text numberOfLines={2} style={styles.itemTitle}>{item.activityName}</Text>
                    <Text numberOfLines={2} style={styles.itemDescription}>{item.activityDescription}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

/*
* this component can be useful while having Image, Title, Descripton only need to show on Courses, News, Promos, FAQ
*/
export default function List(props) {
    const {
        data,
        error,
        style,
        ListHeaderComponent,
        ListFooterComponent,
        onItemPress,
        employeeType,
    } = props
    if (!isEmpty(error)) {
        return (
            <>
                {ListHeaderComponent && ListHeaderComponent()}
                <ErrorScreen
                    title={error}
                />
                {ListFooterComponent && ListFooterComponent()}
            </>
        )
    }
    else if (data && data.length > 0) {
        return (
            <FlatList
                {...props}
                style={[styles.listContainer, style]}
                data={data}
                renderItem={({ item, index }) => renderItem(item, onItemPress, employeeType)}
                ItemSeparatorComponent={() => renderSeparator()}
                keyExtractor={(item, index) => index.toString()}
            />
        )
    } else if (ListHeaderComponent || ListFooterComponent) {
        return (
            <>
                {ListHeaderComponent && ListHeaderComponent()}
                {ListFooterComponent && ListFooterComponent()}
            </>
        )
    } else {
        return null
    }
}