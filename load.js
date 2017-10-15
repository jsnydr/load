var fs = require('fs');
var vm = require('vm');

module.exports = function load(path, bootstrap){
 if(!(tools.context)){
  tools.make_context(global);
 }
 if(fs.lstatSync(path).isDirectory()){
  tools.dir(path);
 }else{
  tools.file(path, bootstrap);
 }
}

var tools = {
 context: null,

 make_context: function(where){
   tools.context = vm.createContext(where);
   tools.context.require = require;
 },

 file: function(full_path, bootstrap){
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

 dir: function(dir_name){
  fs.readdirSync(dir_name).forEach(function(file_name){
   if(file_name.slice(-3) == '.js'){
    tools.file(dir_name + '/' + file_name);
   }
  });
 }
}
