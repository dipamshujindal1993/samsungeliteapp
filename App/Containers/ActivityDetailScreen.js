import React from 'react'
import {
    Text,
} from 'react-native'

function ActivityDetailScreen(props) {
    const {
        activityId,
    } = props.navigation.state.params
    return (
        <Text>{activityId}</Text>
    )
}

export default ActivityDetailScreen