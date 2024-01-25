import { Comment } from "../atoms/NewComment";
import Comments from "../molecules/Comments";
import Likes, { Like } from "../molecules/Likes";

export interface PostProps {
  title: string;
  content: string;
  user: string;
  timestamp: Date;
  likes: Like[];
  comments: Comment[];
}

const Post: React.FC<PostProps> = ({
  title,
  content,
  user,
  likes,
  comments,
}) => (
  <div className="post">
    <h3>{title}</h3>
    <p>{content}</p>
    <div className="post-meta">
      <p>Author: {user}</p>
      <Likes likes={likes} />
      <Comments comments={comments} />
    </div>
  </div>
);

export default Post;
