import { Link } from "react-router-dom";

const Homepage: React.FC = () => (
  <div className="flex flex-col gap-6">
    <div className="hero bg-base-200 min-h-80">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Dѻmѻ</h1>
          <p className="py-6">
            Envíos masivos de mensajes de whatsapp. Utilice multiples sesiones
            para el mismo mensaje
          </p>
          <Link className="btn btn-primary" to="/wizard">Comenzar</Link>
        </div>
      </div>
    </div>
    <div className="flex justify-center items-center w-full h-full gap-6">
      <div className="card bg-primary text-primary-content w-96">
        <div className="card-body">
          <h2 className="card-title">Canales</h2>
          <p className="pb-4">Administra tus canales de Whatsapp</p>
          <div className="card-actions justify-end">
            <Link className="btn" to="/canales">
              Acceder
            </Link>
          </div>
        </div>
      </div>
      <div className="card bg-primary text-primary-content w-96">
        <div className="card-body">
          <h2 className="card-title">Envíos</h2>
          <p className="pb-4">Realiza envíos desde todos tus canales</p>
          <div className="card-actions justify-end">
            <Link className="btn" to="/envios">
              Acceder
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Homepage;
