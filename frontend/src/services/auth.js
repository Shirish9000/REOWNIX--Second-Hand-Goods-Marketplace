export const saveLoginData = (response) => {

    localStorage.setItem("token", response.token);
    localStorage.setItem("userId", response.userId);
    localStorage.setItem("firstName", response.firstName);
    localStorage.setItem("lastName", response.lastName);
    localStorage.setItem("email", response.email);
    localStorage.setItem("role", response.role);

};

export const logout = () => {

    localStorage.clear();

};

export const getUserId = () => {

    return localStorage.getItem("userId");

};

export const getToken = () => {

    return localStorage.getItem("token");

};

export const isLoggedIn = () => {

    return !!localStorage.getItem("token");

};