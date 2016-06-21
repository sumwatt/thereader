function App(name) {
  this.name = name;
  this.id = md5(name);
  this.sources = [];
  this.models = {};
  this.watchers = [];
  this.categories = [];
}

function Categories(name, sources) {
  this.name = name;
  this.sources = [];
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
    $('#msg-box').html("<p>Item added!</p>");
    $('#feed-list').empty();
    Reader.sources.forEach(function(source){
      $('#feed-list').append('<li class="feed-list-item" id="li-' + source.id + '">' + source.name + '</li>');
    });
  });

  $('#feed-list').on('click', 'li', function(){
    var item = this.id.split("-");
    var sources = Reader.models[item[1]].findAll("articles");
    $('.rssfeed').text("");
    sources.forEach(function(article){
      var content = '<div class="article" id="article' + article.id + '">';
      content += '<div class="article-title">' + article.title + '</div>';
      content += '<div class="article-content">' + article.description + '</div>';
      content += "</div><!-- closes article -->";

      $('.rssfeed').append(content);
    });
  });


// //Create a new category name and store it in a new object. Push the object to reader.categories
//   $('#new-category').submit(function (event) {
//     event.preventDefault();
//     var categoryName = $('#category-name').val();
//     reader.categories.push(new Category(categoryName, []));
//   });
//
//
// //Create select box with category names
//   reader.forEach(function(catName){
//     var catSelectBox = '<option>' + reader.categories + '</option>';
//     $('#chooseCategory').append(catSelectBox);
//   });//NEED TO ADD NAME'S VALUE
//
// //populate checkbox source list
//   reader.forEach(function(sourceList){
//     var checkboxList = '<div class="checkbox">' + '<label>'+'<input type="checkbox" name="modal-source" value='+ source.id +'>' + source.name +'</label>'+'</div>'
//   });
//
// //Choose category from select box, checkbox to select sources to assign to choosen category. Push to selected category's object.
//   $('#add-to-category').submit(function (event) {
//     event.preventDefault();
//     var categorySources = [];
//     $('#add-to-category input:checked').each(function() {
//       categorySources.push($(this).val());
//     });
//     Categories.$('#chooseCategory').val().push(categorySources);//PUSHING TO WRONG PLACE
//   });

//Create a new category name and store it in a new object. Push the object to reader.categories
  $('#new-category').submit(function (event) {
    event.preventDefault();
    var categoryName = $('#category-name').val();
    var categoryObject = new Categories(categoryName, []);
  });


//Create select box with category names
  categoryObject.forEach(function(catName){
    var catSelectBox = '<option>' + categoryObject.name + '</option>';
    console.log(catSelectBox);
    $('#chooseCategory').append(catSelectBox);
  });

//populate checkbox source list
  reader.forEach(function(sourceList){
    var checkboxList = '<div class="checkbox">' + '<label>'+'<input type="checkbox" name="modal-source" value='+ source.id +'>' + source.name +'</label>'+'</div>'
  });

//Choose category from select box, checkbox to select sources to assign to choosen category. Push to selected category's object.
  $('#add-to-category').submit(function (event) {
    event.preventDefault();
    var categorySources = [];
    $('#add-to-category input:checked').each(function() {
      categoryObject.sources.push(categorySources)
    });
  });

  reader.categories.push(categoryObject);

});
