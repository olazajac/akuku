// src/utils/auth.js
export const login = async (username, password) => {
  try {
    const response = await fetch(
      "https://akuku.club/wp-json/jwt-auth/v1/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    const data = await response.json();
    if (response.ok) {
      // Save the token for future API requests, e.g., in localStorage or state
      localStorage.setItem("jwtToken", data.token); // Save token in local storage
      return data.token; // Return the token for further processing if needed
    } else {
      throw new Error(data.message || "Login failed");
    }
  } catch (error) {
    console.error("Request failed:", error);
    return null; // Return null on failure
  }
};
