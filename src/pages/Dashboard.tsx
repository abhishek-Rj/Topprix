import Navigation from "../components/navigation";
import Footer from "../components/Footer";

export default function Dashboard() {
  return (
    <>
      <Navigation />
      <main className="pt-20 pb-10 bg-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard</h1>
            <p className="text-lg text-gray-600">Welcome to your dashboard!</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
