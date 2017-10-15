var fs = require('fs');
var vm = require('vm');

var load = function load(obj){
 if(!(tools.context)){
  tools.make_context(global);
 }
 if(typeof(obj) == 'function'){
  // expect that function-type `obj` is a new load-context booting-up - we need to find and load it
  tools.wrap_load();
 }else{
  if(typeof(obj) == 'string'){
   // expect that string-type `obj` is a path to a '.js' file or a directory with multiple
   tools.load_path(obj);
  }else{
   throw new Error("not sure how to load the provided '" + typeof(obj) + "'");
  }
 }
};

module.exports = load;

var tools = {
 context: null,
 start_cut_after_this_line: "//->",
 stop_cut_before_this_line: "//<-",

 wrap_load: function(){
  var filename = tools.filename_containing_caller(2);
  var cut = tools.cut(fs.readFileSync(filename).toString());
  tools.load_file(filename, {lineOffset: cut.skipped, script: cut.script});
 },

 load_path: function(path){
  if(fs.lstatSync(path).isDirectory()){
   tools.load_dir(path);
  }else{
   tools.load_file(path);
  }
 },

 make_context: function(where){
   tools.context = vm.createContext(where);
   tools.context.require = require;
   tools.context.load = load;
 },

 load_file: function(full_path, bootstrap){
  var options = {filename: full_path, displayErrors: true};
  var script = '';
  if(bootstrap){
   options.lineOffset = bootstrap.lineOffset;
   script = bootstrap.script
  }else{
   script = fs.readFileSync(full_path).toString();
  }
  vm.runInContext(script, tools.context, options);
 },

 load_dir: function(dir_name){
  fs.readdirSync(dir_name).forEach(function(file_name){
   if(file_name.slice(-3) == '.js'){
    tools.load_file(dir_name + '/' + file_name);
   }
  });
 },

 call_stack: function(){
  var original_prepare_function = Error.prepareStackTrace;
  Error.prepareStackTrace = function(_, stack_as_array){return stack_as_array;};
  var err = new Error;
  Error.captureStackTrace(err, arguments.callee);
  var stack_trace = err.stack;
  Error.prepareStackTrace = original_prepare_function;
  return stack_trace;
 },

 filename_containing_caller: function(trace_back_levels){
  if(!trace_back_levels){trace_back_levels=0;}
  return tools.call_stack()[trace_back_levels+1].getFileName().toString();
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
};
