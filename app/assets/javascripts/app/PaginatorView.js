//= require app/app.js

App.module('PaginatorView', function(PaginatorView, App, Backbone, Marionette, $, _){
  PaginatorView.View = Marionette.ItemView.extend({
    template: 'templates/PaginatorTemplate',
    initialize: function(options){
      this.listenTo(this.collection, "reset", this.render);
      this.render();
    },
    serializeData: function(){
      console.log('state', this.collection.state);
      return this.collection.state;
    }
  });

  PaginatorView.PaginatedListLayout = Marionette.Layout.extend({
    template: 'templates/PaginatedListLayout',
    regions: {
      list: "#list",
      paginator: "#paginator"
    }
  });
});
