import { Link } from 'react-router-dom';

const LandingHeader = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/src/assets/+EducaGames.svg" alt="EducaGames" className="h-8 w-auto" />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex md:space-x-8">
            <a href="#features" className="text-gray-600 transition-colors hover:text-gray-900">
              Recursos
            </a>
            <a href="#pricing" className="text-gray-600 transition-colors hover:text-gray-900">
              Preços
            </a>
            <a href="#testimonials" className="text-gray-600 transition-colors hover:text-gray-900">
              Depoimentos
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-600 transition-colors hover:text-gray-900">
              Entrar
            </Link>
            <Link
              to="/cadastro"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Começar Grátis
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
