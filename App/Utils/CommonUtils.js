import { Constants } from '@resources'

export function findConfig(userAudiences, configs) {
  var audienceNames = []
  if (userAudiences && userAudiences.data) {
    for (var i = 0; i < userAudiences.data.length; i++) {
      audienceNames.push(userAudiences.data[i].name)
    }
  }
  return configs && configs.whitelist && configs.whitelist.find(config => audienceNames.includes(config.name))
}

function hasAudience(audiences, audience) {
  for (var i = 0; i < audiences.length; i++) {
    if (typeof audience == 'string' && audiences[i].name == audience) {
      return true
    }
    if (typeof audience == 'object') {
      if (Array.isArray(audience)) {
        return audience.includes(audiences[i].name)
      } else if (audience && audiences[i].name == audience.name) {
        return true
      }
    }
  }
  return false
}

export function isFeatureSupported(feature, audiences) {
  if (audiences == undefined || audiences.length < 1
    || feature == undefined || feature == false
    || Array.isArray(feature.blacklist) && feature.blacklist.some(item => hasAudience(audiences, item))
    || typeof feature.blacklist == 'object' && Object.values(feature.blacklist).some(item => hasAudience(audiences, item))) {
    return false
  }
  if (feature.whitelist == undefined
    || Array.isArray(feature.whitelist) && feature.whitelist.some(item => hasAudience(audiences, item))
    || typeof feature.whitelist == 'object' && Object.values(feature.whitelist).some(item => hasAudience(audiences, item))) {
    return true
  }
}

export function getTabs(key, tabConfig, audiences) {
  var tab, tabName, tabs = []
  if (audiences && audiences.length > 0) {
    try {
      for (tabName in tabConfig) {
        tab = tabConfig[tabName]
        if (isFeatureSupported(tab, audiences)) {
          tabs.push(tab)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
  if (tabs.length == 0) {
    switch (key) {
      case Constants.HOME_TABS:
        tabs = Constants.DEFAULT_HOME_TABS
        break

      case Constants.LEARN_TABS:
        tabs = Constants.DEFAULT_LEARN_TABS
        break
    }
  }
  return tabs.sort((a, b) => a.id - b.id)
}

export function hasAccessTo(tabId, tabs) {
  if (tabs) {
    for (tab in tabs) {
      if (tabs[tab] && tabs[tab].id == tabId) {
        return true
      }
    }
  }
  return false
}

// copied from https://github.com/davidchambers/Base64.js/blob/master/base64.js
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
export function btoa(input) {
  var str = String(input)
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars, output = '';
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4)
    if (charCode > 0xFF) {
      throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.")
    }
    block = block << 8 | charCode
  }
  return output
}

export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Get value from nested object by string path split by '.'
export function getValueFromPath(object, path) {
  if (object && typeof object == 'object' && typeof path == 'string') {
    if (path.includes('.')) {
      let [firstPath, ...restPath] = path.split('.')
      restPath = restPath.join('.')
      return getValueFromPath(object[firstPath], restPath)
    } else {
      return object[path]
    }
  }
}

export function getFileSizeInMBFromByte(fileSize) {
  return fileSize / (1024 * 1024)
}

// return a string in 'YYYYMMDD' format from a date object
export function formatYYYYMMDD(date) {
  const formattedYear = date.getFullYear().toString()
  const formattedMonth = (date.getMonth() + 1).toString().padStart(2, '0')
  const formattedDate = date.getDate().toString().padStart(2, '0')
  return formattedYear + formattedMonth + formattedDate
}

export function getFileExtension(contentType) {
  let extension
  switch (contentType) {
    case Constants.CONTENT_TYPES.DOCUMENT:
      extension = Constants.FILE_EXTENSIONS.DOCUMENT
      return extension
    case Constants.CONTENT_TYPES.PDF:
      extension = Constants.FILE_EXTENSIONS.PDF
      return extension
  }
}

export function getFileSizeString(bytes) {
  var thresh = 1024;
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }
  var units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  var u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(1) + ' ' + units[u];
}