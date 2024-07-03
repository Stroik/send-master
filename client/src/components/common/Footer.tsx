const Footer: React.FC = () => (
  <footer className="footer bg-base-200 items-center p-4 mt-2">
    <aside className="grid-flow-col items-center">
      <p>
        Copyright © SendMaster {new Date().getFullYear()} - Todos los derechos
        reservados
      </p>
    </aside>
  </footer>
);

export default Footer;
