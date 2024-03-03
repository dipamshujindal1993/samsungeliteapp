import React from 'react'
import {
  Text,
  View,
} from 'react-native' 

import I18n from '@i18n'

import styles from './Styles/ProTagStyles'

export default ProTag = (props) => {
  return (
    <View style={[props.style, styles.proContainer]}>
      <Text style={styles.proText}>{I18n.t('learn.pro_tag')}</Text>
    </View>
  )
}