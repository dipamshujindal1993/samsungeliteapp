export function currentTimeSeconds() {
    return (new Date).getTime() / 1000
}

export function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours < 10 ? '0'+hours : hours;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + '' + ampm;
    return strTime;
}

export function formatYYYYMMDD(date) {
    const monthsName = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const formattedYear = date.getFullYear().toString()
    const formattedMonth = date.getMonth()
    const formattedDate = date.getDate().toString().padStart(2, '0')
    return monthsName[formattedMonth] + ' ' + formattedDate + ', ' + formattedYear
  }
