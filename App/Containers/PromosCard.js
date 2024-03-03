import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'

import I18n from '@i18n'
import { Constants } from '@resources'
import NavigationService from '@services/NavigationService'
import ActivitiesActions from '@redux/ActivitiesRedux'
import Carousel from '@components/Carousel'
import Widget from '@components/Widget'

import styles from './Styles/PromosCardStyles'

class PromosCard extends Component {
    componentDidMount() {
        this.props.getCourses(Constants.ACTIVITY_TYPES.PROMO)
    }

    _onPressSelectItem = (item) => {
        NavigationService.navigate('ArticleDetailScreen', { activityId: item.activityId })
    }

    _renderSeeAll() {
        if (this.props.promos && this.props.promos.length > 3) {
            return (
                <TouchableOpacity style={styles.btnSeeAll} onPress={() => NavigationService.navigate('CoursesScreen', { activityType: Constants.ACTIVITY_TYPES.PROMO, headerTitle: I18n.t('promos.promos') })}>
                    <Text style={styles.btnSeeAllText}>{I18n.t('promos.see_all')}</Text>
                </TouchableOpacity>
            )
        }
    }

    _onRefresh = () => {
        this.props.getCourses(Constants.ACTIVITY_TYPES.PROMO)
    }

    _renderData() {
        if (this.props.isLoadingPromos) {
            return (
                <Widget isLoading={true} />
            )
        } else if (this.props.promosFailure) {
            return (
                <Widget
                    message={I18n.t('promos.msg_unable_to_load')}
                    onRefresh={this._onRefresh}
                />
            )
        } else {
            const data = this.props.promos ? this.props.promos.slice(0, 3) : []
            if (data.length > 0) {
                return (
                    <Carousel
                        data={data}
                        onPressSelectItem={this._onPressSelectItem}
                    />
                )
            } else {
                return (
                    <Widget message={I18n.t('promos.msg_no_promos')} />
                )
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{I18n.t('promos.card_title')}</Text>
                    {this._renderSeeAll()}
                </View>

                {this._renderData()}
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    isLoadingPromos: state.activities.isLoadingPromos,
    promosFailure: state.activities.promosFailure,
    promos: state.activities.promos,
})

const mapDispatchToProps = (dispatch) => ({
    getCourses: (activityType) => dispatch(ActivitiesActions.getCourses(activityType))
})
export default connect(mapStateToProps, mapDispatchToProps)(PromosCard)