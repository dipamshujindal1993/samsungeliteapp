import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import GiftTopIcon from '@svg/icon_gift_top.svg';
import GiftBottomIcon from '@svg/icon_gift_bottom.svg';
import { Colors } from '@resources'
import styles from './Styles/BonusboxStyles';

import { formatNumber } from '@utils/TextUtils'

export default function BonusBox(props) {
    const { box, onPressBox, customStyle, isSelect, iconStyle } = props;
    return (
        <View style={styles.container}>
            {box.map((items, index) => {
                let bonusPoint = items ? parseInt(items) : 0;
                return (
                    <TouchableOpacity
                        key={index}
                        disabled={isSelect}
                        style={customStyle}
                        onPress={() => onPressBox(items)}>
                        <GiftTopIcon fill={Colors.rgb_4297ff} width={iconStyle.width} height={iconStyle.topHeight} />
                        <GiftBottomIcon fill={Colors.rgb_4297ff} width={iconStyle.width} height={iconStyle.bottomHeight} />
                        <View style={{ position: 'absolute', alignSelf: 'center', top: !isSelect ? 37.5 : 100, left:!isSelect ? 32.5 : null }}>
                            <Text numberOfLines={1} style={!isSelect ? styles.questionText : styles.pointText}>{!isSelect ? '?' : formatNumber(bonusPoint)}</Text>
                        </View>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}