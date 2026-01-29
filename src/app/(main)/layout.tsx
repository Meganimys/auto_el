import NavMenu from "@/components/client/NavMenu";

// app/(main)/layout.tsx

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavMenu />
      <main>{children}</main>
    </>
  );
}
