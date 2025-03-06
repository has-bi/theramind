import { validateSession } from "./login/action";

export default async function Layout({ children }) {
  // validasi dulu sebelum bisa akses login / register, makesure gaada session
  await validateSession();

  return <>{children}</>;
}
