import { Link } from "react-router";
import { useState } from "react";

import styles from "../styles/Projects.module.css";

// icon imports
import heartIcon from "../assets/heart.svg";
import redHeartIcon from "../assets/red-heart.svg";
import commentIcon from "../assets/chat_bubble.svg";
import codeIcon from "../assets/code-link.svg";
import liveLinkIcon from "../assets/preview.svg";

export default function ProjectCardLeft({
  project,
  isAuthorized,
  handleLikeButton,
}) {
  const [likes, setLikes] = useState({
    count: project._count.likes,
    liked:
      isAuthorized &&
      project.likes.reduce((acc, el) => {
       return acc || (el.userId === isAuthorized);
      }, false),
  });

  function handleLikeButtonLocal(e) {
    console.log("likes count:", likes.count);
    let newObj = {};
    if (likes.liked) {
      newObj = { count: likes.count - 1, liked: !likes.liked };
    } else {
      newObj = { count: likes.count + 1, liked: !likes.liked };
    }
    setLikes(newObj);
    handleLikeButton(e, newObj);
  }

  return (
    <div className={styles.projectCardLeft}>
      <p>{project.title}</p>
      {project["live_link"] ? (
        <Link to={project["live_link"]}>
          {project.images.length > 0 ? (
            <img
              data_id={project.id}
              className={styles.projectImage}
              data_type="updateImage"
              src={project.images[0].url}
              alt="featured image"
            />
          ) : (
            "No Featured Image"
          )}
        </Link>
      ) : project.images.length > 0 ? (
        <img
          data_id={project.id}
          className={styles.projectImage}
          data_type="updateImage"
          src={project.images[0].url}
          alt="featured image"
        />
      ) : (
        "No Featured Image"
      )}
      <div>
        {isAuthorized ? (
          <p>
            <button
              className={styles.projectSocials}
              onClick={handleLikeButtonLocal}
              data-pid={project.id}
              data-userid={isAuthorized}
              data-liked={`${likes.liked}`}
            >
              <img src={likes.liked ? redHeartIcon : heartIcon} alt="likes" />{" "}
            </button>
            {likes.count}
          </p>
        ) : (
          <p>
            <span className={styles.projectSocials}>
              <img src={heartIcon} alt="likes" />
            </span>
            {project._count.likes}
          </p>
        )}
        <p>
          <span className={styles.projectSocials}>
            <img src={commentIcon} alt="comments" />
          </span>
          {project._count.comments}
        </p>
        {project["repo_link"] && (
          <p>
            <Link to={project["repo_link"]} className={styles.projectSocials}>
              <img src={codeIcon} alt="code" />
            </Link>
            Repo
          </p>
        )}
        {project["live_link"] && (
          <p>
            <Link to={project["live_link"]} className={styles.projectSocials}>
              <img src={liveLinkIcon} alt="code" />
            </Link>
            Live
          </p>
        )}
      </div>
    </div>
  );
}
