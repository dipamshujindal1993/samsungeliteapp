import React, { Component } from 'react'
import { connect } from 'react-redux'

import UserActions from '@redux/UserRedux'

import NavigationService from '@services/NavigationService'
import Carousel from '@components/Carousel'
import Widget from '@components/Widget'
import I18n from '@i18n'

import { Constants } from '@resources'

const LIMIT = 10

class Missions extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            data: [],
        }
        this.offset = 0
    }

    componentDidMount() {
        if (this.props.employeeType == Constants.EMPLOYEE_TYPES.ADVOCATE) {
            this._getMissions()
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.missions != this.props.missions && this.props.missions) {
            const {
                missions,
            } = this.props
            this.total = missions.pagination.total
            this.setState((prevState) => ({
                isLoading: false,
                data: this.offset > 0 ? prevState.data.concat(missions.data) : missions.data,
            }))
            this.loadingMore = false
        }

        if (prevProps.missionsFailure != this.props.missionsFailure && this.props.missionsFailure) {
            this.setState({
                isLoading: false,
            })
            this.loadingMore = false
        }
    }

    _onRefresh = () => {
        this._getMissions()
    }

    _getMissions = () => {
        this.props.getMissions(LIMIT, this.offset)
    }

    _onPressSelectItem = (item) => {
        NavigationService.navigate('TaskAndMissionDetailScreen', { isMission: true, initiativeId: item.initiativeId })
    }

    render() {
        if (this.props.employeeType == Constants.EMPLOYEE_TYPES.ADVOCATE) {
            const { missionsFailure } = this.props
            if (this.state.isLoading) {
                return (
                    <Widget isLoading={true} />
                )
            } else if (missionsFailure) {
                return (
                    <Widget
                        message={I18n.t('missions.msg_unable_to_load')}
                        onRefresh={this._onRefresh}
                    />
                )
            } else {
                const {
                    data,
                } = this.state
                if (data && data.length > 0) {
                    return (
                        <Carousel
                            type={Constants.CAROUSEL_TYPES.MISSION}
                            data={data}
                            onPressSelectItem={this._onPressSelectItem}
                            loadMore={() => {
                                if (!this.loadingMore) {
                                    this.offset += LIMIT
                                    this._getMissions()
                                    this.loadingMore = true
                                }
                            }}
                            loadedAll={data.length >= this.total}
                        />
                    )
                } else {
                    return (
                        <Widget message={I18n.t('missions.msg_no_missions')} />
                    )
                }
            }
        }
        return null
    }
}

const mapStateToProps = (state) => ({
    employeeType: state.user.summary ? state.user.summary.employeeType : undefined,
    missions: state.user.missions,
    missionsFailure: state.user.missionsFailure,
})

const mapDispatchToProps = (dispatch) => ({
    getMissions: (limit, offset) => dispatch(UserActions.getInitiatives(Constants.INITIATIVE_TYPES.MISSION, limit, offset)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Missions)