import React from 'react';
import { FlatList, Text, View } from 'react-native'
import styles from './Styles/LeadStatusHelpScreenStyles'

export default function LeadStatusHelpScreen(props) {
    const { navigation } = props
    const leadStatusHelpData = navigation.getParam('leadStatusHelp')
    return(
        <View style={styles.baseView}>
            {leadStatusHelpData && leadStatusHelpData.length > 0 ? 
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={leadStatusHelpData}
                    renderItem={({ item, index }) => renderTypes(item, index)}
                    ItemSeparatorComponent={() => <View style={styles.itemSeparator}/>}
                /> : null }
        </View>
    )
}

renderTypes = (item, index) => {
    const statusType = Object.keys(item)[0]
    const statusItem = item[statusType]
    if (statusItem.display == false) {
        return null
    }
    const statusColor = statusItem.color
    const statusDescription = statusItem.description
    return(
        <View style={styles.itemView}>
            <View style={styles.statusTypeRow}>
                    <View style={[styles.statusColorIndicator, { backgroundColor: statusColor }]}/>
                    <Text style={styles.statusType}>{statusType}</Text>
                </View>
            <Text style={styles.statusDescription}>{statusDescription}</Text>
        </View>
    )
}