import Likes from "../../molecules/Likes/Likes";
import { Comment } from "../../../models";
import "./style.css";

const CommentComponent: React.FC<Comment> = (comment) => {
  return (
    <div className="comment">
      <strong>{comment.user}:</strong>
      <p>{comment.content}</p>
      <Likes commentId={comment.id} />
    </div>
  );
};

export default CommentComponent;
