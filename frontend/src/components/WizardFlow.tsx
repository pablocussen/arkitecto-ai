import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  {
    id: 'type',
    title: 'Tipo de Proyecto',
    question: 'Para empezar, ¿qué tienes en mente construir o remodelar?',
    options: ['Casa', 'Quincho', 'Piscina', 'Remodelación'],
    type: 'multiple-choice',
  },
  {
    id: 'dimensions',
    title: 'Dimensiones',
    question: '¿Qué área o dimensiones aproximadas tiene el proyecto? (ej: 50 m2, 10x5 metros)',
    type: 'text',
  },
  {
    id: 'quality',
    title: 'Nivel de Calidad',
    question: 'En cuanto a la calidad de las terminaciones, ¿qué nivel buscas?',
    options: ['Económico', 'Estándar', 'Premium'],
    type: 'multiple-choice',
  },
  {
    id: 'details',
    title: 'Detalles Adicionales',
    question: '¿Hay algún material o detalle específico que te gustaría incluir? (ej: "ventanas de PVC", "piso de madera")',
    type: 'text',
  },
   {
    id: 'location',
    title: 'Ubicación',
    question: 'Para ajustar los costos, ¿en qué comuna o ciudad se ubica el proyecto?',
    type: 'text',
  },
  {
    id: 'summary',
    title: 'Resumen',
    question: '¡Perfecto! Revisa los detalles de tu proyecto:',
    type: 'summary',
  },
];

interface WizardFlowProps {
  onComplete: (answers: Record<string, string>) => void;
}

const WizardFlow = ({ onComplete }: WizardFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState('');

  const handleSelectOption = (answer: string) => {
    const stepId = steps[currentStep].id;
    const newAnswers = { ...answers, [stepId]: answer };
    setAnswers(newAnswers);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
const handleNextTextStep = () => {
    if (inputValue.trim() === '') {
      // Mostrar error
      alert('Por favor ingresa una respuesta');
      return;
    }
    handleSelectOption(inputValue);
    setInputValue('');
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const step = steps[currentStep];
  const progress = ((currentStep) / (steps.length - 1)) * 100;

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <motion.div layout className="glass-strong p-6 sm:p-8 rounded-2xl border border-white/10">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{step.title}</span>
            <span>Paso {currentStep + 1} de {steps.length}</span>
          </div>
          <div className="w-full bg-black/20 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-neon-cyan to-neon-banana h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{step.question}</h3>
            
            {step.type === 'multiple-choice' && step.options && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {step.options.map(option => (
                  <motion.button
                    key={option}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectOption(option)}
                    className="p-4 glass rounded-lg text-white font-semibold hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            )}

            {step.type === 'text' && (
              <div className="mt-4">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNextTextStep()}
                  className="w-full px-4 py-3 glass rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 border border-white/10"
                  placeholder="Escribe aquí..."
                />
              </div>
            )}
            
            {step.type === 'summary' && (
                <div className="mt-6 space-y-3 text-white">
                    {Object.entries(answers).map(([key, value]) => (
                        <div key={key} className="flex justify-between p-3 glass rounded-lg">
                            <span className="font-semibold capitalize text-gray-400">{steps.find(s => s.id === key)?.title}:</span>
                            <span className="font-medium">{value}</span>
                        </div>
                    ))}
                </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/10">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-4 py-2 text-gray-400 font-medium rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            Atrás
          </button>
          
          {step.type === 'text' && (
             <button
                onClick={handleNextTextStep}
                className="px-6 py-2 bg-neon-cyan text-dark-950 font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                Siguiente
              </button>
          )}

          {step.type === 'summary' && (
              <button
                onClick={() => onComplete(answers)}
                className="px-6 py-2 bg-gradient-to-r from-neon-cyan to-neon-banana text-dark-950 font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                Generar Presupuesto
              </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default WizardFlow;
