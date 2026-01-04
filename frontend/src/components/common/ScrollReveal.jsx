import { useScrollAnimation } from '../../hooks/useScrollAnimation.js'

/**
 * Wrapper component that adds scroll-triggered animation to its children
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to animate
 * @param {string} props.animation - Animation type: 'fade-in', 'slide-up', 'slide-in-left', 'slide-in-right', 'scale-in'
 * @param {number} props.delay - Animation delay in milliseconds
 * @param {string} props.className - Additional CSS classes
 */
const ScrollReveal = ({ children, animation = 'fade-in', delay = 0, className = '' }) => {
    const [ref, isVisible] = useScrollAnimation()

    const animationClass = `scroll-${animation}`
    const visibleClass = isVisible ? 'visible' : ''
    const delayStyle = delay > 0 ? { animationDelay: `${delay}ms` } : {}

    return (
        <div
            ref={ref}
            className={`${animationClass} ${visibleClass} ${className}`}
            style={delayStyle}
        >
            {children}
        </div>
    )
}

export default ScrollReveal
