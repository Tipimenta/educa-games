import './LogoAnimation.css'; // Vamos criar este ficheiro a seguir

import { useEffect, useRef } from 'react';

// --- FUNÇÃO PARA CRIAR PARTÍCULAS (do teu JS) ---
function createSparkle(container) {
  if (!container) return; // Garante que o container existe
  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle';
  const size = Math.random() * 5 + 2;
  const angle = Math.random() * 360;
  const radius = 20 + Math.random() * 20;
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;
  sparkle.style.width = `${size}px`;
  sparkle.style.height = `${size}px`;
  sparkle.style.left = `calc(50% + ${x}px)`;
  sparkle.style.top = `calc(50% + ${y}px)`;
  container.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 700);
}

// --- FUNÇÃO PARA REVELAR TEXTO (adaptada para React Refs) ---
function revealLetters(elementRef, delay) {
  const textElement = elementRef.current; // Usa a ref do React
  if (!textElement) return;

  textElement.classList.add('text-container-visible');
  const letters = textElement.innerText.split('');
  textElement.innerHTML = ''; // Limpa o conteúdo original
  const timers = []; // Array para guardar os IDs dos timers

  letters.forEach((letter) => {
    const span = document.createElement('span');
    span.innerText = letter;
    textElement.appendChild(span);
  });

  const letterSpans = Array.from(textElement.children);
  for (let i = letterSpans.length - 1; i >= 0; i--) {
    const timerId = setTimeout(
      () => {
        if (letterSpans[i]) {
          letterSpans[i].classList.add('visible');
        }
      },
      delay + (letterSpans.length - 1 - i) * 400
    );
    timers.push(timerId); // Guarda o ID
  }
  return timers; // Retorna os IDs para limpeza
}

// --- O COMPONENTE DE ANIMAÇÃO ---
const LogoAnimation = () => {
  const logoContainerRef = useRef(null);
  const educaTextRef = useRef(null);
  const gamesTextRef = useRef(null);

  // Este useEffect substitui o window.addEventListener("load") e o initAnimation()
  useEffect(() => {
    const container = logoContainerRef.current;
    if (!container) return;

    // 1. Adiciona a classe para iniciar as animações CSS
    container.classList.add('start-animation');

    // 2. Lógica das partículas (sparkles)
    let sparkleInterval;
    const sparkleStartTimer = setTimeout(() => {
      sparkleInterval = setInterval(() => createSparkle(container), 30);
    }, 500);

    const sparkleStopTimer = setTimeout(() => {
      clearInterval(sparkleInterval);
    }, 1700);

    // 3. Lógica de revelar o texto
    const gamesTimers = revealLetters(gamesTextRef, 3500);
    const educaTimers = revealLetters(educaTextRef, 5300);

    // 4. Função de Limpeza (MUITO importante)
    // Isto é executado quando o componente "morre", para parar as animações
    return () => {
      clearTimeout(sparkleStartTimer);
      clearTimeout(sparkleStopTimer);
      clearInterval(sparkleInterval);
      [...gamesTimers, ...educaTimers].forEach(clearTimeout);
    };
  }, []); // O array vazio [] significa que este efeito corre apenas uma vez, quando o componente é montado.

  return (
    // Este overlay cobre a tela inteira
    <div className="logo-animation-overlay">
      {/* O teu HTML original, agora com 'refs' do React */}
      <div className="logo-container" id="logoContainer" ref={logoContainerRef}>
        <svg
          id="plus-sign"
          width="27"
          height="27"
          viewBox="0 0 27 27"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.4375 18.1562C7.375 18.1771 6.4375 18.1875 5.625 18.1875C4.83333 18.1875 4.19792 18.1875 3.71875 18.1875C2.46875 18.1875 1.53125 18.1354 0.90625 18.0312C0.302083 17.9062 0 17.6667 0 17.3125C0 17.125 0.0520833 16.7396 0.15625 16.1562C0.28125 15.5521 0.416667 14.8854 0.5625 14.1562C0.729167 13.4062 0.885417 12.6562 1.03125 11.9062C1.19792 11.1354 1.33333 10.4896 1.4375 9.96875C1.47917 9.71875 1.63542 9.48958 1.90625 9.28125C2.19792 9.07292 2.57292 8.95833 3.03125 8.9375L9.3125 8.84375L9.375 8.1875C9.47917 6.77083 9.55208 5.55208 9.59375 4.53125C9.63542 3.51042 9.69792 2.67708 9.78125 2.03125C9.88542 1.38542 10.0417 0.916667 10.25 0.625C10.4583 0.3125 10.7812 0.15625 11.2188 0.15625C11.2604 0.15625 11.3021 0.166667 11.3438 0.1875C11.4062 0.1875 11.4688 0.1875 11.5312 0.1875C11.6562 0.1875 11.8438 0.1875 12.0938 0.1875C12.3646 0.166667 12.6667 0.15625 13 0.15625C13.3333 0.135417 13.6979 0.125 14.0938 0.125C14.4896 0.104167 14.875 0.09375 15.25 0.09375L18.2188 0C18.5104 0.0833333 18.7292 0.197917 18.875 0.34375C19.0208 0.46875 19.0938 0.71875 19.0938 1.09375C19.0938 1.13542 19.0938 1.16667 19.0938 1.1875C19.0938 1.20833 19.0833 1.28125 19.0625 1.40625C19.0625 1.53125 19.0521 1.72917 19.0312 2C19.0104 2.27083 18.9792 2.67708 18.9375 3.21875C18.8958 3.76042 18.8333 4.47917 18.75 5.375C18.6875 6.25 18.6042 7.35417 18.5 8.6875L19.0312 8.65625C19.8021 8.63542 20.5521 8.61458 21.2812 8.59375C22.0312 8.57292 22.7083 8.5625 23.3125 8.5625C23.9375 8.54167 24.4688 8.53125 24.9062 8.53125C25.3646 8.51042 25.6875 8.5 25.875 8.5C26.0417 8.5 26.2292 8.5625 26.4375 8.6875C26.6458 8.8125 26.75 9.05208 26.75 9.40625C26.7292 9.44792 26.6771 9.85417 26.5938 10.625C26.5104 11.3958 26.3958 12.4479 26.25 13.7812L25.9062 16.8125C25.7812 17.1042 25.6562 17.3229 25.5312 17.4688C25.4271 17.5938 25.2604 17.6875 25.0312 17.75C24.8021 17.8125 24.4688 17.8542 24.0312 17.875C23.6146 17.875 23.0417 17.8854 22.3125 17.9062L17.75 18L17.3438 22.5625C17.2812 23.3542 17.1979 24.0104 17.0938 24.5312C17.0104 25.0312 16.9062 25.4271 16.7812 25.7188C16.6562 26.0104 16.5 26.2188 16.3125 26.3438C16.1458 26.4479 15.9479 26.5 15.7188 26.5C15.3646 26.5 14.8854 26.5 14.2812 26.5C13.6771 26.4792 13.0312 26.4583 12.3438 26.4375C11.6771 26.4167 11.0104 26.4062 10.3438 26.4062C9.67708 26.3854 9.11458 26.375 8.65625 26.375C8.40625 26.3333 8.19792 26.2083 8.03125 26C7.88542 25.7917 7.8125 25.4792 7.8125 25.0625V24.875L8.4375 18.1562Z"
            fill="#FE8C68"
          />
        </svg>

        <h2 id="educa-text" ref={educaTextRef}>
          Educa
        </h2>
        <h2 id="games-text" ref={gamesTextRef}>
          Games
        </h2>
      </div>
    </div>
  );
};

export default LogoAnimation;
