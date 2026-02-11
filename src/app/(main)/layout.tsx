import NavMenu from "@/components/client/NavMenu";

// app/(main)/layout.tsx

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="max-w-[80%] mx-auto rounded-xl">
      <NavMenu />
      <main>{children}</main>
    </section>
  );
}
