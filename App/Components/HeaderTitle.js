import React from 'react'
import {
    Text,
} from 'react-native'

import styles from './Styles/HeaderTitleStyles'

function HeaderTitle(props) {
    return (
        <Text style={[styles.title, props.style]}>{props.title}</Text>
    )
}

export default HeaderTitle