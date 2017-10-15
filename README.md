place `load.js` somewhere in your project's directory structure, say `./tools`

wrap your project's root JavaScript file (maybe `app.js`) in a function passed to the `require('./tools/load')()` call, e.g.:

    // using 'load.js' to break things up a bit
    // (don't remove the end-of-line comment - it's part of the hack)
    require('./tools/load')(function(){ //->
     load('./configs');          // './configs/*.js' will be executed in this child context
     load('./helpers/setup.js'); // load the application initialization code
     load('./controllers');      // load the URL handler code from ".js" files in "./controllers"
    
     console.log("starting up the port listener...");
     load('./helpers/start.js'); // start the server with its various callbacks
     console.log("...listener process started!");
    }); //<-
    // (don't remove that last end-of-line comment - the hack needs it closing-snip-marker)

yes, at this time, the method requires programmer-inserted snip-start (`//->`) and snip-end (`//<-`) marks

yes, it is, in principle, possible for the `load` tool to identify the beginning and end of the anonymous function using a JavaScript parser but the added effort and complexity will have to wait for another day

note: the files `load`ed by `load()` can, themselves, call `load()` allowing for deeply-nested structures of abstraction in piecing apart the code intended to build a JavaScript execution context

files thusly `load`ed should not need any changes from how they would have appeared if all their contents were collected into a single file w/o a `load` helper; i.e. just this odd wrapper business at the "root node" - that is supposed to be the magic of this thing - hope it works...

---

as most recently tested, the attempt to correctly apply meta-data for stack-tracing files loaded in this way was not working (hmm... but I've made some changes since then...)

yes, that is a major compromise of the value proposition here (i.e. that is one of the primary motivations for loading code this way instead of just using `eval()`)
