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
        'Até 2 turmas',
        'Até 20 alunos por turma',
        'Criar trilhas, módulos e exercícios básicos',
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
        'Até 5 turmas',
        'Até 40 alunos por turma',
        'Todos os recursos do plano Free',
        'Ranking e pontuação',
        'Upload de conteúdo multimídia',
        'Relatórios simplificados',
        'Ideal para professores ativos com algumas turmas',
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
        'Até 10 turmas',
        'Até 60 alunos por turma',
        'Todos os recursos do plano Starter',
        'Certificados simples',
        'Suporte via chat',
        'Relatórios completos',
        'Ideal para instrutores com várias turmas e alunos recorrentes',
      ],
      highlight: true,
    },
    {
      name: 'Advanced',
      price: '89,90',
      monthlyPriceAnnual: '89,90',
      period: '/mês',
      periodAnnual: '/mês',
      features: [
        'Até 15 turmas',
        'Até 80 alunos por turma',
        'Todos os recursos do plano Pro',
        'Personalização visual (logo/cor)',
        'Suporte prioritário',
        'Exportação de dados',
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

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-lg bg-white shadow-lg ${
                plan.name === 'Gratuito' ? 'p-8' : 'p-8'
              } ${
                plan.highlight ? 'scale-105 transform ring-2 ring-blue-500' : 'hover:shadow-xl'
              } transition-all duration-300`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                  <span className="rounded-full bg-blue-500 px-4 py-1 text-sm font-semibold text-white">
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="mb-8 text-center">
                <h3 className="mb-2 text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  {isAnnual && plan.name !== 'Free' && plan.price !== plan.monthlyPriceAnnual ? (
                    <span className="mr-2 text-xl font-bold text-gray-400 line-through">
                      {plan.price}
                    </span>
                  ) : null}
                  <span className="text-4xl font-bold text-gray-900">
                    {isAnnual ? plan.monthlyPriceAnnual : plan.price}
                  </span>
                  <span className="ml-1 text-gray-600">
                    {isAnnual ? plan.periodAnnual : plan.period}
                  </span>
                </div>
                {isAnnual && plan.name !== 'Free' && (
                  <p className="mt-1 text-sm text-gray-500">pago anualmente</p>
                )}
              </div>

              {plan.name !== 'Gratuito' && (
                <button
                  onClick={() => handleWhatsAppContact(plan.name)}
                  className={`mb-4 w-full transform rounded-lg px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 ${
                    plan.highlight
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  FALAR NO WHATSAPP
                </button>
              )}

              <ul className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <CheckCircleIcon className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.name !== 'Gratuito' && (
                <p className="mt-6 text-center text-xs text-gray-500">
                  A assinatura continua automaticamente. Confira os termos.
                </p>
              )}

              {!plan.highlight && <p className="mb-6 text-center text-xs text-gray-500"></p>}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="font-semibold text-green-600 transition-colors hover:text-green-700">
            &gt; VER PLANO SOMENTE PARA PROFESSORES
          </button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
