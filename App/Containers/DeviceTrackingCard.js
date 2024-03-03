import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native'
import styles from './Styles/DeviceTrackingCardStyles'
import NavigationService from '@services/NavigationService'
import I18n from '@i18n'
import { Colors } from '@resources'
import CellIcon from '@svg/icon_cell.svg'

import { LOOKUP_TYPE } from './LookUpScreen'

export default class DeviceTrackingCard extends Component {
    render() {
        return (
            <TouchableOpacity
                style={styles.container}
                onPress={() => NavigationService.navigate('LookUpScreen', {
                    type: LOOKUP_TYPE.ADVOCATE,
                })}>
                <CellIcon width={94} height={94} fill={Colors.rgb_4a4a4a} />
                <View style={styles.title_info}>
                    <Text style={styles.title}>{I18n.t('pro_device_validation.title')}</Text>
                    <Text style={styles.info}>{I18n.t('pro_device_validation.info')}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}
