class PostsController < ApplicationController

  # GET /posts
  # Accepts 'limit' and 'offset' params in query string to perform pagination.
  # Also it adds an 'X-Count' response header to inform about the total count
  # of posts.
  def index
    max_limit = 1000
    limit = (params[:limit].present? ? params[:limit] : max_limit).to_i
    offset = (params[:offset].present? ? params[:offset] : 0).to_i

    if limit > max_limit
      render json: { error: 'Limit too large' }, status: :bad_request
    else
      logger.debug "limit: #{limit}, offset: #{offset}"
      response.headers['X-Count'] = "#{Post.count}"
      @posts = Post.order('created_at DESC').limit(limit).offset(offset)
      render json: @posts
    end
  end

  # GET /posts/:id
  def show
    @post = Post.find(params[:id])

    if @post
      render json: @post
    else
      render status: :not_found
    end
  end

  # POST /posts
  def create
    @post = Post.new(post_params)

    if @post.save
      redirect_to @post
    else
      render status: :bad_request
    end
  end

  # DELETE /posts/:id
  def destroy
    @post = Post.find(params[:id])
    @post.destroy

    if @post.destroyed?
      render json: @post, status: :ok
    else
      render json: @post, status: :bad_request
    end
  end

  # PUT /posts/:id
  def update
    @post = Post.find(params[:id])

    if @post.update(post_params)
      render json: @post
    else
      render status: :bad_request
    end
  end
  
  private 
    # only 'title' and 'content' params are accepted through POST
    def post_params
      params.require(:post).permit(:title, :content)
    end

end
