import { HashLink } from 'react-router-hash-link';

const LoginInfoCards = () => {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-100 bg-gray-50/30 p-5">
        <div className="flex items-start space-x-3">
          <span className="text-lg">📧</span>
          <div>
            <p className="text-sm font-semibold text-gray-800">Primeiro acesso?</p>
            <p className="mt-1 text-xs text-gray-500">
              Verifique seu email e clique no link de convite
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-gray-100 bg-gray-50/30 p-5">
        <div className="flex items-start space-x-3">
          <span className="text-lg">🎓</span>
          <div>
            <p className="text-sm font-semibold text-gray-800">Quer oferecer cursos gamificados?</p>
            <p className="mt-1 text-xs text-gray-500">
              <HashLink
                to="/#pricing"
                scroll={(el) => {
                  setTimeout(() => {
                    if (el) {
                      const headerOffset = 80;
                      const elementPosition = el.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth',
                      });
                    }
                  }, 100);
                }}
                className="text-secondary hover:underline"
              >
                Fale conosco
              </HashLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginInfoCards;
