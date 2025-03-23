import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-2xl">
        <h1 className="text-5xl font-bold mb-6">Welcome to EcoDrive</h1>
        <p className="text-xl mb-8">Your sustainable driving companion</p>
        <Link to="/login" className="btn bg-white text-primary-600 hover:bg-gray-100">
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Smart Analysis</h3>
          <p className="text-gray-600">
            Track your driving habits and get personalized recommendations for more efficient driving.
          </p>
        </div>
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Energy Marketplace</h3>
          <p className="text-gray-600">
            Buy and sell energy credits in our WattSwap marketplace to offset your carbon footprint.
          </p>
        </div>
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Real-time Dashboard</h3>
          <p className="text-gray-600">
            Monitor your energy consumption and savings in real-time with our intuitive dashboard.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Our Impact</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">10K+</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">500K+</div>
            <div className="text-gray-600">Miles Analyzed</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">100T+</div>
            <div className="text-gray-600">CO2 Saved</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 