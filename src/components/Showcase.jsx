import { useGetAPI } from "../util/apiUtils";
import { useNavigate, Link } from "react-router";
import ProjectCardLeft from "./ProjectCardLeft";

import { CS_API_URL, useAuthorizeToken } from "../util/apiUtils";
import styles from "../styles/Projects.module.css";

export default function Projects() {


    const {
      isAuthorized,
      error: authError,
      loading: authLoading,
    } = useAuthorizeToken();
  

  let {
    data: projects,
    errors: projectsError,
    loading: projectsLoading,
  } = useGetAPI("/projects");

  const navigate = useNavigate();

  function handleLikeButton(e) {
    e.preventDefault();
    console.log("You clicked the heart: ", e.currentTarget.getAttribute('data-pid'));
    console.log("You are: ", e.currentTarget.getAttribute('data-userid'));
    console.log("is heart currently liked? ", e.currentTarget.getAttribute('data-liked'))
    // TODO call the API and actually set or unset the like as required
  }

  if (projectsLoading || authLoading ) {
    return <p>Loading...</p>;
  }
  if (projectsError) {
    navigate("/error", {
      state: projectsError,
      viewTransition: true,
    });
  }

    if (authError) {
      navigate("/error", {
        state: authError,
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
                <ProjectCardLeft project={project} isAuthorized={isAuthorized} handleLikeButton={handleLikeButton} />
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
