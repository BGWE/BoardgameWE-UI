import * as jwt from "jsonwebtoken";
import moment from "moment-timezone";

export function formatDatetime(iso8601) {
    const datetime = moment(iso8601).tz(moment.tz.guess());
    return datetime.format("LLL");
}

export function formatDate(iso8601) {
    const datetime = moment(iso8601).tz(moment.tz.guess());
    return datetime.format("LL");
}


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

export function rank(data, score_fn, lower_better) {
    let copy = data.slice(0);
    copy.sort((a, b) => (lower_better ? -1 : 1) * (score_fn(b) - score_fn(a)));

    const best_score = copy.length > 0 ? copy[0].score : 0;
    let prev_score = null,
        prev_natu_rank = 0,
        prev_skip_rank = 0;

    for (let i = 0; i < copy.length; ++i) {
        if (prev_score !== copy[i].score) {
            prev_skip_rank = i + 1;
            prev_natu_rank = prev_natu_rank + 1;
            prev_score = copy[i].score;
        }
        copy[i].score = score_fn(copy[i]);
        copy[i].natural_rank = prev_natu_rank;
        copy[i].rank = copy[i].natural_rank;
        copy[i].skip_rank = prev_skip_rank;
        copy[i].win = copy[i].score === best_score;
    }
    return copy;
}