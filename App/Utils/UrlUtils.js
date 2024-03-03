import Url from "url-parse";
import { Constants } from '@resources'
import {formatString} from './TextUtils';
export function addParam(url, name, value) {
    if (url && url.indexOf('?') > 0) {
        if (url.endsWith('?')) {
            return url + name + '=' + value
        } else {
            return url + '&' + name + '=' + value
        }
    } else if (url) {
        return url + '?' + name + '=' + value
    } else {
        return '?' + name + '=' + value
    }
}

export  function constructScormUrl(launchURL) {
    if (launchURL.match('^http://')) {
        launchURL = launchURL.replace("http://", "https://")
    }
    launchURL = addParam(launchURL, 'Portal', '1')
    let encodedLaunchUrl = encodeURIComponent(launchURL);
    let urlObject = new Url(launchURL);
    let hostUrl = urlObject.protocol + '//' + urlObject.host
    let wtrealm = `${hostUrl}/${Constants.SCORM.CORE}/`
    let wtrealmEncoded = encodeURIComponent(wtrealm)
    let urlToLoad=formatString(Constants.SCORM.SCORM_URL,hostUrl,wtrealmEncoded,encodedLaunchUrl)
    return urlToLoad
}