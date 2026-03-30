import { Check } from 'lucide-react'

interface Step {
  label: string
  sublabel?: string
}

interface PipelineStepProps {
  steps: Step[]
  currentStep: number
}

export function PipelineSteps({ steps, currentStep }: PipelineStepProps) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center min-w-max gap-0">
        {steps.map((step, i) => {
          const done = i < currentStep
          const active = i === currentStep
          return (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                  done ? 'bg-[#00D4FF] border-[#00D4FF] text-black' :
                  active ? 'bg-[rgba(0,212,255,0.1)] border-[#00D4FF] text-[#00D4FF]' :
                  'bg-[#1A1A1A] border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.3)]'
                }`}>
                  {done ? <Check size={14} /> : i + 1}
                </div>
                <div className="text-center">
                  <p className={`text-xs font-medium whitespace-nowrap ${
                    active ? 'text-[#00D4FF]' : done ? 'text-white' : 'text-[rgba(255,255,255,0.3)]'
                  }`}>{step.label}</p>
                  {step.sublabel && <p className="text-[10px] text-[rgba(255,255,255,0.25)]">{step.sublabel}</p>}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-12 h-px mx-1 mb-6 transition-all ${done ? 'bg-[#00D4FF]' : 'bg-[rgba(255,255,255,0.08)]'}`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
