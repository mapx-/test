
// replace for inline scripts - scriptlet for uBlock Origin
// example filter:
// hipsonyc.com##+js(rpx, /click.*_blank.*location\.href/, /^window\.location\.href.*\'$/, )
//
// example.com##+js(rpx, param1, param2, param3)
// param1 (regex): matching a specific inline script
// param2 regular expression, to search for
// param3 The new value (to replace with)

/// rpx.js
    (function() {
        'use strict';
          let needle = '{{1}}';
          if ( needle === '' || needle === '{{1}}' ) {
              needle = '';
          } else if ( needle.startsWith('/') && needle.endsWith('/') ) {
              needle = needle.slice(1,-1);
          } else {
              needle = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          }
          needle = new RegExp(needle, "gms");
          let what = '{{2}}';
          if ( what === '' || what === '{{2}}' ) {
              what = '';
          } else if ( what.startsWith('/') && what.endsWith('/') ) {
              what = what.slice(1,-1);
          } else {
              what = what.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          }
          what = new RegExp(what, "gms");
          let by = '{{3}}';
          if ( by === '' || by === '{{3}}' ) {
              by = '';
          }
          const obs = new MutationObserver((mutationsList) => {
			  for (const mut of mutationsList) {
				  for (const node of mut.addedNodes) {
					  if (node.tagName === 'SCRIPT') {
						  if (needle.test(node.textContent) ) {
							  let ttt = node.textContent;
							  console.log('in:'+ttt);
							  ttt  = ttt.replace(what, by);
							  console.log('out:'+ttt);
							  node.textContent = ttt;
						  }
					  }
				  }
			  }
          });
          obs.observe(document.documentElement, { childList: true, subtree: true });
    })();
