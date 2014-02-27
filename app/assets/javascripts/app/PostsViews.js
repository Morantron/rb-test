//= require app/app.js

App.module('PostsViews', function(PostsViews, App, Backbone, Marionette, $, _){

  PostsViews.Item = Marionette.ItemView.extend({
    tagName: 'tr',
    template: 'templates/PostItemView',
  });

  PostsViews.List = Marionette.CompositeView.extend({
    template: 'templates/PostCompositeView',
    itemViewContainer: 'tbody',
    itemView: PostsViews.Item
  });

  PostsViews.Detail = Marionette.ItemView.extend({
    template: 'templates/PostDetailView',
    ui: {
      saveButton: '.save',
      deleteButton: '.delete',
      titleInput: 'input[name=title]',
      contentTextArea: 'textarea[name=content]'
    },
    events: {
      'click @ui.deleteButton' : 'deletePost',
      'click @ui.saveButton' : 'savePost',
      'input .form-control' : 'modelChanged'
    },
    modelChanged: function(){
      this.ui.saveButton.prop('disabled', false);
    },
    deletePost: function(){
      this.model.destroy();
      App.router.navigate("#", { trigger: true});
      event.preventDefault();
    },
    savePost: function(event){
      var that = this;
      var isNew = that.model.isNew();

      this.model.save({
        "title": this.ui.titleInput.val(),
        "content": this.ui.contentTextArea.val()
      }).done(function(model){
        if( isNew ){
          App.vent.trigger("new:post", that.model);
          App.router.navigate("#show/" + that.model.id, { trigger: true });
        }
      });

      this.ui.saveButton.prop('disabled', true);
      event.preventDefault();
    }
  });
});
