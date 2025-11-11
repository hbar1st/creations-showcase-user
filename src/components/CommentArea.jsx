import { useRef, useState, useActionState } from "react";
import styles from "../styles/Projects.module.css";

export default function CommentArea({ projectId, comment, isAuthorized, handleDeleteBtn }) {
  
  const [commentContent, setCommentContent] = useState(comment); 
  const textAreaRef = useRef(null);
  const buttonPanelRef = useRef(null);
  const saveBtnRef = useRef(null);
  const deleteBtnRef = useRef(null);

  function handleCommentChange(e) {
    e.preventDefault();
    /*
    if (e.target.value.trim() === "") {
      //change the way this textarea looks since it is blank. Make the border red? Invalidate it? Or disable buttons?
    }
    */
    if (comment === "") {
      // we don't need a delete button if the original comment value was blank anyway
      deleteBtnRef.current.setAttribute("disabled", true) 
    }
    if (e.target.value.trim() !== comment) { //compare against the original comment before edits
      saveBtnRef.current.removeAttribute('disabled');
    } else {
      saveBtnRef.current.setAttribute("disabled", true);
    }
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
      <div ref={buttonPanelRef} className={styles.buttonPanel}>
        <button disabled={comment===""} data_pid={projectId} ref={deleteBtnRef}  onClick={handleDeleteBtn} type="submit">delete</button>
        <button data_pid={projectId} ref={saveBtnRef}  disabled type="submit">save</button></div>
    </div>
  );
}
