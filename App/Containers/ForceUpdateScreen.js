import React, { Component } from 'react'
import {
  Image,
  View,
} from 'react-native'

import I18n from '@i18n'
import Dialog from '@components/Dialog'
import LinkHandler from '@services/LinkHandler'
import { Constants } from '@resources'

import styles from './Styles/ForceUpdateScreenStyles'

export default class ForceUpdateScreen extends Component {
  render () {
    return (
      <View style={styles.container}>
        <Image 
          style={[styles.bgImage]}
          source={{ uri: `${Constants.S3_BASE_URL}/img_force_bg.png` }}
         />
        <Dialog 
          title={I18n.t('force_update.title')}
          message={I18n.t('force_update.message')}
          negative={I18n.t('force_update.cta_negative')}
          positive={I18n.t('force_update.cta_positive')}
          negativeOnPress={LinkHandler.closeEliteApp}
          positiveOnPress={LinkHandler.openStoreApp}
          textAlign={'left'}
          cancelable={false}
        />
      </View>
    )
  }
}
