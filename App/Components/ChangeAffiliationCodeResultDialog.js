import React, { Component } from 'react'
import { connect } from 'react-redux'

import UserActions from '@redux/UserRedux'
import Dialog from '@components/Dialog'
import I18n from '@i18n'

class ChangeAffiliationCodeResultDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showDialog: false
        }
    }

    componentDidMount() {
        const { shouldShowChangingAffiliationCodeSuccessDialog } = this.props
        if (shouldShowChangingAffiliationCodeSuccessDialog) {
            this.timer = setTimeout(() => {
                this.setState({ showDialog: true })
            }, 0);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timer)
    }

    render() {
        const {
            shouldShowChangingAffiliationCodeSuccessDialog,
            refreshAudiencesFailure,
            showHideChangingAffiliationCodeSuccessDialog,
        } = this.props
        const { showDialog } = this.state

        return (
            <Dialog
                title={I18n.t('sign_up.refresh_success_title')}
                negativeOnPress={() => showHideChangingAffiliationCodeSuccessDialog(false)}
                message={refreshAudiencesFailure ? I18n.t('sign_up.refresh_failure_message') : I18n.t('sign_up.refresh_success_message')}
                negative={I18n.t('sign_up.affiliation_code_dialog_cta')}
                visible={showDialog && shouldShowChangingAffiliationCodeSuccessDialog}
            />
        )
    }
}

const mapStateToProps = (state) => ({
    shouldShowChangingAffiliationCodeSuccessDialog: state.user.shouldShowChangingAffiliationCodeSuccessDialog,
    refreshAudiencesFailure: state.user.refreshAudiencesFailure,
})

const mapDispatchToProps = (dispatch) => ({
    showHideChangingAffiliationCodeSuccessDialog: (isVisible) => dispatch(UserActions.showHideChangingAffiliationCodeSuccessDialog(isVisible)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ChangeAffiliationCodeResultDialog)