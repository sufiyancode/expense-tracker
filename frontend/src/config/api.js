import React from "react";

export const API_BASE_URL =
  "https://expense-tracker-mu-sage-83.vercel.app/api/v1";

export const ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/users/login`,
  SIGNUP: `${API_BASE_URL}/users/register`,
  TRANSACTIONS: `${API_BASE_URL}/transactions`,
};

export const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};
