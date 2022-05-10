import React from "react";
import { Comment } from "../dataTypes";

export interface Props {
  comment: Comment;
}

const CommentComponent: React.FC<Props> = (props) => {
  return (
    <><li>
      <div>{props.comment.text}</div>
      <div>
        <small>{props.comment.send}</small>
      </div>
    </li>
    </>
  );
};

export default CommentComponent;
