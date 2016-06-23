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

if(Reader.categories){
  Reader.renderCats();
}


function resetFields(){
  $('#add-source-name').val("");
  $('#add-feed-link').val("");
}

$(function(){
  $("#addFeed").submit(function(event){
    event.preventDefault();
    var name = $('#add-source-name').val();
    var link = $('#add-feed-link').val();
    var newSource = new Source(name, link);
    Reader.addSources(newSource);
    $('#msg-box').html("<p>Item added!</p>");
    $('#feed-list').empty();

    for (var i=0; i< Reader.categories.length; i++) {
      if (Reader.categories[i].id === md5($('#chooseCategory').val())) {
        Reader.categories[i].sources.push(newSource.id);
        Reader.models[Reader.id].save("categories", Reader.categories);
        i = Reader.categories.length;
      }
    }
    Reader.models[Reader.id].save("categories", Reader.categories);
    Reader.renderCats();
    $('#model').hide();
    $('#addFeed')[0].reset();
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
     Reader.renderCats();
    //  Reader.sources.forEach(function(source){
    //    renderFeedList(source);
    //  });
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

    $('body').on('click', '.article-title', function(){
      var articleId = this.id.split("-");
      $('.article-content').text("");
      sources.forEach(function(article){
        if(article.id === articleId[1]){
          Reader.renderArticle(item[1], article);
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
      Reader.renderArticle(id[0], articles[0]);
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
