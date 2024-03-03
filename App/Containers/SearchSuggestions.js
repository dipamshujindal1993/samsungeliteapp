import React, { Component } from 'react'
import {
    View,
    TouchableOpacity,
    Text,
    Keyboard,
} from 'react-native'
import { connect } from 'react-redux'

import EndlessFlatList from '@components/EndlessFlatList'
import SearchActions from '@redux/SearchRedux'
import SearchIcon from '@svg/icon_search.svg'
import {
    Colors,
    Constants,
} from '@resources'

import styles from './Styles/SearchSuggestionsStyles'

class SearchSuggestions extends Component {
    state = {
        suggestions: [],
    }

    componentDidMount() {
        this.props.showHideSearchSuggestions(true)
        this.props.updateSearchTerm('')
    }

    componentDidUpdate(prevProps) {
        if (prevProps.searchTerm != this.props.searchTerm) {
            if (this.props.searchTerm.length < 3) {
                this.setState({ suggestions: [] })
            } else if (this.props.shouldShowSearchSuggestions && this.props.searchTerm.length > 2) {
                this.props.getSearchSuggestions(this.props.searchTerm)
            }
        }
        if (this.props.searchTerm && prevProps.searchSuggestions != this.props.searchSuggestions) {
            const { suggestions } = this.props.searchSuggestions
            const data = suggestions ? suggestions : []
            this.setState({ suggestions: data })
        }
    }

    componentWillUnmount() {
        this.props.showHideSearchSuggestions(true)
        this.props.updateSearchTerm('')
    }

    _renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.suggestionContainer} onPress={() => {
                Keyboard.dismiss()
                this.props.showHideSearchSuggestions(false)
                this.props.updateSearchTerm(item.suggestion)
                this.props.triggerSearching()
            }}>
                <SearchIcon fill={Colors.rgb_b9b9b9} width={16} height={16} />
                <Text style={styles.suggestion} numberOfLines={1}>{item.suggestion}</Text>
            </TouchableOpacity>
        )
    }

    _renderSuggestions() {
        const { searchSuggestions } = this.props
        if (searchSuggestions && searchSuggestions.suggestions && searchSuggestions.suggestions.length > 0) {
            return (
                <EndlessFlatList
                    data={this.state.suggestions}
                    renderItem={this._renderItem}
                    loadedAll
                />
            )
        }
    }

    render() {
        if (this.props.shouldShowSearchSuggestions) {
            return (
                <View style={styles.container}>
                    {this._renderSuggestions()}
                </View>
            )
        }
        return null
    }
}

const mapStateToProps = (state) => ({
    shouldShowSearchSuggestions: state.search.shouldShowSearchSuggestions,
    searchTerm: state.search.searchTerm,
    searchSuggestions: state.search.searchSuggestions,
})

const mapDispatchToProps = (dispatch) => ({
    getSearchSuggestions: (searchTerm) => dispatch(SearchActions.getSearchSuggestions(searchTerm, Constants.CONTEXT.LEARNING)),
    updateSearchTerm: (searchTerm) => dispatch(SearchActions.updateSearchTerm(searchTerm)),
    showHideSearchSuggestions: (isVisible) => dispatch(SearchActions.showHideSearchSuggestions(isVisible)),
    triggerSearching: () => dispatch(SearchActions.triggerSearching()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchSuggestions)