import { StarIcon } from './Icons';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Ana Silva',
      role: 'Estudante de Desenvolvimento',
      content:
        'O EducaGames revolucionou minha forma de estudar! A gamificação torna tudo mais divertido e motivador.',
      rating: 5,
    },
    {
      name: 'Carlos Mendes',
      role: 'Professor de TI',
      content:
        'Excelente plataforma para gerenciar minhas turmas. Os relatórios me ajudam muito a acompanhar o progresso dos alunos.',
      rating: 5,
    },
    {
      name: 'Marina Costa',
      role: 'Estudante de Frontend',
      content:
        'Adoro o sistema de ranking! Me motiva a estudar mais e sempre buscar melhorar minha pontuação.',
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            O que nossos usuários dizem
          </h2>
          <p className="text-xl text-gray-600">
            Depoimentos reais de estudantes e professores que transformaram sua educação
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="transform rounded-lg bg-gray-50 p-6 transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-lg"
            >
              <div className="mb-4 flex">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 fill-current text-yellow-400" />
                ))}
              </div>
              <p className="mb-4 text-gray-700 italic">"{testimonial.content}"</p>
              <div>
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-600">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
