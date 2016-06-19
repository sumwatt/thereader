function App(name) {
  this.name = name;
  this.id = md5(name);
  this.sources = [];
}

App.prototype.addSources = function(){
  var argLen = arguments.length;
  for(var i=0; i < argLen; i++){
    this.sources.push(arguments[i]);
  }
};

/**
 * @Reader - global application container
 */

var Reader = Reader || new App("reader");

/**
 *   @newSource  - Source object
 */

var newSource = Object;

$(function(){
  $("#addFeed").submit(function(event){
    event.preventDefault();
    var name = $('#add-source-name').val();
    var link = $('#add-feed-link').val();
    newSource = new Source(name, link);
    // newSource.fetch();
    myReader.addSources(newSource);
      console.log(Reader);
    $('#msg-box').html("<p>Item added!</p>");
    $('#feed-list').append('<li class="feed-list-item" id="li-' + newSource.id + '">' + name + '</li>');
  });

  $('#feed-list').on('click', 'li', function(){
    // debugger;
    var item = this.id.split("-");
    var sources = myReader.sources.filter(function(source){
      return (source.id === item[1]);
    });
    $('.rssfeed').text("");
    sources[0].parsed.forEach(function(article){
      var content = '<div class="article" id="article' + article.id + '">';
      content += '<div class="article-title">' + article.title + '</div>';
      content += '<div class="article-content">' + article.description + '</div>';
      content += "</div><!-- closes article -->";

      $('.rssfeed').append(content);
    });
  });
});
