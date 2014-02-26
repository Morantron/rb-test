//= require app/app.js

App.module('PostsViews', function(PostsViews, App, Backbone, Marionette, $, _){
  PostsViews.Item = Marionette.ItemView.extend({
    template: 'templates/PostItemView',
  });

  PostsViews.List = Marionette.CollectionView.extend({
    tagName: 'ul',
    itemView: PostsViews.Item
  });

  PostsViews.Detail = Marionette.ItemView.extend({
    template: 'templates/PostDetailView'
  });
});
