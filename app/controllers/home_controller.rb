class HomeController < ApplicationController
  def index
    # render posts and post count so the app can be boostrapped without the
    # need of an additional request to fetch the posts
    @posts = Post.order('created_at DESC').all
    @total_post_count = Post.count
  end
end
