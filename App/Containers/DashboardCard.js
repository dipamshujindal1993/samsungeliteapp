import React, { Component } from 'react'
import {
    TouchableOpacity,
    View,
    Text,
} from 'react-native'
import { connect } from 'react-redux'

import I18n from '@i18n'
import { Colors } from '@resources'
import ChartIcon from '@svg/icon_bar_chart.svg'
import { open } from '@services/LinkHandler'

import styles from './Styles/DashboardCardStyles'

class DashboardCard extends Component {
    render() {
        return (
            <TouchableOpacity
                style={styles.container}
                onPress={() => open({ url: this.props.tableauUrl })}>
                <ChartIcon style={styles.icon} width={48} height={48} fill={Colors.rgb_4a4a4a} />
                <View style={styles.title_info}>
                    <Text style={styles.title}>{I18n.t('dashboard.title')}</Text>
                    <Text style={styles.info}>{I18n.t('dashboard.info')}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const mapStateToProps = (state) => ({
    tableauUrl: state.remoteConfig.featureConfig.tableau_url,
})

export default connect(mapStateToProps)(DashboardCard)