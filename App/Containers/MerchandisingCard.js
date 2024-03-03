import React, { Component } from 'react'
import { connect } from 'react-redux'

import ImageEx from '@components/ImageEx'
import NavigationService from '@services/NavigationService'

import styles from './Styles/MerchandisingCardStyles'

class MerchandisingCard extends Component {
    render() {
        return (
            <ImageEx
                containerStyle={styles.container}
                style={styles.image}
                source={{ uri: this.props.merchandisingImageUrl }}
                onPress={() => NavigationService.navigate('MerchandisingScreen')}
            />
        )
    }
}

const mapStateToProps = (state) => ({
    merchandisingImageUrl: state.remoteConfig.featureConfig.merchandising_image_url,
})

export default connect(mapStateToProps)(MerchandisingCard)