import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { clearToken, getToken } from "../util/storage";

const mode = import.meta.env.MODE;

console.log("mode: ", mode);

const CS_API_URL_DEV = "http://localhost:3000";
const CS_API_URL_PROD = "https://civic-janenna-hbar1stdev-7cb31133.koyeb.app";

export const CS_API_URL =
  mode == "development" ? CS_API_URL_DEV : CS_API_URL_PROD;

export const getHeader = (token) => {
  if (token) {
    return {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    };
  } else {
    return {
      "Content-Type": "application/x-www-form-urlencoded",
    };
  }
};

// the route it the path we want to invoke in the target API
// if call fails with 401 (unauthorized), returns an object containing statusCode, state value which is location.pathname, and navigation path
// otherwise for validation errors or success results, it returns the json we got
export async function callAPI(action = "GET", route, formData = null) {
  if (!getToken()) {
    console.trace("checking up on authorization: ", getToken());
    throw new Error("Unexpected error: token is missing");
  }
  const requestObj = {
    method: action,
    headers: getHeader(getToken()),
  };
  if (formData) {
    requestObj.body = new URLSearchParams(formData);
  }
  try {
    const res = await fetch(`${CS_API_URL}${route}`, requestObj);
    if (res.status === 401) {
      console.log("trying to get data but not authorized");
      clearToken();
      return {
        statusCode: res.status,
        navigate: "/login",
        state: location.pathname,
      };
    } else if (res.ok || res.status === 400) {
      const data = await res.json();
      console.log("this is the data the page should show: ", data);
      return data;
    } else {
      throw new Error(
        "Internal error. Failed to contact the server. Contact support if the issue persists. Status code: " +
          res.status
      );
    }
  } catch (error) {
    console.log(error, error.stack);
    throw new Error(
      "Internal error. Failed to complete the request. Contact support if the issue persists"
    );
  }
}

export function useAuthorizeToken() {
  const [isAuthorized, setIsAuthorized] = useState(false); // this is either false or the userid value
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (getToken()) {
        try {
          setLoading(true);
          const result = await verifyToken();
          if (!ignore) {
            setIsAuthorized(result);
          }
        } catch (error) {
          console.log(
            "caught an error from calling verifyToken inside of useAuthorizeToken"
          );
          setError(error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setIsAuthorized(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);
  return { isAuthorized, setIsAuthorized, error, loading };
}

export const verifyToken = async () => {
  if (getToken()) {
    try {
      const res = await fetch(`${CS_API_URL}/user/authenticate`, {
        method: "GET",
        headers: getHeader(getToken()),
      });
      if (res.status === 404 || res.status === 500) {
        console.log("umm, api call didn't go thru?");
        throw new Error("Internal Error. Contact support if error persists.");
      } else if (!res.ok) {
        console.log("about to clear the token in apiUtils");
        clearToken();
        return false;
      } else if (res.ok) {
        const data = await res.json();
        return data.userid;
      }
    } catch (error) {
      console.log("unexpected error when verifying token");
      console.log(error, error.stack);
      throw new Error(error.message);
    }
  } else {
    return false;
  }
};

export function useGetAPI(route) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();
    async function callAPI() {
      try {
        setLoading(true);
        const res = await fetch(`${CS_API_URL}${route}`, {
          method: "GET",
          headers: getHeader(getToken()),
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();

          if (!ignore) {
            setLoading(false);
            console.log("this is the data the loader should show: ", data);
            setData(data);
          }
        } else {
          setError(error);
          navigate("/error", {
            state: error,
            viewTransition: true,
          });
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Aborted duplicate call to useGetAPI");
          return;
        }
        console.log(error, error.stack);

        setError(error);
        navigate("/error", {
          state: error,
          viewTransition: true,
        });
      }
    }
    if (route) {
      callAPI();
    }
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [error, location.pathname, navigate, route]);

  return { data, setData, error, loading };
}
