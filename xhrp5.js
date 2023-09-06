// replace parts of a xhr file - scriptlet for uBlock Origin
// example filter:
// telsu.fi##+js(xhrp, /^\/.*/, /^<div.*\/div>$/, )
//
// example.com##+js(xhrp, param1, param2, param3)
// param1 (regex): matching xhr files
// param2 regular expression, to search for
// param3 The new value (to replace with)
/// xhrp.js
/// dependency safe-self.fn
function xhrp(urlXHR = '', what = '', by = '') {
          const reUrlXHR = safe.patternToRegex(urlXHR);
          const reWhat = safe.patternToRegex(what, 'gms');
		  //console.log('uBO:'+'reUrlXHR:'+reUrlXHR);
          //console.log('uBO:'+'reWhat:'+reWhat);
          //console.log('uBO:'+'by:'+by);
    const pruner = text => {
    	text  = text.replace(reWhat, by);
        return text;
    };
    const urlFromArg = arg => {
        if ( typeof arg === 'string' ) { return arg; }
        if ( arg instanceof Request ) { return arg.url; }
        return String(arg);
    };
    const realFetch = self.fetch;
    self.fetch = new Proxy(self.fetch, {
        apply: function(target, thisArg, args) {
            if ( reUrlXHR.test(urlFromArg(args[0])) === false ) {
                return Reflect.apply(target, thisArg, args);
            }
            return realFetch(...args).then(realResponse =>
                realResponse.text().then(text =>
                    new Response(pruner(text), {
                        status: realResponse.status,
                        statusText: realResponse.statusText,
                        headers: realResponse.headers,
                    })
                )
            );
        }
    });
    self.XMLHttpRequest.prototype.open = new Proxy(self.XMLHttpRequest.prototype.open, {
        apply: async (target, thisArg, args) => {
            if ( reUrlXHR.test(urlFromArg(args[1])) === false ) {
                return Reflect.apply(target, thisArg, args);
            }
            thisArg.addEventListener('readystatechange', function() {
                if ( thisArg.readyState !== 4 ) { return; }
                console.log('uBO:'+'file:'+args[1]);
                //console.log('uBO:'+'state:'+thisArg.readyState);
                const type = thisArg.responseType;
                //console.log('uBO:'+'type:'+type);
                if ( type !== '' && type !== 'text' ) { return; }
                const textin = thisArg.responseText;
                console.log('uBO:'+'textin:'+textin);
                const textout = pruner(textin);
                console.log('uBO:'+'textout:'+textout);
                if ( textout === textin ) { return; }
                Object.defineProperty(thisArg, 'response', { value: textout });
                Object.defineProperty(thisArg, 'responseText', { value: textout });
            });
            return Reflect.apply(target, thisArg, args);
        }
    });
}
