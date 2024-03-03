import React, { Component } from 'react'
import { connect } from 'react-redux'

import ImageEx from '@components/ImageEx'
import NavigationService from '@services/NavigationService'

import { LOOKUP_TYPE } from './LookUpScreen'

import styles from './Styles/SpotRewardsCardStyles'

class SpotRewardsCard extends Component {
    render() {
        return (
            <ImageEx
                containerStyle={styles.container}
                style={styles.image}
                source={{ uri: this.props.spotRewardsImageUrl }}
                onPress={() => NavigationService.navigate('LookUpScreen', {
                    type: LOOKUP_TYPE.REP,
                })}
            />
        )
    }
}

const mapStateToProps = (state) => ({
    spotRewardsImageUrl: state.remoteConfig.featureConfig.spot_rewards_image_url,
})

export default connect(mapStateToProps)(SpotRewardsCard)