"use client";

import { signOut } from "next-auth/react";
import React from "react";

const Signout = () => {
  return (
    <div>
      <button
        onClick={() => signOut({ callbackUrl: "http://localhost:3000/login" })}
        className="btn btn-neutral font-bold"
      >
        Sign out
      </button>
    </div>
  );
};

export default Signout;
