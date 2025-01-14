import { Slide, ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";
import Navbar from "./components/common/Navbar";
import Homepage from "./pages/Homepage";
import Canales from "./pages/Canales";
import Envios from "./pages/Envios";
import Footer from "./components/common/Footer";
import NuevoCanal from "./pages/NuevoCanal";
import NuevoEnvio from "./pages/NuevoEnvio";
import Validacion from "./pages/Validacion";
import Respuestas from "./pages/Respuestas";

const App: React.FC = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index path="/" element={<Homepage />} />
            <Route path="canales" element={<Canales />} />
            <Route path="canales/nuevo" element={<NuevoCanal />} />
            <Route path="envios" element={<Envios />} />
            <Route path="envios/nuevo" element={<NuevoEnvio />} />
            <Route path="respuestas" element={<Respuestas />} />
            <Route path="validacion" element={<Validacion />} />
          </Route>
        </Routes>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Slide}
        />
      </main>
      <Footer />
    </>
  );
};

export default App;
