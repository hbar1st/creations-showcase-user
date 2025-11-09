import { useGetAPI } from "../util/apiUtils";
import { useNavigate, Link } from "react-router";

import heartIcon from "../assets/heart.svg";
import commentIcon from "../assets/chat_bubble.svg";
import styles from "../styles/Projects.module.css";
import codeIcon from "../assets/code-link.svg";
import liveLinkIcon from "../assets/preview.svg"

export default function Projects() {

  let {
    data: projects,
    errors: getProjectsError,
    loading: getProjectsLoading,
  } = useGetAPI("/projects");

  const navigate = useNavigate();

  if (getProjectsLoading) {
    return <p>Loading...</p>;
  }
  if (getProjectsError) {
    navigate("/error", {
      state: getProjectsError,
      viewTransition: true,
    });
  }
  if (projects) {
    return (
      <>
        <h1>Projects</h1>
        <section className={styles.projectsSection}>
          {projects.result.map((project) => {
            return (
              <div
                key={project.id}
                data_id={project.id}
                className={styles.projectCard}
              >
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
                    <span className={styles.projectSocials}>
                      <img src={heartIcon} alt="likes" /> {project._count.likes}
                    </span>{" "}
                    <span className={styles.projectSocials}>
                      <img src={commentIcon} alt="comments" />{" "}
                      {project._count.comments}
                    </span>{" "}
                    {project["repo_link"] &&
                    <Link
                      to={project["repo_link"]}
                      className={styles.projectSocials}
                    >
                      <img src={codeIcon} alt="code" /> Repo
                      </Link> }
                    {project["live_link"] &&
                      <Link
                        to={project["live_link"]}
                        className={styles.projectSocials}
                      >
                        <img src={liveLinkIcon} alt="code" /> Live
                      </Link>}
                  </p>
                </div>
                <div className={styles.projectCardRight}>
                  <p>Authored by {project.author.user.nickname}</p>
                  <div>
                    <p>Description:</p>
                    <p className={styles.descr}>{project.descr}</p>
                  </div>
                  <p>
                    {project.comments.length > 0
                      ? "Comments"
                      : "No Responses Yet"}
                  </p>
                  
                  {project.comments.map(comment => {
                    <textarea
                      disabled
                      className={styles.comments}
                    name=""
                    id=""
                  >
                    {comment}
                  </textarea>
                    })}
                </div>
              </div>
            );
          })}
        </section>
      </>
    );
  }
}
