export function createDbUri({ user, password, host, port, database }) {
  const encodedUser = encodeURIComponent(user);
  const encodedPassword = encodeURIComponent(password);
  return `postgres://${encodedUser}:${encodedPassword}@${host}:${port}/${database}`;
}
