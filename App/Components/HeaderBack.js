import React from 'react'
import { HeaderBackButton } from 'react-navigation-stack'

import { Platform } from 'react-native'

function HeaderBack(props) {
    return (
        <HeaderBackButton backTitleVisible={Platform.OS === 'ios' ? props.backTitleVisible : false} onPress={props.onPress} />
    )
}

export default HeaderBack