var fs = require('fs');
var vm = require('vm');

module.exports = function load(path){
 if(!(load_tools.context)){
  load_tools.make_context(this);
 }
 if(fs.lstatSync(path).isDirectory()){
  load_tools.dir(path);
 }else{
  load_tools.file(path);
 }
}

var load_tools = {
 context: null,

 make_context: function(where){
   this.context = where.__load_context = vm.createContext(where);
   this.context.__load_context = this.context;
 },

 file: function(full_path){
  vm.runInContext(fs.readFileSync(full_path).toString(),
                  this.context, {filename: full_path});
 },

 dir: function(dir_name){
  fs.readdirSync(dir_name).forEach(function(file_name){
   if(file_name.slice(-3) == '.js'){
    load_tools.file(dir_name + '/' + file_name);
   }
  });
 }
}
