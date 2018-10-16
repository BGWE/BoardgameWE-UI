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
