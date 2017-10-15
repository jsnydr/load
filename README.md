place `load.js` somewhere in your project's directory structure, say `./tools`

wrap your project's root JavaScript file (maybe `app.js`) in a function passed to the `require('./tools/load')` like:

     1: // using 'load.js' to break things up a bit
     2: // (don't remove the end-of-line comment - it's part of the hack)
     3: require('./tools/load')(function(){ //->
     4:  load('./configs');          // './configs/*.js' will be executed in this child context
     5:  load('./helpers/setup.js'); // load the application initialization code
     6:  load('./controllers');      // load the URL handler code from ".js" files in "./controllers"
     7:
     8:  console.log("starting up the port listener...");
     9:  load('./helpers/start.js'); // start the server with its various callbacks
    10:  console.log("...listener process started!");
    11: } //<-
    12: // (don't remove that last end-of-line comment - the hack needs it closing-snip-marker)

yes, at this time, the method requires programmer-inserted snip-start (`//->`) and snip-end (`//<-`) marks

yes, it is, in principle, possible for the `load` tool to identify the beginning and end of the anonymous function using a JavaScript parser but the added effort and complexity will have to wait for another day

note: the files `load`ed by `load()` can, themselves, call `load()` allowing for deeply-nested structures of abstraction in piecing apart the code intended to build a JavaScript execution context

---

as most recently tested, the attempt to configure correct meta-data for stack-tracing files loaded in this way was not working

yes, that is a major compromise of the value proposition here (i.e. that is one of the primary motivations for loading code this way instead of just using `eval()`)
