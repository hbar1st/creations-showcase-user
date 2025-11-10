
import { useState } from "react";

import styles from "../styles/Projects.module.css";

export default function ProjectCardLeft({
  project,
  isAuthorized,
}) {
  
  return (
    <>
      {project.comments.map((comment) => {
        <textarea
          disabled
          className={styles.comments}
          name=""
          id=""
        >
          {comment}
        </textarea>;
      })}
    </>
  );
  }
  