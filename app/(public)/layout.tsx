import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;

  return (
    <div className="flex min-h-screen flex-col">
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
