import { callAPI, useGetAPI } from "../util/apiUtils";
import { useNavigate, Link, useOutletContext } from "react-router";
import ProjectCardLeft from "./ProjectCardLeft";

import { CS_API_URL, useAuthorizeToken } from "../util/apiUtils";
import styles from "../styles/Projects.module.css";

export default function Projects() {
  const { authObj } = useOutletContext();
  const { isAuthorized, authError, authLoading } = authObj;

  let {
    data: projects,
    errors: projectsError,
    loading: projectsLoading,
  } = useGetAPI("/projects");

  const navigate = useNavigate();

  function handleLikeButton(e, { liked }) {
    const pid = e.currentTarget.getAttribute("data-pid");
    console.log("You are: ", e.currentTarget.getAttribute("data-userid"));

    async function updateLikes() {
      try {
        const updateProjectLike = liked
          ? await callAPI("PUT", `/projects/${pid}/like`)
          : await callAPI("delete", `/projects/${pid}/like`);

        if (updateProjectLike && updateProjectLike.status === 401) {
          navigate(updateProjectLike.route, {
            state: location.pathname,
            viewTransition: true,
          });
        }

        if (updateProjectLike && updateProjectLike.statusCode !== 400) {
          console.log(
            "result came back ok for project like/unlike: ",
            updateProjectLike
          );
        } else {
          // show these errors somewhere
          console.log(
            "result came back with errors? for project like/unlike: ",
            updateProjectLike
          );
        }
      } catch (error) {
        console.log(error, error.stack);
        throw new Error(error.message);
      }
    }

    updateLikes();
  }

  if (projectsLoading || authLoading) {
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
                <ProjectCardLeft
                  project={project}
                  isAuthorized={isAuthorized}
                  handleLikeButton={handleLikeButton}
                />
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
                </div>
              </div>
            );
          })}
        </section>
      </>
    );
  }
}
