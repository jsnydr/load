var fs = require('fs');
var vm = require('vm');

module.exports = function load(path, bootstrap){
 if(!(tools.context)){
  //load_tools.make_context(bootstrap ? bootstrap.where : this);
  tools.make_context(global);
  tools.context.require = require;
//  tools.context.load = load;
  //tools.context.process = process;
  //tools.context.console = console;
  //vm.runInContext("var require = this.constructor('return require')().exit()", tools.context);
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
   // if the 'load' module's awareness of 'context' is not enough and the
   //  calling context or the loaded context needs it, the following might
   //  have some use...
   //where.__load_context = this.context.__load_context = this.context;
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
  //runner = new vm.Script(script, options);
  //runner.runInContext(tools.context, options);
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
