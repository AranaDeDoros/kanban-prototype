
// src/context/TokenContext.jsx
import { createContext, useContext } from "react";

export const TokenContext = createContext(null);

export const useTokenContext = () => useContext(TokenContext);
