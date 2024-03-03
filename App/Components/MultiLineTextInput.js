import React, { Component } from 'react'
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'

import {
    Colors,
} from '@resources'

import styles from './Styles/MultiLineTextInputStyles'

export default class MultiLineTextInput extends Component {
    constructor(props) {
        super(props)

        this.state = {
            text: props.value || ''
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.value != prevProps.value) {
            this.setState({
                text: this.props.value,
            })
        }
    }
    _onChangeText = (text) => {
        this.setState({
            text,
        })

        if (this.props.onChangeText) {
            this.props.onChangeText(text)
        }
    }

    render() {
        const {
            blurOnSubmit,
            editable,
            error,
            errorMessage,
            maxLength,
            placeholder,
            placeholderTextColor,
            showLengthLimit,
            returnKeyType,
            onSubmitEditing,
            numberOfLines,
            label,
            labelStyle,
            inputStyle,
            icon,
            onIconPress,
            style,
            inputRef
        } = this.props

        const { text } = this.state

        const borderBottom = {
            borderBottomColor: error ? Colors.rgb_ff4337 : Colors.rgb_d8d8d8,
            borderBottomWidth: 0.5,
        }

        return (
            <View style={[styles.container,style]}>
                {
                    label &&
                        <View style={styles.label_info}>
                            <Text style={[styles.label,labelStyle]}>{label}</Text>
                            { icon && <TouchableOpacity disabled={!onIconPress} onPress={onIconPress} style={styles.icon}>{icon}</TouchableOpacity> }
                        </View>
                }
                <TextInput
                    {...this.props}
                    ref={inputRef}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderTextColor ? placeholderTextColor : Colors.rgb_b9b9b9}
                    pointerEvents={editable == false ? 'none' : 'auto'}
                    autoCompleteType={'off'}
                    style={[styles.textInput,inputStyle, borderBottom]}
                    maxLength={maxLength}
                    multiline
                    numberOfLines={Platform.OS === 'ios' ? null : numberOfLines}
                    maxHeight={numberOfLines ? (Platform.OS === 'ios' ? (14 * numberOfLines) : (12 * numberOfLines)) : null}
                    textAlignVertical={'top'}
                    returnKeyType={returnKeyType ? returnKeyType : 'next'}
                    onChangeText={this._onChangeText}
                    onSubmitEditing={onSubmitEditing ? () => onSubmitEditing(text) : null}
                    blurOnSubmit={blurOnSubmit}
                    value={text}
                    editable={editable}
                />
                {showLengthLimit && <Text style={styles.lengthLimitText}> {`${text.length}${'/'}${maxLength}`}</Text>}
                {error && errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
            </View>
        )
    }
}