export function formatDate(date){
    var year= date.getFullYear()
    var month= date.getMonth()+1
    var day = date.getDate()
    if (month < 10 ){
        month = '0' + month
    }
    if (day < 10 ){
        day = '0' + day
    }
    return year + month + day
}

export function formatDate2(date){
    var year= date.getFullYear()
    var month= date.getMonth()+1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()

    if (month < 10 ){
        month = '0' + month
    }
    if (day < 10 ){
        day = '0' + day
    }
    if (hour < 10 ){
        hour = '0' + hour
    }
    if (minute < 10 ){
        minute = '0' + minute
    }
    return `${year}-${month}-${day} ${hour}:${minute}`
}

export function parseDate(str){
    if(!/^(\d){8}$/.test(str)) throw "invalid date"
    var y = str.substr(0,4),
        m = str.substr(4,2) - 1,
        d = str.substr(6,2);
    return new Date(y, m, d);
}

export function addDays(date, n){
    var time = date.getTime()
    var changedDate = new Date(time + (n * 24 * 60 * 60 * 1000));
    var newDate = new Date()
    newDate.setTime(changedDate.getTime())
    return newDate
}


var scrollHandler;
export function listenScrollBottom(callback){
    scrollHandler = function(){
        var scrollTop =  document.documentElement.scrollTop || document.body.scrollTop
        if(scrollTop!==0 &&scrollTop+document.documentElement.clientHeight===document.documentElement.scrollHeight){
            callback()
        }
    }
    window.addEventListener('scroll', scrollHandler);
}

export function removeListenScrollBottom(){
    window.removeEventListener('scroll', scrollHandler)
}



let startX, startY, prevX = 0, prevY = 0
export function addTouchEvent(el, callback){
    el.addEventListener('touchstart',function(ev){
        startX = prevX = ev.touches[0].pageX
        startY = prevY = ev.touches[0].pageY
    })

    el.addEventListener('touchmove',function(ev){
        let x= ev.touches[0].pageX
        let y= ev.touches[0].pageY
        let changedX = x - prevX
        let changedY = y - prevY

        prevX = x
        prevY = y

        if(changedX <= 2 && changedY<= 2 ){
            return
        }

        let directionX = changedX < 0 ? 'left' : 'right'
        let directionY = changedY < 0 ? 'bottom' : 'top'

        callback({
            type: 'touchmove',
            directionX,
            directionY,
            changedX,
            changedY
        })
    })

    el.addEventListener('touchend',function(ev){
        let x = ev.changedTouches[0].pageX
        let y = ev.changedTouches[0].pageY

        let changedX = x - startX
        let changedY = y - startY

        if(Math.abs(changedX) < 5 && Math.abs(changedY) < 5){
            return
        }
        let directionX = changedX < 0 ? 'left' : 'right'
        let directionY = changedY < 0 ? 'bottom' : 'top'

        callback({
            type: 'touchend',
            directionX,
            directionY,
            changedX,
            changedY
        })
    })
}
