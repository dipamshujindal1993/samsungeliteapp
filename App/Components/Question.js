import React from 'react'
import {
    Text,
    View
} from 'react-native'
import { isEmpty } from '@utils/TextUtils'

import styles from './Styles/QuestionStyles'

function Question(props) {
    const { title, questionText, style } = props
    return (
        <View style={[styles.container, { ...style }]}>
            {!isEmpty(title) && <Text style={styles.questionTitle}>{title}</Text>}
            {!isEmpty(questionText) && <Text style={styles.questionText}>{questionText}</Text>}
        </View>
    )
}

export default Question
