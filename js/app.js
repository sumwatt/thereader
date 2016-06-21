function App(name) {
  this.name = name;
  this.id = md5(name);
  this.sources = [];
  this.models = {};
  this.watchers = [];

}

App.prototype.addSources = function(){
  var argLen = arguments.length;
  for(var i=0; i < argLen; i++){
    // if there is no model associated with the new source;
    if(!this.models[arguments[i].id]){
      this.sources.push(arguments[i]);
      this.models[(arguments[i].id)] = new Model(arguments[i].id);
      this.watchers.push(new FeedWatcher({id: arguments[i].id,
                                          link: arguments[i].link,
                                          feedInterval: arguments[i].feedInterval
                                        })
      );
      this.models[this.id].save("sources", this.sources);
    }
  }
};
