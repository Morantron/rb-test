//= require app/app.js

App.module('Posts', function(Posts, App, Backbone, Marionette, $, _){

  // Post model
  Posts.Post = Backbone.Model.extend({
    urlRoot : '/posts',

    defaults: {
      title: '',
      content: '',
      created_at: '',
      updated_at: ''
    },

    // Validation rules
    validate: function(attributes, options){
      var errors = [];

      if( attributes.content.length > 4000 ){
        errors.push('Content too long. Maximum length is 4000');
      }

      if( attributes.title.length > 255 ){
        errors.push('Title too long. Maximum length is 255');
      }

      if( errors.length ){
        return errors; //cancel save
      }
    }
  });

  // Posts collection ( uses Backbone.PageableCollection )
  Posts.PostList = Backbone.PageableCollection.extend({
    url: '/posts',

    model: Posts.Post,

    queryParams: {
      pageSize: 'limit',
      offset: function () { return this.state.currentPage * this.state.pageSize; }
    },

    // Read record count from 'X-Count' response header of the API and updates
    // pagination state.
    parseState: function (resp, queryParams, state, options) {
        var count = parseInt(options.xhr.getResponseHeader('X-Count'));
        return {
          totalRecords: count
        };
    }
  });
});
