'use strict'

const evaljson = require('evaljson')

let locale = evaljson({
  keys: {
    NAME: 'My Awesome App'
  },
  titles: {
    WELCOME_TITLE: 'Welcome to #{keys.NAME}!', // Embed value with "#{some_value}" syntax.
    WHERE_WE_ARE: 'We are on $(hostname)' // Execute command with "$(command)" syntax

  }
  /* ... */
})

console.log(locale.titles.WELCOME_TITLE) // -> Welcome to My Awesome App!
