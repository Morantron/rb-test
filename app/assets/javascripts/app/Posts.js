//= require app/app.js

App.module('Posts', function(Posts, App, Backbone, Marionette, $, _){
  Posts.Post = Backbone.Model.extend({
    urlRoot : '/posts'
  });

  Posts.PostList = Backbone.Collection.extend({
    url: '/posts',
    model: Posts.Post
  });
});
