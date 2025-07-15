import { Check } from 'lucide-react'
import { cn } from '~/lib/utils'

export interface Step {
  id: number
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      {/* Steps Container */}
      <div className="flex items-start justify-between relative">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = currentStep === step.id
          const isCompleted = currentStep > step.id

          return (
            <div
              key={step.id}
              className="flex flex-col items-center flex-1 relative"
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative z-10',
                  {
                    'bg-orange-600 text-white shadow-lg': isActive,
                    'bg-green-600 text-white': isCompleted,
                    'bg-gray-200 text-gray-500': !isActive && !isCompleted,
                  }
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>

              <div className="mt-3 text-center px-1">
                <p
                  className={cn(
                    'text-xs font-medium transition-colors duration-300 leading-tight',
                    {
                      'text-orange-600': isActive,
                      'text-green-600': isCompleted,
                      'text-gray-500': !isActive && !isCompleted,
                    }
                  )}
                >
                  {step.title}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'absolute top-5 left-1/2 w-full h-0.5 transition-all duration-300',
                    {
                      'bg-green-600': isCompleted,
                      'bg-gray-200': !isCompleted,
                    }
                  )}
                  style={{
                    marginLeft: '20px',
                    width: 'calc(100% - 40px)',
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
