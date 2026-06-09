import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">BioData Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/features" className="text-gray-600 hover:text-indigo-600">
                Features
              </Link>
              <Link to="/pricing" className="text-gray-600 hover:text-indigo-600">
                Pricing
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-indigo-600">
                Contact
              </Link>
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl">
              Manage Your School's
              <span className="text-indigo-600"> Candidate Data</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Streamline your recruitment process with our comprehensive candidate management system.
              Track applications, manage documents, and make informed hiring decisions.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="px-8">
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline" className="px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-indigo-600 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Candidate Management</h3>
              <p className="text-gray-600">
                Add, edit, and track candidate information with our intuitive interface.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-indigo-600 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Document Management</h3>
              <p className="text-gray-600">
                Upload and organize candidate documents securely in one place.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-indigo-600 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">
                Get insights into your recruitment process with detailed statistics.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 BioData Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
