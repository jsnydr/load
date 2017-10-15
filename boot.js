var fs = require('fs');
var load = require('./load');

module.exports = function boot(post_boot_code_dont_run){
 var file = tools.file(1);
 var cut = tools.cut(fs.readFileSync(file).toString());
 load(file, {lineOffset: cut.skipped, script: cut.script});
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
  skipped = script.slice(0,start).match(/\n/g).length
  script = script.slice(start, stop);
  return {skipped: skipped, script: script};
 }
}
