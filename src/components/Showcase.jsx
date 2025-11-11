import { callAPI, useGetAPI } from "../util/apiUtils";
import { useNavigate, Link, useOutletContext } from "react-router";
import { useTransition } from "react";

import ProjectCardLeft from "./ProjectCardLeft";
import Comments from "./Comments";

import styles from "../styles/Projects.module.css";

export default function Projects() {
  const { authObj } = useOutletContext();
  const { isAuthorized, authError, authLoading } = authObj;

  const [isPending, startTransition] = useTransition();

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
        navigate("/error", {
          state: null,
          viewTransition: true,
        });
      }
    }

    updateLikes();
  }

   
  function handleDeleteBtn(e) {
    e.preventDefault();
    const projectId = e.target.getAttribute('data_pid');
    startTransition(async function () {

      try {
        const res = await callAPI("DELETE", `/projects/${projectId}/comment`);
        
        if (res && res.statusCode === 401) {
          navigate(res.navigate, { state: location.pathname, viewTransition: true })
        }
        
        if (res && res.statusCode !== 400) {
          console.log(
            "result came back ok for account delete: ",
            res
          );
          navigate("/showcase", { state: null, viewTransition: true });
        } else {
          // show these errors somewhere
          console.log(
            "result came back with errors? for account delete: ",
            res
          );
          //setValidationDetails(res.details);
        }
      } catch (error) {
        console.log(error, error.stack);
        throw new Error(error.message);
      } finally {
        //setProgressShown(false);
      }
    });
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
                  key={`${isAuthorized} ${project.id}`}
                  isAuthorized={isAuthorized}
                  handleLikeButton={handleLikeButton}
                />
                <div className={styles.projectCardRight}>
                  <p>Authored by {project.author.user.nickname}</p>
                  <div>
                    <p>Description:</p>
                    <p className={styles.descr}>{project.descr}</p>
                  </div>
                  <label htmlFor="comment">
                    {project.comments.length > 0
                      ? "Comments"
                      : "No Responses Yet"}
                  </label>
                  <Comments
                    key={project.id}
                    project={project}
                    isAuthorized={isAuthorized}
                    handleDeleteBtn={handleDeleteBtn}
                    isPending={isPending}
                  />
                </div>
              </div>
            );
          })}
        </section>
      </>
    );
  }
}
