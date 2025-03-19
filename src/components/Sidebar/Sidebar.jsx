import "./Sidebar.css";

const Sidebar = ({ children }) => {
  return (
    <section className="sidebar-container">
      <div className="sidebar-content">{children}</div>
    </section>
  );
};
export default Sidebar;
