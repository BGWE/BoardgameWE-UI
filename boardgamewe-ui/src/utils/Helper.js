import * as jwt from "jsonwebtoken";

export function htmlDecode(input) {
    let e = document.createElement('div');
    e.innerHTML = input;
    // handle case of empty input
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

export function debounce(a,b,c) {
    var d,e;
    return function(){
        function h(){
            d=null;
            c||(e=a.apply(f,g))
        }
        var f=this,g=arguments;
        return clearTimeout(d),d=setTimeout(h,b),c&&!d&&(e=a.apply(f,g)),e
    }
}

export function getFirstName(player) {
    let firstname;
    if (player.name) {
        firstname = player.name.split(" ")[0];
    } else {
        firstname = player.user.name;
    }
    return firstname;
}

export function getRankingBest (ranking) {
    if (ranking.length > 2 && ranking.slice(0, 3).every(a => a.win)) {
        return getFirstName(ranking[0].player) + ", " + getFirstName(ranking[1].player) + ",...";
    }  else if (ranking.length >= 2 && ranking.slice(0, 2).every(a => a.win)) {
        return getFirstName(ranking[0].player) + " & " + getFirstName(ranking[1].player);
    } if (ranking.length > 0) {
        return getFirstName(ranking[0].player);
    } else {
        return "";
    }
}

export function getTokenPayload(token) {
    return jwt.decode(token);
}

export function convertToISO(stringDate) {
    let date = new Date(stringDate);
    console.log(date);
    console.log(date.toISOString());
    return date.toISOString()
}

/**
 * @return {string}
 */
export function ISODateToNormalDate(ISODate) {
    let date = new Date(ISODate);
    return date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear();
}