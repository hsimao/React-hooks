import { useState, useEffect } from "react";
import { GraphQLClient } from "graphql-request";

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "production-url"
    : "http://localhost:4000/graphql";

// GraphQL 請求封裝, 預先設定好 url 跟 token
export const useClient = () => {
  const [idToken, setIdToken] = useState("");

  useEffect(() => {
    const idToken = window.gapi.auth2
      .getAuthInstance()
      .currentUser.get()
      .getAuthResponse().id_token;

    setIdToken(idToken);
  }, []);

  return new GraphQLClient(BASE_URL, {
    headers: { authorization: idToken }
  });
};
