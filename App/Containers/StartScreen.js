import React, { Component } from 'react'
import {
  SafeAreaView,
  View,
  Platform,
} from 'react-native'
import { connect } from 'react-redux'

import AppInfo from '@components/AppInfo'
import Button from '@components/Button'
import SecondaryButton from '@components/SecondaryButton'
import TertiaryButton from '@components/TertiaryButton'
import I18n from '@i18n'

import styles from './Styles/StartScreenStyles'

class StartScreen extends Component {
  static navigationOptions = {
    header: null,
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <AppInfo />
        </View>
        <Button
          title={I18n.t('start.login')}
          onPress={() => this.props.navigation.navigate('LoginScreen')}
        />
        <SecondaryButton
          title={I18n.t('start.sign_up')}
          style={styles.btnSignUp}
          onPress={() => this.props.navigation.navigate('SignUpStep1')}
          disabled={!this.props.useProxy}
        />
        {Platform.OS === 'ios' && <TertiaryButton
          title={I18n.t('start.guest_mode')}
        />}
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => ({
  useProxy: state.remoteConfig.apiConfig && state.remoteConfig.apiConfig.use_proxy,
})

export default connect(mapStateToProps)(StartScreen)