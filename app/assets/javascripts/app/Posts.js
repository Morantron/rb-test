//= require app/app.js

App.module('Posts', function(Posts, App, Backbone, Marionette, $, _){
  Posts.Post = Backbone.Model.extend({
    urlRoot : '/posts'
  });

  Posts.PostList = Backbone.PageableCollection.extend({
    //initialize: function(){
      //var that = this;
      //this.fetch({
        //success: function(collection, response, options){
          //console.log('state', that.state);
          //that.state.totalRecords = parseInt(options.xhr.getResponseHeader('X-Count'));
        //}
      //});
    //},
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
