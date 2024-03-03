import React from 'react'
import {
    Text,
} from 'react-native'

function ResourcesDetailScreen(props) {
    const {
        activityId,
        activityName,
    } = props.navigation.state.params
    return (
        <Text>{activityId}: {activityName}</Text>
    )
}

export default ResourcesDetailScreen