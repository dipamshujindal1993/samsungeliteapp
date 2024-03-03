import React from 'react'
import {
    View,
    FlatList
} from 'react-native'

import LoadingSpinner from '@components/LoadingSpinner'
import Separator from '@components/Separator'

import styles from './Styles/EndlessFlatListStyles'

_renderFooter = (loadedAll, ListFooterComponent) => {
    if (loadedAll) {
        if (ListFooterComponent) {
            return ListFooterComponent()
        } else {
            return null
        }
    } else {
        return (
            <View style={styles.footerContainer}>
                <LoadingSpinner />
            </View>
        )
    }
}

export default function EndlessFlatList(props) {
    if (props.error) {
        return (
            <>
                {props.ListHeaderComponent && props.ListHeaderComponent()}
                {props.error()}
                {props.ListFooterComponent && props.ListFooterComponent()}
            </>
        )
    } else {
        return (
            <FlatList
                {...props}
                keyExtractor={(item, index) => item.id || index.toString()}
                ItemSeparatorComponent={props.ItemSeparatorComponent || (() => <Separator style={styles.separator} />)}
                ListFooterComponent={() => _renderFooter(props.loadedAll, props.ListFooterComponent)}
                onEndReachedThreshold={0.1}
                onEndReached={!props.loadedAll && props.loadMore}
                keyboardDismissMode='on-drag'
                keyboardShouldPersistTaps='always'
            />
        )
    }
}