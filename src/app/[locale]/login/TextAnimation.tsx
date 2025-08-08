import { useEffect, useState } from 'react';

const greetings = [
  'Hello',
  '안녕하세요',
  'Hola',
  'Bonjour',
  '你好',
  'こんにちは',
  'Hallo',
  'مرحبا',
  'Olá',
  'Cześć',
  'Ciao'
];

export function TextAnimation() {
  const [currentGreeting, setCurrentGreeting] = useState(greetings[0]);
  const [key, setKey] = useState(0);

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setCurrentGreeting(greetings[index]);
      setKey((prevKey) => prevKey + 1);
      index = (index + 1) % greetings.length;
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        {`
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: scale(0.95); }
                    10% { opacity: 1; transform: scale(1); }
                    90% { opacity: 1; transform: scale(1); }
                    100% { opacity: 0; transform: scale(0.95); }
                }
                .animate-text {
                    animation: fadeInOut 4s infinite;
                }
                `}
      </style>
      <h1 key={key} className="text-center text-8xl font-bold animate-text min-h-25 mb-4">
        {currentGreeting}
      </h1>
    </>
  );
}
