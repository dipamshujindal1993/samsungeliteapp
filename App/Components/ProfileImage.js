import React from 'react'
import {
    View,
    TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'

import ImageEx from '@components/ImageEx'
import WreathIcon from '@svg/icon_wreath'
import UserIcon from '@svg/icon_user'
import {
    Colors,
    Constants,
} from '@resources'

import styles from './Styles/ProfileImageStyles'

function ProfileImage(props) {
    const diameter = props.diameter || 52
    const {
        imageUrl,
        onPress,
        borderWidth,
    } = props
    return (
        <View style={[styles.container,
        {
            width: diameter,
            height: diameter,
            borderRadius: diameter / 2,
            borderWidth: borderWidth != undefined ? borderWidth : 1,
        }]}>
            <ImageEx
                style={[styles.image, { width: diameter - 4, height: diameter - 4, borderRadius: diameter - 4 / 2, }]}
                source={imageUrl ? { uri: imageUrl } : null}
                renderDefaultSource={() => {
                    return (
                        <TouchableOpacity disabled={!onPress} onPress={onPress} style={[styles.image, { width: diameter - 4, height: diameter - 4, borderRadius: diameter - 4 / 2, }]}>
                            <UserIcon fill={Colors.white} width='66.7%' height='66.7%' />
                        </TouchableOpacity>
                    )
                }}
            />
            {props.showWreath && props.employeeType == Constants.EMPLOYEE_TYPES.ADVOCATE && <WreathIcon style={styles.wreath} width={86} height={83} fill={Colors.rgb_dab680} />}
        </View>
    )
}

const mapStateToProps = (state) => ({
    employeeType: state.user.summary ? state.user.summary.employeeType : undefined,
})

export default connect(mapStateToProps)(ProfileImage)