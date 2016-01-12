var evaljson = require('evaljson');

var locale = evaljson({
    keys: {
        NAME: "My Awesome App"
    },
    titles: {
        WELCOME_TITLE: "Welcome to #{keys.NAME}!" // Embed value.
    }
    /*...*/
});

console.log(locale.titles.WELCOME_TITLE); //-> Welcome to My Awesome App!