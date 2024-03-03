import { Component } from 'react'
import {
    Linking,
} from 'react-native'
import { open } from '@services/LinkHandler'

export default class DeepLinkHandler extends Component {
    _handleDeepLink = (event) => {
        open(event)
    }

    componentDidMount() {
        Linking.addEventListener('url', this._handleDeepLink)

        Linking.getInitialURL()
            .then(url => {
                if (url) {
                    open({ url })
                }
            })
            .catch(error => console.log(error))
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this._handleDeepLink)
    }

    render() {
        return null
    }
}