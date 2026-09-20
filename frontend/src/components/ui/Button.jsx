import { forwardRef } from 'react'
import { Link } from 'react-router-dom'

const variants = {
  primary:
    'bg-gradient-to-b from-ember-400 to-ember-600 text-[#1a0f00] font-semibold shadow-[0_1px_0_rgba(255,255,255,0.35)_inset,0_8px_20px_-8px_rgba(245,148,31,0.7)] hover:brightness-110 active:brightness-95',
  secondary:
    'bg-panel-3 text-text border border-line hover:border-ember-500/50 hover:bg-panel-3/80',
  ghost: 'text-muted hover:text-text hover:bg-white/5',
  danger: 'text-hard border border-hard/30 hover:bg-hard/10',
}

const sizes = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-5 text-base gap-2',
}

const Button = forwardRef(function Button(
  { as, to, variant = 'primary', size = 'md', className = '', children, ...props },
  ref
) {
  const classes = `inline-flex items-center justify-center rounded-xl transition-all duration-150 whitespace-nowrap disabled:opacity-40 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  const Comp = as || 'button'
  return (
    <Comp ref={ref} className={classes} {...props}>
      {children}
    </Comp>
  )
})

export default Button
