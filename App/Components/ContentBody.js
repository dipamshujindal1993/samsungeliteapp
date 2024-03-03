import React from 'react';
import {
  View,
} from 'react-native';

import ContentText from '@components/ContentText';
import ContentHtml from '@components/ContentHtml';
import { isEmpty, cleanHtml, hasHtmlTags, hasOnlyReducedHtmlTagsWithNoStyle } from '@utils/TextUtils'
import styles from './Styles/ContentBodyStyles';

export default function ContentBody(props) {
    const {body, style, htmlStyle, textStyle, accessibilityLabel, onEnd, navigation} = props;
    const cleaned = cleanHtml(body);
    const empty = isEmpty(cleaned);
    const hasHtml = hasHtmlTags(cleaned);
    var hasSimpleHtml = false;
    if (hasHtml) {
      hasSimpleHtml = hasOnlyReducedHtmlTagsWithNoStyle(cleaned);
    }
    const isHtml = !empty && hasHtml;
    const isPlainText = !empty && !hasHtml;

    if (isHtml) {
      return <ContentHtml accessibilityLabel={accessibilityLabel} html={cleaned} simplify={hasSimpleHtml} style={style} htmlStyle={htmlStyle} navigation={navigation} onEnd={onEnd} />;
    } else if (isPlainText) {
      return <ContentText accessibilityLabel={accessibilityLabel} text={cleaned} style={style} textStyle={textStyle}/>;
    } else {
      return <View style={[styles.container, style]} />;
    }
}
