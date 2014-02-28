//= require app/app.js

App.module('Posts', function(Posts, App, Backbone, Marionette, $, _){
  Posts.Post = Backbone.Model.extend({
    urlRoot : '/posts',
    defaults: {
      title: '',
      content: '',
      created_at: '',
      updated_at: ''
    }
  });

  Posts.PostList = Backbone.PageableCollection.extend({
    url: '/posts',
    model: Posts.Post,
    queryParams: {
      pageSize: 'limit',
      offset: function () { return this.state.currentPage * this.state.pageSize; }
    },
    parseState: function (resp, queryParams, state, options) {
        var count = parseInt(options.xhr.getResponseHeader('X-Count'));
        return {
          totalRecords: count
        };
    }
  });
});
