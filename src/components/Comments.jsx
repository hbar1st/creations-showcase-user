import CommentArea from "./CommentArea";

import styles from "../styles/Projects.module.css";

export default function Comments({
  project,
  isAuthorized,
  isPending,
  handleDeleteBtn,
  handleSaveBtn,
}) {
  return (
    <div className={styles.commentsArea}>
      {isAuthorized &&
        (project.comments.length === 0 ||
          project.comments.reduce((acc, comment) => {
            return acc && comment.userId !== isAuthorized;
          }, true)) && (
          <form>
            <CommentArea
              projectId={project.id}
              comment={{ id: null, content: "" }}
              handleDeleteBtn={handleDeleteBtn}
              handleSaveBtn={handleSaveBtn}
            />
          </form>
        )}
      {!isPending ? (
        project.comments.map((comment) => {
          const isCurrentUsersComment =
            isAuthorized && comment.userId === isAuthorized;
          return (
            <label key={comment.id}>
              {comment.user.nickname} -
              {isCurrentUsersComment ? (
                <form>
                  <CommentArea
                    projectId={project.id}
                    comment={comment}
                    handleDeleteBtn={handleDeleteBtn}
                    handleSaveBtn={handleSaveBtn}
                  />
                </form>
              ) : (
                <textarea
                  key={comment.id}
                  disabled
                  className={styles.comments}
                  name="comment"
                  value={comment.content}
                ></textarea>
              )}
            </label>
          );
        })
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
