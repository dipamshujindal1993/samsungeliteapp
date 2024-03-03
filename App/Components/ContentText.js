import React from 'react';
import {
  Text,
  View
} from 'react-native';

import styles from './Styles/ContentTextStyles';

export default function ContentText(props) {
  const { accessibilityLabel, style, text, textStyle } = props
  return (
    <View style={[styles.container, style]}>
      <Text
        accessibilityLabel={accessibilityLabel}
        style={[styles.text, textStyle]}
      >{text}</Text>
    </View>
  );
}
