var fs = require('fs');
var vm = require('vm');

var load = function(path){
 where = this;
 if(fs.lstatSync(path).isDirectory()){
  load_tools.dir(path, where);
 }else{
  load_tools.file(path, where);
 }
}

/*
boot_tools = {
 stack: function(){
  var err = new Error;
  err.prepareStackTrace = function(_, stack_as_array){return stack_as_array;};
  Error.captureStackTrace(err, arguments.callee);
  return err.stack;
 },

 line: function(above){
  if(!above){above=0;}
  return boot_tools.stack()[above+1].getLineNumber();
 },

 file: function(above){
  if(!above){above=0;}
  return boot_tools.stack()[above+1].getFileName();
 }

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
}
*/

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

load_tools = {
 context: function(where){
//load_tools.context = function(where){
  if(!where){where = this;}
  if(!(
   where.__load_context &&
   where.__load_context.constructor &&
   where.__load_context.constructor.name &&
   where.__load_context.constructor.name == 'Context'
  )){
   where.__load_context = vm.createContext(where);
   where.__load_context.__load_context = where.__load_context
  }
  return where.__load_context;
 },

 file: function(full_path, where){
//load_tools.file = function(full_path, where){
  if(!where){where = this;}
  vm.runInContext(fs.readFileSync(full_path).toString(), load_tools.context(where), {filename: full_path});
 },

 dir: function(dir_name, where){
//load_tools.dir = function(dir_name, where){
  if(!where){where = this;}
  fs.readdirSync(dir_name).forEach(function(file_name){
   if(file_name.slice(-3) == '.js'){
    load_tools.file(dir_name + '/' + file_name, where);
   }
  });
/*
  var file_names = fs.readdirSync(dir_name);
 //for(file_name in file_names){
 file_names.forEach(function(file_name){
  var full_path = dir_name + '/' + file_name;
  var executable_content = fs.readFileSync(full_path).toString();
  var parsed_script = new vm.Script(executable_content);
  var local_context = vm.createContext(this);
  parsed_script.runInContext(local_context, {filename: full_path});
 });
*/
 }
}

module.exports = load;
