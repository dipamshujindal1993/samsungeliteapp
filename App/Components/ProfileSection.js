import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
} from 'react-native'

import ProfileImage from '@components/ProfileImage'
import I18n from '@i18n'
import NavigationService from '@services/NavigationService'

import styles from './Styles/ProfileSectionStyles'

export default class ProfileSection extends Component {
    renderProfileImage() {
        const { profileImageUrl } = this.props
        return (
            <ProfileImage
                imageUrl={profileImageUrl}
                diameter={92}
            />
        )
    }

    renderName() {
        const { name } = this.props
        if (name) {
            return (
                <Text style={styles.profileName}>{name}</Text>
            )
        }
        return null
    }

    renderRepcode() {
        const { repCode } = this.props
        if (repCode) {
            return (
                <View style={styles.profileRepCodeView}>
                    <Text style={styles.profileRepCode}>{I18n.t('profile.rep_code')}</Text>
                    <Text style={styles.profileRepCodeValue}>{repCode}</Text>
                </View>
            )
        }
    }

    renderEmail() {
        const { email } = this.props
        if (email) {
            return (
                <Text style={styles.profileEmail}>{email}</Text>
            )
        }
    }

    render() {
        const {isviewOnly} = this.props
        return (
            <View style={styles.container}>
                {this.renderProfileImage()}
                <TouchableOpacity disabled={isviewOnly} style={[styles.btnEditProfile, !isviewOnly? styles.active: styles.inActive]}
                  onPress={() => NavigationService.navigate('EditProfileScreen')}>
                    <Text style={styles.editProfile}>{I18n.t('profile.edit_profile')}</Text>
                </TouchableOpacity>
                {this.renderName()}
                {this.renderRepcode()}
                {this.renderEmail()}
            </View>
        )
    }
}
