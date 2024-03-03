import React from 'react';
import { View, Text } from 'react-native';
import styles from './Styles/RadioButtonStyle'

export default function RadioButton(props) {
    const { isSelected, isSubmited, optionText } = props
    let commanStyle = styles.selectOptionTxt;
    let radioOutSide = [styles.radioOutsideView]
    if (isSelected) {
        radioOutSide.push(styles.selectedRadioOutSide)
        commanStyle = styles.selectOptionTxt;
    } else if (isSubmited) {
        radioOutSide.push(styles.unselectedRadioOutSide)
        commanStyle = styles.unselectOptionTxt;
    }

    return (
        <View style={styles.container}>
            <View style={radioOutSide}>
                {isSelected && <View style={styles.radioInsideView} />}
            </View>
            <View style={styles.optionView}>
                <Text style={commanStyle}>{optionText}</Text>
            </View>
        </View>
    )
}
