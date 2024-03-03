import { Animated } from 'react-native'
import { isEmpty } from '@utils/TextUtils'

export function isVimeoVideo(videoUrl) {
    if (!isEmpty(videoUrl)) {
        videoUrl = videoUrl.toLowerCase()
        return videoUrl.toLowerCase().search('vimeo.com/') >= 0
    }
    return false
}

export function fadeInControls(opacity, loop, callback) {
    Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: 0,
    }).start(() => {
        if (loop && callback) callback()
    })
}

export function fadeOutControls(opacity, delay, callback) {
    Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        delay
    }).start(result => {
        /*  Noticed that the callback is called twice, when it is invoked and when it completely finished
      So the below case does prevents some flickering */
        if (result.finished && callback) callback()
    })
}
