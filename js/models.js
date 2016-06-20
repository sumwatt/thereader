//********************************
// Storage prototype additions
// this will insert objects as JSON strings
// and will retrieve and parse strings into JSON objects
//********************************
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
};

/**
 * Holds an RSS source
 * @param String name Editable name of an RSS feed
 * @param String link URL prefixed with http[s]://
 */
function Source(name, link){
  this.name = name;
  this.link = link;
  this.id = md5(name);
  this.feedInterval = 3600000;
};

/**
 * Feedwatcher updates the source table by fetching feeds periodically
 * @param Source source Object contains details needed for sorting data
 */
function FeedWatcher(source){
  setInterval(function timer(){
    $.getJSON('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20feednormalizer%20where%20url%3D%22' + encodeURIComponent(source.link) + '%22%20and%20output%3D%22rss_2.0%22%20limit%2010&format=json&diagnostics=true&callback=', function(data){
      var results;
      var atomFeed = false;
      if(data.query.results.item){
        results = data.query.results;
      } else if (data.query.results.rss.channel.item) {
        results = data.query.results.rss.channel;
        atomFeed = true;
      }
      console.log(JSON.stringify(results.item));
      var itemLen = results.item.length ;

      var storage = localStorage.getObject(source.id + "-articles");
      var content = [];
      // most of this code is used to reduce the amount of content stored since local storage is limited
      for(var index = 0; index < itemLen; index++){
        var item = results.item[index];
        var id = md5(item.title + item.pubDate);
        var duplicate = false;
        // if we have a storage unit for the feed...
        if(storage){
          // loop through all of the storage items to find a duplicate ID
          for(var i=0; i < itemLen; i++){
            if(storage[i].id === id){
              duplicate = true;
              index = itemLen;
            };
            i++;
          };
        }

        if(!duplicate){
          var article = {};
          // add a unique ID to the post based on the blog name and publication date
          article.id = id
          article.read = false;
          article.title = item.title;

          // detect an array and change it to the string of the first item
          if(typeof description === "object" ){
            article.description = item.description[0];
          } else if (!item.description && atomFeed) {
            article.description = item.encoded;
          } else {
            article.description = item.description;
          }
          // podcast detection
          if(item.enclosure && item.enclosure.type === "audio/mpeg"){
            article.podcast = true;
            article.audioUrl = item.enclosure.url;
          }
          content.push(article);
        }
        // if we have valid results - store them in the database
        if(storage && content){
          localStorage.setObject(source.id + "-articles", storage.concat(content));
        } else {
          localStorage.setObject(source.id + "-articles", content);
        }

      };
    });

    return timer;
    // but on the first execution it return immediately with ()
    // otherwise it returns itself to run at whatever value source.feedInterval
    // was set at.
  }(), source.feedInterval);
};

/**
 * Model is attached to a source so it is aware of the underlying data
 * @param {[type]} source [description]
 */
function Model(id){
  this.id = id;
}
Model.prototype.fetch = function(table){
  if(localStorage.getObject(this.id + "-" + table)){
    return localStorage.getObject(this.id + "-" + table);
  } else {
    return false
  }
}

Model.prototype.save = function(table, data){
  localStorage.setObject(this.id + "-" + table, data);
}

Model.prototype.put = function(table, data){

}

/**
 * returns all records
 * @param  String table Name of the table to pull from
* @return Object [Array]       returns an array of the result-set
 */
Model.prototype.findAll = function(table){
  return this.fetch(table);
}

/**
 * findBy will search a table and filter the data based on the query
 * (wrapper for the js filter method)
 * @param  String table Table data will be pulled from
 * @param  Function query Function to be called on all items within storage
 * @return Object [Array] from the resultset
 */
Model.prototype.findBy = function(table, query){
  var storage = this.fetch(table);
  return storage.filter(query);

}
