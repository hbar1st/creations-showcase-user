import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { clearToken, getToken } from "../util/storage";

const mode = import.meta.env.MODE;

console.log("mode: ", mode);

const CS_API_URL_DEV = "http://localhost:3000";
const CS_API_URL_PROD = "https://civic-janenna-hbar1stdev-7cb31133.koyeb.app";

export const CS_API_URL =
  mode == "development" ? CS_API_URL_DEV : CS_API_URL_PROD;

export const getHeader = (token) => ({
  "Content-Type": "application/x-www-form-urlencoded",
  Authorization: `Bearer ${token}`,
});

export function useAuthorizeToken() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (getToken()) {
        try {
          setLoading(true);
          const result = await verifyToken();

          setIsAuthorized(result);
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
  }, []);
  return { isAuthorized, error, loading };
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
        return true;
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
