"use strict";

const evaljson = require('evaljson');

let locale = evaljson({
    keys: {
        NAME: "My Awesome App"
    },
    titles: {
        WELCOME_TITLE: "Welcome to #{keys.NAME}!" // Embed value.
    }
    /*...*/
});

console.log(locale.titles.WELCOME_TITLE); //-> Welcome to My Awesome App!