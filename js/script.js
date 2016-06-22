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


/**
 *   @newSource  - Source object
 */

var newSource = Object;

var renderArticle = function(id, article){
  $('.article-content').text("");
  var content = '<div class="article-title-inline"><span class="glyphicon glyphicon-trash" aria-hidden="true" id="' +
                id + "-" + article.id  + '"></span><a href="' + article.link + '">'+  article.title + '</a></div>';
  //content += '<div class="article-link"><p><a href="' + article.link + '">original source</a></p></div>';
  content += '<div class="article-content-body">' + article.content + '</div>';
  if(article.podcast){
    content += '<div class="podcast-link">'+
              '<a href="' + article.audioUrl  + '"<span class="glyphicon glyphicon-play-circle">' + '</span></a></div>';
  }
  $('.article-content').append(content);
}
var renderFeedList = function(source){
  $('#feed-list').append('<li class="feed-list-item" id="li-' + source.id + '">' + source.name +'<span class="glyphicon glyphicon-remove" aria-hidden="true" id="delFeed' +  "-" + source.id  + '"></span></li>');
  $("#li-" + source.id).hover(function(){
    $("#delFeed-"+ source.id).show();
  },function(){
    $("#delFeed-"+ source.id).hide();
  });
}

$('#feed-list').empty();
Reader.sources.forEach(function(source){
  renderFeedList(source);
});
function resetFields(){
  $('#add-source-name').val("");
  $('#add-feed-link').val("");
}

$(function(){
  $("#addFeed").submit(function(event){
    event.preventDefault();
  //  debugger;
    var name = $('#add-source-name').val();
    var link = $('#add-feed-link').val();
    newSource = new Source(name, link);
    // newSource.fetch();
    Reader.addSources(newSource);
      // console.log(Reader);
    $('#msg-box').html("<p>Item added!</p>");
    $('#feed-list').empty();
    Reader.sources.forEach(function(source){
    renderFeedList(source);
    resetFields();
    });
  });

  $("#feed-list").on("click", ".glyphicon-remove", function(){
    var feedList = this.id.split("-");
    Reader.models[feedList[1]].deleteSource();
    var storedSources = Reader.models[Reader.id].fetch("sources");
    var i = 0;
     storedSources.forEach(function(source){
       if(feedList[1] === source.id){
         var newList = storedSources.splice(i, 1);
         console.log(storedSources);
       }
       i++;
     });
     Reader.sources = storedSources;
    //  console.log(storedSources);
     Reader.models[Reader.id].save("sources", Reader.sources);
     $("#feed-list").text("");
     Reader.sources.forEach(function(source){
       renderFeedList(source);
     });
  });

  $('#feed-list').on('click', 'li', function(){
    var item = this.id.split("-");
    var sources = Reader.models[item[1]].findAll("articles");
    // console.log(sources);
    $('.rssfeed').text("");
    sources.forEach(function(article){
      var content = '<div class="article" id="article-' + article.id + '">';
      content += '<div class="article-title" id="title-' + article.id + '">' + article.title + '</div>';
      content += "</div><!-- closes article -->";
      $('.rssfeed').append(content);
    });

    $('body').on('click', '.article-title', function(){
      var articleId = this.id.split("-");
      // console.log("click found");
      // console.log(articleId);
      $('.article-content').text("");
      // console.log(sources);
      sources.forEach(function(article){
        if(article.id === articleId[1]){
          // remove all html formatting
          // article.content.replace(/(<([^>]+)>)/ig, "")
          var content = '<div class="article-title-inline"><span class="glyphicon glyphicon-trash" aria-hidden="true" id="' +
                        item[1] + "-" + article.id  + '"></span> <a href="' + article.link + '">'+  article.title + '</a></div>';
          //content += '<div class="article-link"><p><a href="' + article.link + '">original source</a></p></div>';
          content += '<div class="article-content-body">' + article.content + '</div>';
          if(article.podcast){
            content += '<div class="podcast-link">'+
                      '<a href="' + article.audioUrl  + '"<span class="glyphicon glyphicon-play-circle">' + '</span></a></div>';
          }
          $('.article-content').append(content);
        }
      });
    });

    $('.article-content').on("click", '.glyphicon-trash', function(event){
      var id = this.id.split("-");
      var articles = Reader.models[id[0]].fetch("articles");
      // console.log(id[0]);
      var artLen = articles.length;
      for(var i = 0; i < artLen; i++){
        if(articles[i].id === id[1]){
          // console.log(articles[i])
          var result = articles.splice(i, 1);
          i = artLen;
        }
      }
      Reader.models[id[0]].save("articles", articles);
      // console.log(articles);

      $('.rssfeed').text("");
      $('.article-content').text("");
      articles.forEach(function(article){
        var content = '<div class="article" id="article-' + article.id + '">';
        content += '<div class="article-title" id="title-' + article.id + '">' + article.title + '</div>';
        content += "</div><!-- closes article -->";
        $('.rssfeed').append(content);
      });
      renderArticle(id[0], articles[0]);


    });
  });



});
