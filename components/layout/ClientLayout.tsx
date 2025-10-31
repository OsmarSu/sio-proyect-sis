import { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';


interface ClientLayoutProps {
  children: ReactNode;
}

export const ClientLayout = ({ children }: ClientLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header></Header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer></Footer>
    </div>
  );
};