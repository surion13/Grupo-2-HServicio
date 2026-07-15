function FooterMobile() {
  return (
    <div>
      <nav className="fixed bottom-0 w-full z-50 bg-surface border-t border-outline-variant h-20 pb-safe px-2 flex justify-around items-center md:hidden rounded-t-xl">
        <button className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1 scale-95 transition-transform duration-150 cursor-pointer">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            home
          </span>
          <span className="text-label-sm mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors px-4 py-1 cursor-pointer">
          <span className="material-symbols-outlined">description</span>
          <span className="text-label-sm mt-1">Reports</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors px-4 py-1 cursor-pointer">
          <span className="material-symbols-outlined">add_circle</span>
          <span className="text-label-sm mt-1">New</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors px-4 py-1 cursor-pointer">
          <span className="material-symbols-outlined">
            admin_panel_settings
          </span>
          <span className="text-label-sm mt-1">Admin</span>
        </button>
      </nav>
    </div>
  );
}

export default FooterMobile;
