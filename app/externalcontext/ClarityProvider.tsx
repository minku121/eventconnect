"use client";

import { useEffect } from "react";
import clarity from "@microsoft/clarity";

export default function ClarityProvider() {
  useEffect(() => {
    clarity.init("qvarikz9eo"); 
  }, []);

  return null; 
}
