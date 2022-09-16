// The lines below are skipped by the resource parser. Purpose is clean
// jshinting.
(function() {
// >>>> start of private namespace
'use strict';

/// cbs.js
(() => {
    window.XMLHttpRequest.prototype.open = new Proxy(window.XMLHttpRequest.prototype.open, {
        apply: async (a, b, c) => {
            const d = c[1];
            return "string" != typeof d || 0 === d.length ? Reflect.apply(a, b, c) : (d.match(/pubads\.g\.doubleclick.net\/ondemand\/hls\/.*\.m3u8/) && b.addEventListener("readystatechange", function() {
                if (4 === b.readyState) {
                    const a = b.response;
                    Object.defineProperty(b, "response", {
                        writable: !0
                    }), Object.defineProperty(b, "responseText", {
                        writable: !0
                    });
                    const c = a.replaceAll(/#EXTINF:(\d|\d\.\d+)\,\nhttps:\/\/redirector\.googlevideo\.com\/videoplayback\?[\s\S]*?&source=dclk_video_ads&[\s\S]*?\n/g, "");
                    b.response = c, b.responseText = c
                }
            }), Reflect.apply(a, b, c))
        }
    })
})();


/// cbs0.js
(() => {
    const a = window.fetch;
    window.fetch = new Proxy(window.fetch, {
        apply: async (b, c, d) => {
            const e = d[0];
            if ("string" != typeof e || 0 === e.length) return Reflect.apply(b, c, d);
            if (e.match(/pubads\.g\.doubleclick\.net\/ondemand\/.*\/content\/.*\/vid\/.*\/streams\/.*\/manifest\.mpd|pubads\.g\.doubleclick.net\/ondemand\/hls\/.*\.m3u8/)) {
                const b = await a(...d);
                let c = await b.text();
                return c = c.replaceAll(/<Period id="(pre|mid|post)-roll-.-ad-[\s\S]*?>[\s\S]*?<\/Period>|#EXTINF:(\d|\d\.\d+)\,\nhttps:\/\/redirector\.googlevideo\.com\/videoplayback\?[\s\S]*?&source=dclk_video_ads&[\s\S]*?\n/g, ""), new Response(c)
            }
            return Reflect.apply(b, c, d)
        }
    })
})();

// These lines below are skipped by the resource parser.
// <<<< end of private namespace
})();
