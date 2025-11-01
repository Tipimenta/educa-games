import logoSvg from '../assets/+EducaGames.svg';
import {
  FeaturesSection,
  HeroSection,
  LandingHeader,
  PricingSection,
  TestimonialsSection,
} from '../components';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />

      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <TestimonialsSection />
      </main>

      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Logo e descrição */}
            <div className="md:col-span-2">
              <div className="mb-4 flex items-center space-x-2">
                <img src={logoSvg} alt="EducaGames" className="h-8 w-auto" />
              </div>
              <p className="mb-4 max-w-md text-gray-400">
                Transforme o aprendizado em diversão com nossa plataforma educacional gamificada.
                Aprenda de forma interativa e eficaz.
              </p>
              <div className="flex space-x-4"></div>
            </div>

            {/* Links Úteis */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
                Links Úteis
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-400 transition-colors hover:text-white">
                    Recursos
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 transition-colors hover:text-white">
                    Planos
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Depoimentos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 transition-colors hover:text-white">
                    Suporte
                  </a>
                </li>
              </ul>
            </div>

            {/* Contato */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
                Contato
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:contato@educagames.com"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    contato@educagames.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+5511999999999"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    (11) 99999-9999
                  </a>
                </li>
                <li>
                  <span className="text-gray-400">São Paulo, SP - Brasil</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-800 pt-8">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <p className="text-sm text-gray-400">
                © 2024 EducaGames. Todos os direitos reservados.
              </p>
              <div className="mt-4 flex space-x-6 md:mt-0">
                <a href="#" className="text-sm text-gray-400 transition-colors hover:text-white">
                  Política de Privacidade
                </a>
                <a href="#" className="text-sm text-gray-400 transition-colors hover:text-white">
                  Termos de Uso
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
