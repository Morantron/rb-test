class HomeController < ApplicationController
  def index
    @posts = Post.order('created_at DESC').all
    @total_post_count = Post.count
  end
end
