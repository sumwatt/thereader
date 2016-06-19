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
    this.sources.push(arguments[i]);
    this.models[(arguments[i].id)] = new Model(arguments[i].id);
    this.watchers.push(new FeedWatcher({id: arguments[i].id,
                                        link: arguments[i].link,
                                        feedInterval: arguments[i].feedInterval
                                      })
    );
  }
};

/**
 * @Reader - global application container
 */

var Reader = new App("Reader");
Reader.models[Reader.id] = new Model(Reader.id);
var storedSources = Reader.models[Reader.id].fetch("sources");
if(storedSources){
  storedSources.forEach(function(source){
    Reader.addSources(source);
  });
}
//Reader.models.push(Reader.id);

/**
 *   @newSource  - Source object
 */

var newSource = Object;

$(function(){
  $("#addFeed").submit(function(event){
    event.preventDefault();
  //  debugger;
    var name = $('#add-source-name').val();
    var link = $('#add-feed-link').val();
    newSource = new Source(name, link);
    // newSource.fetch();
    Reader.addSources(newSource);
      console.log(Reader);
    $('#msg-box').html("<p>Item added!</p>");
    $('#feed-list').append('<li class="feed-list-item" id="li-' + newSource.id + '">' + name + '</li>');
  });

  $('#feed-list').on('click', 'li', function(){
    var item = this.id.split("-");
    var sources = Reader.models[item[1]].fetch("articles");
    console.log(sources);
    $('.rssfeed').text("");
    sources.forEach(function(article){
      var content = '<div class="article" id="article' + article.id + '">';
      content += '<div class="article-title">' + article.title + '</div>';
      content += '<div class="article-content">' + article.description + '</div>';
      content += "</div><!-- closes article -->";

      $('.rssfeed').append(content);
    });
  });
});
