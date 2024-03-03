import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native'

import LoadingSpinner from '@components/LoadingSpinner'
import RefreshIcon from '@svg/icon_syncing'

import { Colors } from '@resources'
import styles from './Styles/WidgetStyles'

function Widget(props) {
    return (
        <View style={styles.container}>
            <Text style={styles.message}>{props.message}</Text>
            {props.onRefresh && <TouchableOpacity style={styles.refreshButton} onPress={props.onRefresh}>
                <RefreshIcon width={13} height={13} fill={Colors.rgb_4297ff} />
                <Text style={styles.refresh}>Refresh</Text>
            </TouchableOpacity>}
            {props.isLoading && <LoadingSpinner />}
        </View>
    )
}

export default Widget