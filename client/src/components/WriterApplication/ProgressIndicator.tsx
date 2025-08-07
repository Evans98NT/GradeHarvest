import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
  className = ''
}) => {
  return (
    <div className={`${className}`}>
      {/* Desktop Progress Indicator */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;
            const isUpcoming = step.number > currentStep;

            return (
              <div key={step.number} className="flex items-center">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                      ${isCompleted 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : isCurrent 
                        ? 'bg-navy border-navy text-white' 
                        : 'bg-white border-gray-300 text-gray-400'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      React.createElement(step.icon, { className: "w-6 h-6" })
                    )}
                  </div>
                  
                  {/* Step Info */}
                  <div className="mt-3 text-center">
                    <p
                      className={`
                        text-sm font-medium
                        ${isCurrent ? 'text-navy' : isCompleted ? 'text-green-600' : 'text-gray-500'}
                      `}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 max-w-24">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                      flex-1 h-0.5 mx-4 mt-[-2rem] transition-all duration-300
                      ${step.number < currentStep ? 'bg-green-500' : 'bg-gray-300'}
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Progress Indicator */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Step {currentStep} of {steps.length}
          </h3>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / steps.length) * 100)}% Complete
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-navy h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>

        {/* Current Step Info */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center mr-3">
            {React.createElement(steps[currentStep - 1].icon, {
              className: "w-5 h-5 text-white"
            })}
          </div>
          <div>
            <p className="font-medium text-gray-800">
              {steps[currentStep - 1].title}
            </p>
            <p className="text-sm text-gray-500">
              {steps[currentStep - 1].description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
