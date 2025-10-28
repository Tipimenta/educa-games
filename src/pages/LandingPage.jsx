import FeaturesSection from '../components/FeaturesSection';
import HeroSection from '../components/HeroSection';
import LandingHeader from '../components/LandingHeader';
import PricingSection from '../components/PricingSection';
import TestimonialsSection from '../components/TestimonialsSection';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <TestimonialsSection />
        
        {/* Footer */}
        <footer className="bg-gray-900 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              {/* Logo e Descrição */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <img
                    src="/src/assets/+EducaGames.svg"
                    alt="EducaGames"
                    className="h-8 w-auto"
                  />
                  
                </div>
                <p className="text-gray-400 mb-4 max-w-md">
                  Transforme o aprendizado em diversão com nossa plataforma educacional gamificada. 
                  Aprenda de forma interativa e eficaz.
                </p>
                <div className="flex space-x-4">
                </div>
              </div>

              {/* Links Úteis */}
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  Links Úteis
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                      Recursos
                    </a>
                  </li>
                  <li>
                    <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                      Planos
                    </a>
                  </li>
                  <li>
                    <a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">
                      Depoimentos
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Suporte
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contato */}
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  Contato
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a href="mailto:contato@educagames.com" className="text-gray-400 hover:text-white transition-colors">
                      contato@educagames.com
                    </a>
                  </li>
                  <li>
                    <a href="tel:+5511999999999" className="text-gray-400 hover:text-white transition-colors">
                      (11) 99999-9999
                    </a>
                  </li>
                  <li>
                    <span className="text-gray-400">
                      São Paulo, SP - Brasil
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-800 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm">
                  © 2024 EducaGames. Todos os direitos reservados.
                </p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Política de Privacidade
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Termos de Uso
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;

