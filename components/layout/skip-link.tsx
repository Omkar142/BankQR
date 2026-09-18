"use client";
export function SkipLink() {
  return (
    <a
      className="skip-link"
      href="#main"
      onClick={(event) => {
        event.preventDefault();
        const main = document.getElementById("main");
        if (main) {
          main.tabIndex = -1;
          main.focus();
          main.scrollIntoView();
        }
      }}
    >
      Skip to content
    </a>
  );
}
