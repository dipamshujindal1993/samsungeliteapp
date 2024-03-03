import React from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import I18n from '@i18n'
import BonusBox from '@components/BonusBox'
import ToastMessage from '@components/ToastMessage'
import ActivitiesActions from '@redux/ActivitiesRedux'
import UserActions from '@redux/UserRedux'
import Button from '@components/Button'
import { formatNumber, formatString } from '@utils/TextUtils'
import { Constants } from '@resources'

import { styles, customStyle } from './Styles/BonusPointStyle'


function getUnique(list, num) {
    let ret = []
    for (let i = 0; i < num; i++) {
        let index = Math.floor(Math.random() * list.length)
        let removed = list.splice(index, 1)
        ret.push(removed[0])
    }
    return ret
}

class BonusPoints extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            title: I18n.t('bonus.header_title'),
            headerRight: () => (
                <View style={styles.headerRight}>
                    <Text style={styles.headerRightText}>{params && formatNumber(params.points)}</Text>
                </View>
            )
        }
    }

    // Will change the static value, when we will get response from api.
    state = {
        box: [],
        isSelect: false
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.isSelect != prevState.isSelect) {
            this.props.getPoints();
        }
        if(this.props.points != prevProps.points){
            const { navigation, points } = this.props;
            let totalPoints = points ? points.totalPoint : 0
            navigation.setParams({ points: parseInt(totalPoints) });
        }
    }

    componentDidMount() {
        const { bonusPoints } = this.props;
        if (bonusPoints) {
            let bonusArray = bonusPoints.split(',')
            let box = getUnique(bonusArray, 3)
            this.setState({ box });
        }
    }


    onPressBox = (bonus) => {
        this.setState({ isSelect: true, box: [`${bonus}`] }, () => {
            const {
                activityId,
                activityName,
            } = this.props.navigation.state.params
            this.props.postPoints(bonus, activityId, activityName)
            ToastMessage(formatString(I18n.t('bonus.bonus_point'), bonus))
        })
    }

    bonusBox(isBonus) {
        return (
            <BonusBox
                box={this.state.box}
                isSelect={this.state.isSelect}
                iconStyle={!isBonus ? customStyle.bonusGiftIcon : customStyle.congratulationGiftIcon}
                customStyle={!isBonus ? styles.bonusBox : styles.congratulationBox}
                onPressBox={(points) => this.onPressBox(points)} />
        )
    }

    onPressFinish = () => {
        this.props.navigation.goBack()
    }

    render() {
        const { isSelect } = this.state;
        let title = !isSelect ? I18n.t('bonus.bonus_screen_title') : I18n.t('bonus.congratulations')
        return (
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>{title}</Text>
                </View>
                <View style={styles.box}>
                    {this.bonusBox(isSelect)}
                </View>
                <View style={styles.bottom}>
                    {isSelect &&
                        <Button
                            title={I18n.t('bonus.finish')}
                            style={styles.button}
                            onPress={() => this.onPressFinish()} />
                    }
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    bonusPoints: state.remoteConfig.featureConfig && state.remoteConfig.featureConfig.bonus_points ? state.remoteConfig.featureConfig.bonus_points : undefined,
    points: state.user.points
})

const mapDispatchToProps = (dispatch) => ({
    postPoints: (point, activityId, reason) => dispatch(ActivitiesActions.postPoints(point, activityId, Constants.TRANSACTION_TYPE.QUIZ_BONUS_POINTS, reason)),
    getPoints: () => dispatch(UserActions.getPoints())
})

export default connect(mapStateToProps, mapDispatchToProps)(BonusPoints)