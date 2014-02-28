class HomeController < ApplicationController
  def index
    @posts = Post.all
    @total_post_count = Post.count
  end
end
