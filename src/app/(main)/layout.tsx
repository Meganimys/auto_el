import NavMenu from "@/components/client/NavMenu";
import Footer from "@/components/client/Footer";

// app/(main)/layout.tsx

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="max-w-[90%] mx-auto rounded-xl py-25">
      <NavMenu />
      <main>{children}</main>
      <Footer />
    </section>
  );
}
