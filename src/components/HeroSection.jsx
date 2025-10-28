import { Link } from 'react-router-dom';

import { ArrowRightIcon, PlayIcon } from '../components/Icons';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="animate-fade-in mb-6 text-4xl font-bold text-gray-900 md:text-6xl">
            Transforme o aprendizado em
            <span className="animate-pulse text-blue-600"> diversão</span>
          </h1>
          <p className="animate-slide-up mx-auto mb-8 max-w-3xl text-xl text-gray-600">
            A plataforma educacional que combina gamificação, interatividade e resultados. Aprenda
            de forma divertida e eficaz com o EducaGames.
          </p>
          <div className="animate-bounce-in flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/cadastro"
              className="flex transform items-center justify-center rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-lg"
            >
              Começar Agora
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <button className="flex transform items-center justify-center rounded-lg border border-gray-300 px-8 py-4 text-lg font-semibold text-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:shadow-lg">
              <PlayIcon className="mr-2 h-5 w-5" />
              Ver Demonstração
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
