import { useState } from 'react';

import { CheckCircleIcon } from './Icons';

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(false); // false para mensal, true para anual

  const handleWhatsAppContact = (planName) => {
    const message = `Olá! Tenho interesse no plano ${planName}. Gostaria de mais informações.`;
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const plans = [
    {
      name: 'Free',
      price: ' 0,00',
      monthlyPriceAnnual: '0,00',
      period: '/mês',
      periodAnnual: '/mês',
      features: [
        '1 turma',
        'Até 15 alunos',
        'Limite de upload: 20 MB',
        'Trilhas, módulos e ranking',
        'Ideal para professores em teste ou fase inicial',
      ],
      highlight: false,
    },
    {
      name: 'Starter',
      price: ' 29,90',
      monthlyPriceAnnual: '25,00',
      period: '/mês',
      periodAnnual: '/mês',
      features: [
        '3 turmas',
        'Até 25 alunos por turma',
        'Limite de upload: 300 MB',
        'Relatórios simplificados',
        'Todos os recursos do plano Free',
        'Ideal para professores ativos com algumas turmas'
      ],
      highlight: false,
    },
    {
      name: 'Pro',
      price: ' 59,90',
      monthlyPriceAnnual: '50,00',
      period: '/mês',
      periodAnnual: '/mês',
      features: [
        '7 turmas',
        'Até 50 alunos por turma',
        'Limite de upload: 1 GB',
        'Relatórios completos',
        'Certificados',
        'Suporte via chat',
        'Todos os recursos do plano Starter',
        'Ideal para instrutores com várias turmas e alunos recorrentes'
      ],
      highlight: true,
    },
    {
      name: 'Advanced',
      price: '89,90',
      monthlyPriceAnnual: '79,90',
      period: '/mês',
      periodAnnual: '/mês',
      features: [
        '15 turmas',
        'Até 80 alunos por turma',
        'Limite de upload: 5 GB',
        'Personalização visual (logo e cores)',
        'Exportação de dados',
        'Suporte prioritário',
        'Todos os recursos do plano Pro',
        'Ideal para instrutores e programas de formação maiores',
      ],
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Escolha o plano ideal para sua instituição
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Planos flexíveis para professores e instituições de ensino. Gerencie suas turmas, crie
            cursos e acompanhe o progresso dos seus alunos.
          </p>

          {/* Toggle Mensal/Anual */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-full bg-gray-200 p-1">
              <button
                onClick={() => setIsAnnual(false)}
                className={`rounded-full px-6 py-2 text-sm font-medium ${
                  !isAnnual ? 'bg-blue-600 text-white' : 'text-gray-900 hover:bg-gray-300'
                } transition-colors duration-300`}
              >
                Mensal
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`ml-2 rounded-full px-6 py-2 text-sm font-medium ${
                  isAnnual ? 'bg-blue-600 text-white' : 'text-gray-900 hover:bg-gray-300'
                } transition-colors duration-300`}
              >
                Anual
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex h-full flex-col rounded-lg bg-white p-6 sm:p-8 shadow-lg ${
                plan.highlight ? 'scale-105 transform ring-2 ring-blue-500' : 'hover:shadow-xl'
              } transition-all duration-300`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 transform">
                  <span className="rounded-full bg-blue-500 px-4 py-1 text-xs sm:text-sm font-semibold text-white">
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="mb-8 text-center">
                <h3 className="mb-2 text-xl sm:text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  {isAnnual && plan.name !== 'Free' && plan.price !== plan.monthlyPriceAnnual ? (
                    <span className="mr-2 text-lg sm:text-xl font-bold text-gray-400 line-through">
                      {plan.price}
                    </span>
                  ) : null}
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                    {isAnnual ? plan.monthlyPriceAnnual : plan.price}
                  </span>
                  <span className="ml-1 text-sm sm:text-base text-gray-400">
                    {isAnnual ? plan.periodAnnual : plan.period}
                  </span>
                </div>
                {isAnnual && plan.name !== 'Free' && (
                  <p className="mt-1 text-xs sm:text-sm text-gray-500">pago anualmente</p>
                )}
              </div>

              <ul className="flex-1 space-y-3 sm:space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <CheckCircleIcon className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleWhatsAppContact(plan.name)}
                className={`mt-6 w-full transform rounded-lg px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 ${
                  plan.highlight ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                FALAR NO WHATSAPP
              </button>
            </div>
          ))}
        </div>

        {/* Aviso único de recorrência fora dos cards */}
        <p className="mt-8 text-center text-xs text-gray-500">
          *Assinaturas dos planos pagos são renovadas automaticamente. Você pode cancelar a qualquer
          momento. Consulte os termos de uso.*
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
