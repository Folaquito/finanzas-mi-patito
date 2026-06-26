// Construye el objeto de usuario que consume el Shell (sidebar/topbar) a partir
// del usuario autenticado. Los campos cosméticos del patito viven solo en el front.
export function toShellUser(user) {
  const nombre = user?.nombre?.trim() || 'Invitado';
  const initials =
    nombre
      .split(/\s+/)
      .map((parte) => parte[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'MP';

  return {
    ...user,
    nombre,
    initials,
    duckStage: 2,
    duckProgress: 28,
  };
}
