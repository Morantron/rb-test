//= require app/app.js

App.module('PostsController', function(PostsController, App, Backbone, Marionette, $, _){
  PostsController.Controller = Marionette.Controller.extend({
    initialize: function(posts){
      var that = this;
      console.log(posts);
      this.posts = new App.Posts.PostList(posts);
      console.log('posts collection', this.posts);
      this.start();

      App.vent.on("new:post", function(post){
        that.posts.add(post);
      });
    },
    newPost: function(model){

    },
    start: function(){
      App.main.show(
        new App.PostsViews.List({
          collection: this.posts
        })
      );
    },
    show: function(id){
      var post = id === 'new' ?
                  new App.Posts.Post() :
                  this.posts.get(id);

      App.main.show(
        new App.PostsViews.Detail({
          model: post
        })
      );
    }
  });
});
