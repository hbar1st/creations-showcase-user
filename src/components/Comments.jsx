import CommentArea from "./CommentArea";

import styles from "../styles/Projects.module.css";

export default function ProjectCardLeft({
  project,
  isAuthorized,
  isPending,
  handleDeleteBtn,
}) {

  return (
    <div className={styles.commentsArea}>
    {(!isPending && isAuthorized
      && (project.comments.length === 0
        || project.comments.reduce((acc, comment) => {
          return acc && (comment.userId !== isAuthorized)
        }, true))) ?
        (<form>
          <CommentArea projectId={project.id} comment="" isAuthorized={isAuthorized} handleDeleteBtn={handleDeleteBtn} />
          </form>)
          :
          (
            project.comments.map((comment) => {
              console.log(comment.user.nickname, comment.userId, comment.content)
              const isCurrentUsersComment = isAuthorized && (comment.userId === isAuthorized);
              return (
                <label>
                  {comment.user.nickname} -
                  {!isPending && isCurrentUsersComment ? (
                    <form>
                      <CommentArea
                        projectId={project.id}
                        comment={comment.content}
                        isAuthorized={isAuthorized}
                        handleDeleteBtn={handleDeleteBtn}
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
          )
        }
        </div>
      )
    }
    