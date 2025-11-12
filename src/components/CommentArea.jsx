import { useRef, useState, useEffect } from "react";
import styles from "../styles/Projects.module.css";

export default function CommentArea({ projectId, comment, handleDeleteBtn, handleSaveBtn }) {
  
  const [commentContent, setCommentContent] = useState(comment.content); 
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(false);
  const [saving, setSaving] = useState(false);

  const textAreaRef = useRef(null);
  const buttonPanelRef = useRef(null);
  const saveBtnRef = useRef(null);
  const deleteBtnRef = useRef(null);

  useEffect(() => {
    if (saving) {
      saveBtnRef.current.innerText = "Save"
      setSaving(false);
    }
  }, [commentContent, saving])
  
  function handleCommentChange(e) {
    e.preventDefault();

    // you cannot delete a comment if it doesn't exist yet (has never been saved) 
    if (comment.id === null) {
      setIsDeleteDisabled(true);

    }
    if (e.target.value.trim() !== commentContent.content) { //compare against the original comment before edits
      saveBtnRef.current.removeAttribute('disabled');
      setIsSaveEnabled(true);
    } else {
      saveBtnRef.current.setAttribute("disabled", true);
      setIsSaveEnabled(false);
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
  
  function handleSaveBtnLocal(e) {
    e.preventDefault();
    if (textAreaRef) {
      textAreaRef.current.style.height = "4ch";
    }
    if (saveBtnRef && !saving) {
      setSaving(true);
      saveBtnRef.current.innerText = "Saving"
    }
    handleSaveBtn(e)
  }
  return (
    <div className={styles.commentArea}>
    <textarea
    ref={textAreaRef}
    name="comment"
    onClick={handleAreaClick}
    onChange={handleCommentChange}
    className={`${styles.comments} ${styles.currentComment}`}
    placeholder={commentContent.content ? "" : "what are your thoughts?"}
    id="comment"
    value={commentContent.content}
    maxLength={400}
    ></textarea>
    <div ref={buttonPanelRef} className={styles.buttonPanel}>
    <button disabled={isDeleteDisabled || comment.id === null} data_pid={projectId} ref={deleteBtnRef}  onClick={handleDeleteBtn} type="button">delete</button>
    <button data_pid={projectId} ref={saveBtnRef} disabled={!isSaveEnabled} type="button" onClick={handleSaveBtnLocal}>save</button></div>
    </div>
  );
}
