import React from 'react'
import {
  View,
} from 'react-native'
import AppName from '@svg/icon_logo_elite.svg'
// import AppIcon from '@svg/icon_splash.svg'

import styles from './Styles/AppInfoStyles'

function AppInfo() {
  return (
    <View style={styles.container}>
      <AppName />
      {/* <AppIcon style={styles.icon} /> */}
    </View>
  )
}

export default AppInfo
