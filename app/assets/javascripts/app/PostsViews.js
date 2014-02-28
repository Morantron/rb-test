//= require app/app.js

App.module('PostsViews', function(PostsViews, App, Backbone, Marionette, $, _){

  var helperFunctions = {
    deletePost: function(){
      if( confirm('Are you sure you want to delete this post?') ){
        this.model.destroy()
        .done(function(){
          App.vent.trigger('delete:post');
          App.router.navigate('#', { trigger: true});
        })
        .fail(function(){
          App.vent.trigger('notification:error', 'Post not found in database.');
        });
      }
      event.preventDefault();
    },
  };

  PostsViews.Item = Marionette.ItemView.extend({
    tagName: 'tr',
    template: 'templates/PostItemView',
    events: {
      'click .delete-button' : 'deletePost'
    },
    deletePost: helperFunctions.deletePost
  });

  PostsViews.List = Marionette.CompositeView.extend({
    template: 'templates/PostCompositeView',
    itemViewContainer: 'tbody',
    itemView: PostsViews.Item,
    templateHelpers: function(){
      return {
        postCount: this.collection.length
      };
    }
  });

  PostsViews.Detail = Marionette.ItemView.extend({
    initialize: function(options){
      _.defaults(options, {
        currentPage: 0
      });
      this.currentPage = options.currentPage;
    },
    template: 'templates/PostDetailView',
    serializeData: function(){
      return _.extend(this.model.toJSON(), {
                currentPage: this.currentPage
              });
    },
    ui: {
      saveButton: '.save',
      deleteButton: '.delete',
      titleInput: 'input[name=title]',
      contentTextArea: 'textarea[name=content]',
      backButton: '.history-back'
    },
    events: {
      'click @ui.deleteButton' : 'deletePost',
      'click @ui.saveButton' : 'savePost',
      'input .form-control' : 'modelChanged'
    },
    modelChanged: function(){
      this.ui.saveButton.prop('disabled', false);
    },
    deletePost: helperFunctions.deletePost,
    savePost: function(event){
      var that = this;
      var isNew = that.model.isNew();

      this.model.save({
        'title': this.ui.titleInput.val(),
        'content': this.ui.contentTextArea.val()
      }).done(function(model){
        if( isNew ){
          App.vent.trigger('new:post', that.model);
          App.router.navigate('#show/' + that.model.id, { trigger: true });
        } else {
          App.vent.trigger('notification:success', 'Post updated.');
        }
      }).fail(function(){
        App.vent.trigger('notification:error', 'Could not update post. Please try again');
        that.$el.find('input').trigger('input');
      });

      this.ui.saveButton.prop('disabled', true);
      event.preventDefault();
    }
  });
});
