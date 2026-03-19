import { TextareaHTMLAttributes, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] font-medium text-[#555555] uppercase tracking-[0.08em]">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={`w-full bg-[#1A1A1A] border rounded-lg px-3.5 py-2.5 text-sm text-[#F5F5F5] placeholder-[#444444] focus:outline-none transition-colors resize-none ${
          error
            ? 'border-[rgba(239,68,68,0.4)] focus:border-[#EF4444]'
            : 'border-[rgba(255,255,255,0.08)] focus:border-[rgba(255,77,109,0.5)]'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-[#EF4444]">{error}</p>}
    </div>
  )
)
Textarea.displayName = 'Textarea'
