"use client";

import LogoutModal from "./LogoutModal";

const Logout = () => {
  return (
    <div data-tip="Logout" className="tooltip tooltip-right">
      <LogoutModal />
    </div>
  );
};

export default Logout;
