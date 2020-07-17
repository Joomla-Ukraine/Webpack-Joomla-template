"use strict";

function requireAll(r) {
    r.keys().forEach(r);
}

// Add folders
requireAll(require.context('../icons/uikit', true, /\.svg$/));
requireAll(require.context('../icons/brands', true, /\.svg$/));