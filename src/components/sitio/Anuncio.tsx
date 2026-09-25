import { Flecha } from "./ui";

/** La franja verde de arriba de wisprflow. */
export default function Anuncio() {
  return (
    <div className="ov-anuncio">
      <p>Todas las industrias están listas para activar.</p>
      <a href="#activar">
        Activá la tuya
        <Flecha className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
