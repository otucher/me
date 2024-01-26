import Likes, { Like } from "./Likes";

export interface Comment {
  user: string;
  content: string;
  timestamp: Date;
  likes?: Like[];
}

interface OptimisticComment extends Comment {
  isOptimistic?: boolean;
}

const CommentComponent: React.FC<OptimisticComment> = (comment) => {
  return (
    <div className="comment">
      <strong>{comment.user}:</strong>
      <p style={{ opacity: comment.isOptimistic ? 0.5 : undefined }}>
        {comment.content}
      </p>
      <Likes likes={comment.likes || []} />
    </div>
  );
};

export default CommentComponent;
