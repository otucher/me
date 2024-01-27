import Likes from "../molecules/Likes";
import { Comment } from "../../models";

const CommentComponent: React.FC<Comment> = (comment) => {
  return (
    <div className="comment">
      <strong>{comment.user}:</strong>
      <p>
        {comment.content}
      </p>
      <Likes commentId={comment.id} />
    </div>
  );
};

export default CommentComponent;
