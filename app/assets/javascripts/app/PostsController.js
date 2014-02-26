//= require app/app.js

App.module('PostsController', function(PostsController, App, Backbone, Marionette, $, _){
  PostsController.Controller = Marionette.Controller.extend({
    initialize: function(posts){
      console.log(posts);
      this.posts = new App.Posts.PostList(posts);
      console.log('posts collection', this.posts);
      this.start();
    },
    start: function(){
      App.main.show(
        new App.PostsViews.List({
          collection: this.posts
        })
      );
    },
    show: function(id){
      var post = this.posts.get(id);

      App.main.show(
        new App.PostsViews.Detail({
          model: post
        })
      );
    }
  });
});
