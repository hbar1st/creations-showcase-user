import { useRef, useState, useActionState } from "react";
import styles from "../styles/Projects.module.css";

export default function CommentArea({ comment, isAuthorized }) {
  
  const [commentContent, setCommentContent] = useState(comment); 
  const textAreaRef = useRef(null);
  const buttonPanelRef = useRef(null)

  function handleCommentChange(e) {
    e.preventDefault();
    /*
    if (e.target.value.trim() === "") {
      //change the way this textarea looks since it is blank. Make the border red? Invalidate it? Or disable buttons?
    }
    */

    setCommentContent(e.target.value); 
  }

  function handleAreaClick(e) {
    e.preventDefault(e);
    if (textAreaRef) {
      textAreaRef.current.style.backgroundColor = "white";
      textAreaRef.current.placeholder = "";
      textAreaRef.current.style.height = "5rem";
      
      if (buttonPanelRef) {
        buttonPanelRef.current.style.zIndex = 2;
      }
    }
  }
  return (
    <div className={styles.commentArea}>
      <textarea
        ref={textAreaRef}
        name="comment"
        onClick={handleAreaClick}
        onChange={handleCommentChange}
        className={`${styles.comments} ${styles.currentComment}`}
        placeholder={commentContent ? "" : "what are your thoughts?"}
        id="comment"
        value={commentContent}
        maxLength={400}
      ></textarea>
      <div ref={buttonPanelRef}  className={styles.buttonPanel}><button type="submit">delete</button><button type="submit">post</button></div>
    </div>
  );
}
