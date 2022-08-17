# Tellonym.js
🕵️‍♂️ Tellonym private api wrapper made in typescript

## Token
To retrieve the token you have to sniff HTTP requests or get it from web localStorage.
You can use this [script](/getToken.js) on pc by pasting it in the console,
or you can use the `javascript:` method **even on mobile** by:

  • Copying the [script's content](https://raw.githubusercontent.com/47PADO47/Tellonym.js/main/getToken.js)
  
  • Going on a javascript minifier website, such as https://minify-js.com/, and minifying it
  
  • Going on telloynm.me, tapping the search bar, writing `javascript:` and pasting the minified code

## Example
```javascript
const { Tellonym } = require('tellonym.js');

const tellonym = new Tellonym({
    //Optional, use it to recive some logs in the console
    debug: true, 
});

(async () => {
    await tellonym.login('token');
    
    tellonym.getFeedList()
        .then(console.log);
})();
```
