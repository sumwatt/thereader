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
Reader.categories = Reader.models[Reader.id].fetch("categories") || [];


// Pre-render the feed lists if they exist
// Thank you localStorage for persistence :D
//Reader.models.push(Reader.id);
$('#feed-list').empty();
Reader.sources.forEach(function(source){
  $('#feed-list').append('<li class="feed-list-item" id="li-' + source.id + '">' + source.name + '</li>');
});

if(Reader.categories){
  Reader.categories.forEach(function(category){
    $('#chooseCategory').append('<option id="catopt-' + category.id + '">' + category.name + '</option>');
  });

}



var renderArticle = function(id, article){
  var content = '<div class="article-title-inline"></span> <a href="' + article.link + '">'+  article.title + '</a></div>';
  content += '<div class="article-link-bar">';
  content += '<span class="glyphicon glyphicon-trash" aria-hidden="true" id="' + id + "-" + article.id  + '">';
  //content += '"<span class="glyphicon glyphicon-play-circle">' + '</span>';
  content += '</div><!-- end linkbar -->';
  if(article.podcast){
    content += '<div class="podcast-link"><audio controls>'+
              '<source src="' + article.audioUrl  + '"></audio></div>';
  }
  content += '<div class="article-content-body">' + article.content + '</div>';

  $('.article-content').append(content);
}



$(function(){
  $("#addFeed").submit(function(event){
    event.preventDefault();
  //  debugger;
    var name = $('#add-source-name').val();
    var link = $('#add-feed-link').val();
    var newSource = new Source(name, link);
    Reader.addSources(newSource);
    $('#msg-box').html("<p>Item added!</p>");
    $('#feed-list').empty();
    Reader.sources.forEach(function(source){
      $('#feed-list').append('<li class="feed-list-item" id="li-' + source.id + '">' + source.name + '</li>');
    });
    for (var i=0; i<=Reader.categories.length; i++) {
      if (Reader.categories[i].name === $('#chooseCategory').val() ) {
        Reader.categories[i].sources.push(newSource);
      }
    }

  });


  $('#feed-list').on('click', 'li', function(){
    var item = this.id.split("-");
    var sources = Reader.models[item[1]].findAll("articles");
    $('.rssfeed').text("");
    sources.forEach(function(article){
      var content = '<div class="article" id="article-' + article.id + '">';
      content += '<div class="article-title" id="title-' + article.id + '">' + article.title + '</div>';
      content += "</div><!-- closes article -->";
      $('.rssfeed').append(content);
    });

    var sourceName;
    Reader.sources.forEach(function(source) {
      if (source.id === item[1]) {
        sourceName = source.name;
      }
    });
    $('#source-name').text(sourceName + " Articles");

    // var mySource;
    // for (var i = 0; i < Reader.sources.length; i++) {
    //
    // }

    $('body').on('click', '.article-title', function(){
      var articleId = this.id.split("-");
      $('.article-content').text("");
      sources.forEach(function(article){
        if(article.id === articleId[1]){
          renderArticle(item[1], article);
        }

      });
    });


    $('.article-content').on("click", '.glyphicon-trash', function(event){
      var id = this.id.split("-");
      var articles = Reader.models[id[0]].fetch("articles");
      var artLen = articles.length;
      for(var i = 0; i < artLen; i++){
        if(articles[i].id === id[1]){
          var result = articles.splice(i, 1);
          i = artLen;
        }
      }
      Reader.models[id[0]].save("articles", articles);
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

  $('#catNameButton').click(function (event) {
    event.preventDefault();
    Reader.addCat(new Categories($('#catName').val(),[]));
    $('#chooseCategory').text("");
    Reader.categories.forEach(function(category){
      $('#chooseCategory').append('<option id="catopt-' + category.id + '">' + category.name + '</option>');
    });
  });
});
