export default function isAuth() {
  const jwtToken = localStorage.getItem("jwt_token");
  let isLogged = false;
  if (jwtToken !== undefined && jwtToken) {
    isLogged = true;
  } else {
    isLogged = false;
  }

  return [isLogged, jwtToken];
}
