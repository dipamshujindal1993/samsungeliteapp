import React from 'react'
import { Dimensions, Text, View } from 'react-native'
import { formatString } from '@utils/TextUtils'
import I18n from '@i18n'
import styles from './Styles/PollResultBarStyles'

const { width: screenWidth } = Dimensions.get('window')

function PollResultBar(props) {
    const { marginLeft, marginValue, result } = props

    let resultBarWidth = Math.floor(screenWidth - marginValue) * result

    return (
        <View style={styles.container}>
            <View style={[styles.resultView, { width: screenWidth - marginValue, marginLeft }]}>
                <View style={[styles.resultBar, { width: resultBarWidth }]} />
            </View>
            <Text style={styles.resultText}>
                {formatString(I18n.t('poll.poll_result'), (result * 100).toFixed(1))}
            </Text>
        </View>
    )
}

export default PollResultBar