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

// Pre-render the feed lists if they exist
// Thank you localStorage for persistence :D
//Reader.models.push(Reader.id);
$('#feed-list').empty();
Reader.sources.forEach(function(source){
  $('#feed-list').append('<li class="feed-list-item" id="li-' + source.id + '">' + source.name + '</li>');
});
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
    $('#feed-list').empty();
    Reader.sources.forEach(function(source){
      $('#feed-list').append('<li class="feed-list-item" id="li-' + source.id + '">' + source.name + '</li>');
    });
  });

  $('#feed-list').on('click', 'li', function(){
    var item = this.id.split("-");
    var sources = Reader.models[item[1]].findAll("articles");
    console.log(sources);
    $('.rssfeed').text("");
    sources.forEach(function(article){
      var content = '<div class="article" id="article-' + article.id + '">';
      content += '<div class="article-title"id="title-' + article.id + '">' + article.title + '</div>';
      content += "</div><!-- closes article -->";
      $('.rssfeed').append(content);
    });

    $('.article').on('click', '.article-title', function(){
      var articleId = this.id.split("-");
      console.log("click found");
      console.log(articleId);
      $('.article-content').text("");
      console.log(sources);
      sources.forEach(function(article){
        if(article.id === articleId[1]){
          // remove all html formatting
          // article.content.replace(/(<([^>]+)>)/ig, "")
          $('.article-content').append(article.content);
        }
      });
    });

  });

});
