import { CookieOptions, Response } from "express";
import { config } from "../config/index.js";

export const getAuthCookieOptions = (): CookieOptions => {
  return {
    httpOnly: false, // Accessible in document.cookie as requested
    secure: config.isProduction,
    sameSite: config.isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/"
  };
};

export const setAuthCookies = (res: Response, token: string, role?: string): void => {
  const options = getAuthCookieOptions();
  // Standard token cookie
  res.cookie("token", token, options);

  if (role === "admin") {
    res.cookie("admin_token", token, options);
    res.cookie("ai_labs_admin_token", token, options);
  } else {
    res.cookie("inno_auth_token", token, options);
  }
};

export const clearAuthCookies = (res: Response): void => {
  const clearOptions: CookieOptions = {
    path: "/",
    secure: config.isProduction,
    sameSite: config.isProduction ? "none" : "lax"
  };
  res.clearCookie("token", clearOptions);
  res.clearCookie("admin_token", clearOptions);
  res.clearCookie("ai_labs_admin_token", clearOptions);
  res.clearCookie("inno_auth_token", clearOptions);
};

