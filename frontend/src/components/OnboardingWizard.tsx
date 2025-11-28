import { useState } from 'react';
import { motion } from 'framer-motion';

const onboardingSteps = [
  {
    title: 'Bienvenido a Arkitecto AI',
    description: 'La herramienta profesional para crear presupuestos de construcción con inteligencia artificial.',
    icon: '🚀'
  },
  {
    title: '¿Cómo Funciona?',
    description: 'Responde a un par de preguntas y nuestra IA generará un presupuesto detallado para tu proyecto, basado en un catálogo de más de 150 Análisis de Precios Unitarios (APU).',
    icon: '🤖'
  },
  {
    title: 'Visualiza tu Proyecto',
    description: 'Usa el "Modo Sueño" para generar renders e ideas visuales de tu proyecto. Puedes empezar desde una foto o solo con texto.',
    icon: '🎨'
  },
  {
    title: 'Exporta y Comparte',
    description: 'Una vez que tengas tu presupuesto, puedes exportarlo a PDF, Excel o simplemente copiar el texto para compartirlo.',
    icon: '📄'
  }
];

interface OnboardingWizardProps {
  onComplete: () => void;
}

const OnboardingWizard = ({ onComplete }: OnboardingWizardProps) => {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < onboardingSteps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        key={step}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-strong rounded-3xl p-8 max-w-md w-full text-center border-2 border-neon-cyan/30"
      >
        <div className="text-5xl mb-6">{onboardingSteps[step].icon}</div>
        <h2 className="text-2xl font-bold text-white mb-3">{onboardingSteps[step].title}</h2>
        <p className="text-gray-400 mb-8">{onboardingSteps[step].description}</p>
        <button
          onClick={handleNext}
          className="w-full py-3 bg-neon-cyan text-dark-950 font-bold rounded-xl hover:shadow-lg hover:shadow-neon-cyan/30 transition-all"
        >
          {step === onboardingSteps.length - 1 ? 'Comenzar a Construir' : 'Siguiente'}
        </button>
        <button
          onClick={onComplete}
          className="mt-2 text-sm text-gray-500 hover:text-white transition-colors"
        >
          Saltar tutorial
        </button>
      </motion.div>
    </motion.div>
  );
};

export default OnboardingWizard;
