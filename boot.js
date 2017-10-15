var fs = require('fs');
var load = require('./load');

// a hack: boot() will load its 'callback' ("post_boot_code_dont_run") by finding
//  the file it was called from and loading those lines of javascript into a
//  virtual machine context that the 'load' module controls
module.exports = function boot(post_boot_code_dont_run){
 var line = 0; //tools.line(1);
 var file = tools.file(1);
 //console.log("file: '"+file+"'; line: '"+line.toString()+"'");
 var cut = tools.cut(fs.readFileSync(file).toString());
 //console.log(cut);
 load(file, {where: this, lineOffset: cut.skipped, script: cut.script});
}

var tools = {
 start_cut_after_this_line: "//->",
 stop_cut_before_this_line: "//<-",

 stack: function(){
  var original_prepare_function = Error.prepareStackTrace;
  Error.prepareStackTrace = function(_, stack_as_array){return stack_as_array;};
  var err = new Error;
  Error.captureStackTrace(err, arguments.callee);
  var stack_trace = err.stack;
  Error.prepareStackTrace = original_prepare_function;
  return stack_trace;
 },

/*
 line: function(above){
  if(!above){above=0;}
  return tools.stack()[above+1].getLineNumber();
 },
*/

 file: function(above){
  if(!above){above=0;}
  return tools.stack()[above+1].getFileName();
 },

 cut: function(script){
  var start_token = tools.start_cut_after_this_line;
  var stop_token  = tools.stop_cut_before_this_line;
  var start = script.indexOf(start_token) + start_token.length;
  var stop  = script.lastIndexOf(stop_token);
  start = script.indexOf("\n", start) + 1;
  stop  = script.lastIndexOf("\n", stop);
  // will always have at least one skipped line... and advanced start past it
  //skipped = (script.slice(0,start).match(/\n/g) || []).length + 1
  skipped = script.slice(0,start).match(/\n/g).length
  script = script.slice(start, stop);
  return {skipped: skipped, script: script};
 },
/*
 nthIndexOf: function(searchIn, findPattern, n){
  var length = searchIn.length;
  var searchFrom = 0;
  while((searchFrom = searchIn.indexOf(findPattern,searchFrom)) != -1){
   if((--n)==0){
    return searchFrom;
   }else{
    searchFrom++;
   }
  }
  return -1;
 }
*/
}


/*
load.boot = function(where){
 path = boot_tools.file(1);
 skip_lines = boot_tools.line(1); 
// had in mind to read the executing file, peel-off already executed lines, execute the remainder, then wait (efficiently) for exit condition
// more complicated than it is worth: some complexity to execute remainder of file but almost hopeless to wait efficiently in unknown
// version of node (later versions have "child_process.execSync('sleep 10')" which could be "while(1)" looped)
  vm.runInContext(fs.readFileSync(full_path).toString(), load_tools.context(where), {filename: full_path});
}
*/
