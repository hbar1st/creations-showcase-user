import { useNavigate, Link } from "react-router";
import { useState } from "react";

import styles from "../styles/Projects.module.css";

// icon imports
import heartIcon from "../assets/heart.svg";
import redHeartIcon from "../assets/red-heart.svg"
import commentIcon from "../assets/chat_bubble.svg";
import codeIcon from "../assets/code-link.svg";
import liveLinkIcon from "../assets/preview.svg";

export default function ProjectCardLeft({ project, isAuthorized, handleLikeButton }) {

  const [likes, setLikes] = useState({
    count: project._count.likes, liked: isAuthorized && Boolean(project.likes.find(el => {
      el.userid === isAuthorized
    }))
  });

  function handleLikeButtonLocal(e) {
    setLikes(prev => {
      if (prev.liked) {
        return { count: prev.count--, liked: !prev.liked }
      } else {
        return { count: prev.count++, liked: !prev.liked }
      }
    });
    handleLikeButton(e)
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
      <p>
        {isAuthorized ? (

          <button className={styles.projectSocials} onClick={handleLikeButtonLocal} data-pid={project.id} data-userid={isAuthorized} data-liked={`${likes.liked}`}>
            <img src={likes.liked ? redHeartIcon : heartIcon} alt="likes" /> {likes.count}
          </button>
        ) : (
          <span className={styles.projectSocials}>
            <img src={heartIcon} alt="likes" /> {project._count.likes}
          </span>
        )}
        <span className={styles.projectSocials}>
          <img src={commentIcon} alt="comments" /> {project._count.comments}
        </span>
        {project["repo_link"] && (
          <Link to={project["repo_link"]} className={styles.projectSocials}>
            <img src={codeIcon} alt="code" /> Repo
          </Link>
        )}
        {project["live_link"] && (
          <Link to={project["live_link"]} className={styles.projectSocials}>
            <img src={liveLinkIcon} alt="code" /> Live
          </Link>
        )}
      </p>
    </div>
  );
}
