// override Marionette renderer
Backbone.Marionette.Renderer.render = function(template, data){
    if (!JST[template]) throw "Template '" + template + "' not found!";
      return JST[template](data);
}

var App = new Backbone.Marionette.Application();

//PostController

//PostModel
//PostCollection

//PostItemView
//PostCollectionView

App.addInitializer(function(data){
  console.log('init app', arguments);

  App.addRegions({
    main : '#main'
  });

  var controller = new App.PostsController.Controller(data.posts);
  var Router = Marionette.AppRouter.extend({});

  App.router = new Router();
  App.router.processAppRoutes(controller, {
      "": "start",
      "show/:id": "show"
  });

  Backbone.history.start();
});