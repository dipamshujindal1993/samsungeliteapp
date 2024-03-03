import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'

import Widget from '@components/Widget'
import Carousel from '@components/Carousel'
import NavigationService from '@services/NavigationService'
import UserActions from '@redux/UserRedux'
import I18n from '@i18n'
import { open } from '@services/LinkHandler'

import styles from './Styles/NewsCardStyles'

class NewsCard extends Component {
    componentDidMount() {
        this.props.getBanners()
    }

    _openBannerLink = (item) => {
        open({ url: item.bannerLink })
    }

    _renderSeeAll() {
        if (this.props.banners && this.props.banners.data && this.props.banners.data.length > 3) {
            return (
                <TouchableOpacity style={styles.btnSeeAll} onPress={() => NavigationService.navigate('NewsScreen')}>
                    <Text style={styles.btnSeeAllText}>{I18n.t('news.see_all')}</Text>
                </TouchableOpacity>
            )
        }
    }

    _onRefresh = () => {
        this.props.getBanners()
    }

    _renderData() {
        if (this.props.isLoadingBanners) {
            return (
                <Widget isLoading={true} />
            )
        } else if (this.props.bannersFailure) {
            return (
                <Widget
                    message={I18n.t('news.msg_unable_to_load')}
                    onRefresh={this._onRefresh}
                />
            )
        } else {
            const data = this.props.banners && this.props.banners.data ? this.props.banners.data.slice(0, 3) : []
            if (data.length > 0) {
                return (
                    <Carousel
                        data={data}
                        onPressSelectItem={this._openBannerLink}
                    />
                )
            } else {
                return (
                    <Widget message={I18n.t('news.msg_no_news')} />
                )
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{I18n.t('news.card_title')}</Text>
                    {this._renderSeeAll()}
                </View>

                {this._renderData()}
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    isLoadingBanners: state.user.isLoadingBanners,
    bannersFailure: state.user.bannersFailure,
    banners: state.user.banners,
})

const mapDispatchToProps = (dispatch) => ({
    getBanners: () => dispatch(UserActions.getBanners()),
})
export default connect(mapStateToProps, mapDispatchToProps)(NewsCard)