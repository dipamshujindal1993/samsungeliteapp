import React from 'react'
import {
  SafeAreaView,
} from 'react-native'
import AppInfo from '@components/AppInfo'

import LoadingSpinner from '@components/LoadingSpinner'

import styles from './Styles/SplashScreenStyles'

function SplashScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <AppInfo />
      <LoadingSpinner />
    </SafeAreaView>
  )
}

export default SplashScreen
