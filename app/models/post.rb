class Post < ActiveRecord::Base
  validates :title, length: { maximum: 255 }
  validates :content, length: { maximum: 4000 }
end
