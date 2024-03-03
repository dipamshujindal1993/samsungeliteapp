import React from 'react'
import {
    Modal,
    View,
    Platform,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native'

import styles from './Styles/DialogStyles'

renderTitle = (title, textAlign) => {
    if (title) {
        return (
            <Text style={[styles.title, { textAlign }]}>{title}</Text>
        )
    }
    return null
}

renderMessage = (message, textAlign) => {
    if (message) {
        return (
            <Text style={[styles.message, { textAlign }]}>{message}</Text>
        )
    }
    return null
}

_renderBody = (renderBody) => {
    if (renderBody) {
        return renderBody()
    }
}

renderCTA = (negative, positive, negativeOnPress, positiveOnPress) => {
    return (
        <View style={styles.ctaView}>
            {negative &&
                <TouchableOpacity onPress={() => negativeOnPress()}>
                    <Text style={styles.cta}>{negative}</Text>
                </TouchableOpacity>}
            {positive &&
                <TouchableOpacity onPress={() => positiveOnPress()} disabled={!positiveOnPress}>
                    <Text style={[styles.cta, (!positiveOnPress && styles.ctaDisabled)]}>{positive}</Text>
                </TouchableOpacity>}
        </View>
    )
}

export default function Dialog(props) {
    const {
        title,
        message,
        textAlign,
        renderBody,
        cancelable,
        onDismiss,
        visible,
        hasTextInput,
        negative,
        negativeOnPress,
        positive,
        positiveOnPress,
    } = props
    return (
        <Modal
            transparent
            hardwareAccelerated
            visible={visible}
            onRequestClose={() => cancelable != false && onDismiss ? onDismiss() : null}
        >
            <TouchableWithoutFeedback disabled={cancelable == false} onPress={onDismiss}>
                <View style={styles.background}>
                    <TouchableWithoutFeedback>
                        <View style={styles.dialogView}>
                            {renderTitle(title, textAlign)}
                            {renderMessage(message, textAlign)}
                            {_renderBody(renderBody)}
                            {renderCTA(negative, positive, negativeOnPress, positiveOnPress)}
                        </View>
                    </TouchableWithoutFeedback>
                    {hasTextInput && Platform.OS === 'ios' && <View style={styles.iosFooter} />}
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}