import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-muted/40">
      <Header />
      <main className="container py-8">{children}</main>
    </div>
  );
};

export default Layout;