import React, { Component } from 'react'
import {
    Platform,
    View,
    TextInput,
    TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'

import I18n from '@i18n'
import SearchActions from '@redux/SearchRedux'

import BackIcon from '@svg/icon_arrowleft'
import CloseIcon from '@svg/icon_close'

import {
    Colors,
} from '@resources'

import styles from './Styles/SearchInputStyles'

class SearchInput extends Component {
    componentDidUpdate(prevProps) {
        const {
            searchTerm,
        } = this.props
        if (prevProps.searchTerm != searchTerm && searchTerm == '' && this._textInput) {
            this._textInput.focus()
        }
    }

    render() {
        const {
            navigation,
            searchTerm,
            showHideSearchSuggestions,
            updateSearchTerm,
            triggerSearching,
        } = this.props
        return (
            <View style={styles.searchInputContainer}>
                {Platform.OS === 'ios' && <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
                    <BackIcon fill={Colors.rgb_4a4a4a} />
                </TouchableOpacity>}
                <TextInput
                    ref={component => this._textInput = component}
                    style={styles.searchInput}
                    autoFocus={true}
                    placeholder={I18n.t('search.search_app')}
                    placeholderTextColor={Colors.rgba_4a4a4a80}
                    onChangeText={(text) => {
                        showHideSearchSuggestions(true)
                        updateSearchTerm(text)
                    }}
                    value={searchTerm}
                    returnKeyType='search'
                    onSubmitEditing={() => {
                        if (searchTerm) {
                            showHideSearchSuggestions(false)
                            triggerSearching()
                        }
                    }}
                />
                <TouchableOpacity style={styles.deleteIcon} onPress={() => {
                    showHideSearchSuggestions(true)
                    updateSearchTerm('')
                }}>
                    <CloseIcon fill={Colors.rgb_4a4a4a} width={14} height={14} />
                </TouchableOpacity>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    searchTerm: state.search.searchTerm,
})

const mapDispatchToProps = (dispatch) => ({
    updateSearchTerm: (searchTerm) => dispatch(SearchActions.updateSearchTerm(searchTerm)),
    showHideSearchSuggestions: (isVisible) => dispatch(SearchActions.showHideSearchSuggestions(isVisible)),
    triggerSearching: () => dispatch(SearchActions.triggerSearching()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchInput)