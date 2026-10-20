// Genera un identificador único sencillo. Cuando exista la API, el _id lo asignará MongoDB.
export function generarId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}
