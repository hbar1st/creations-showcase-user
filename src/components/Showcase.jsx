import { callAPI, useGetAPI } from "../util/apiUtils";
import { useNavigate, Link, useOutletContext } from "react-router";
import { useState, useRef, useEffect } from "react";
import { useTransition } from "react";

import ProjectCardLeft from "./ProjectCardLeft";
import Comments from "./Comments";

import styles from "../styles/Projects.module.css";

export default function Projects() {
  const { authObj } = useOutletContext();
  const { isAuthorized, setIsAuthorized, authError, authLoading } = authObj;

  const [isPending, startTransition] = useTransition();
  const [progressShown, setProgressShown] = useState(false);
  const [validationDetails, setValidationDetails] = useState([]);

  const progressRef = useRef(null);

  let {
    data: projects,
    setData: setProjects,
    errors: projectsError,
    loading: projectsLoading,
  } = useGetAPI("/projects");

  const navigate = useNavigate();

    useEffect(() => {
      if (!progressShown && progressRef) {
        progressRef.current?.close();
      } else {
        progressRef.current?.showModal();
      }
    }, [progressShown]);
  
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
        setProgressShown(true);
        const res = await callAPI("DELETE", `/projects/${projectId}/comment`);
        
        if (res && res.statusCode === 401) {
          setIsAuthorized(false);
        }
        
        if (res && res.statusCode !== 400) {
          console.log("result came back ok for comment delete: ", res);
          // set the state to make it refresh
          const newProjects = { ...projects.result };
          for (const key in newProjects) {
            const project = newProjects[key];
            if (project.id === res.result.projectId) {
              for (let i = 0; i < project.comments.length; i++) {
                if (
                  Number(project.comments[i].userId) === Number(isAuthorized)
                ) {
                  delete project.comments[i]
                }
              }
            }
          }
          setProjects({ ...projects });
        } else {
          // show these errors somewhere
          console.log(
            "result came back with errors? for comment delete: ",
            res
          );
          setValidationDetails(res.details);
        }
      } catch (error) {
        console.log(error, error.stack);
        navigate("/error", {
          state: null,
          viewTransition: true,
        });
      } finally {
        setProgressShown(false);
      }
    });
  }

    function handleSaveBtn(e) {
      e.preventDefault();
      console.log(e.target.parentNode.parentNode.parentNode)
      const formData = new FormData(e.target.parentNode.parentNode.parentNode);

      const projectId = e.target.getAttribute("data_pid");
      startTransition(async function () {
        try {
          setProgressShown(true);
          const res = await callAPI("POST", `/projects/${projectId}/comment`, formData);

          if (res && res.statusCode === 401) {
            setIsAuthorized(false);
          }

          if (res && res.statusCode !== 400) {
            console.log("result came back ok for saving a comment: ", res);
            // set the state to make it refresh
            const newProjects = { ...projects.result };
            for (const key in newProjects) {
              const project = newProjects[key];
              if (project.id === res.result.projectId) {
                for (let i = 0; i < project.comments.length; i++) {
                  if (Number(project.comments[i].userId) === Number(isAuthorized)) {
                    project.comments[i].content = res.result.content;
                  }
                }
              }
             
            }
            setProjects({ ...projects });
          } else {
            // show these errors somewhere
            console.log(
              "result came back with errors? for saving a comment: ",
              res
            );
            setValidationDetails(res.details);
          }
        } catch (error) {
          console.log(error, error.stack);
          navigate("/error", {
            state: null,
            viewTransition: true,
          });
        } finally {
          setProgressShown(false);
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

        {validationDetails && validationDetails.length > 0 && (
          <ValidationErrors
            details={validationDetails}
            setDetails={setValidationDetails}
            action="comment update"
          />
        )}
        <dialog className="progress-dialog" ref={progressRef}>
          <header>
            <p>Please wait.</p>
          </header>
          <progress value={null} />
        </dialog>
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
                    project={project}
                    isAuthorized={isAuthorized}
                    handleDeleteBtn={handleDeleteBtn}
                    handleSaveBtn={handleSaveBtn}
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
