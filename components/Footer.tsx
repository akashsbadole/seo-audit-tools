import React from "react";

const Footer = () => {
  return (
    <footer className="px-8 bg-indigo-950 py-4">
      <div className="container mx-auto">
        <p className="text-center text-white text-sm">
          &copy; {new Date().getFullYear()} SEO Audit Tool. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
