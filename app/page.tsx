// app/page.tsx
import Navbar from "@/components/layouts/navbar";
import Hero from "@/components/common/hero";
import MethodShortcuts from "@/components/sections/method-shortcuts";
import About from "@/components/sections/about";
import Footer from "@/components/layouts/footer";

export default function Home() {
  return (
    <div className="antialiased bg-[#f2f2f2] min-h-screen font-sans">
      <Navbar />

      <main className="min-h-screen flex items-center justify-center p-4 md:p-12 pt-32">
        <div className="bg-white rounded-[30px] md:rounded-[50px] shadow-2xl max-w-6xl w-full p-6 md:p-20 border border-gray-100">
          {/* Hero Section */}
          <Hero />

          {/* Shortcut Section (Pengganti Input-Output) */}
          <div className="mt-12">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-2xl font-bold tracking-tighter">
                pilih metode.
              </h2>
              <div className="h-[1px] flex-1 bg-gray-100"></div>
            </div>

            <MethodShortcuts />
            <About />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
