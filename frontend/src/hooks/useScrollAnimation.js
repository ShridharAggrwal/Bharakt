import { useEffect, useRef, useState } from 'react'

/**
 * Custom hook for scroll-triggered animations using Intersection Observer
 * @param {Object} options - Intersection Observer options
 * @returns {Array} [ref, isVisible] - Ref to attach to element and visibility state
 */
export const useScrollAnimation = (options = {}) => {
    const ref = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true)
                // Once visible, keep it visible (don't animate out)
                observer.unobserve(entry.target)
            }
        }, {
            threshold: 0.1, // Trigger when 10% of element is visible
            ...options
        })

        const currentRef = ref.current
        if (currentRef) {
            observer.observe(currentRef)
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef)
            }
        }
    }, [options])

    return [ref, isVisible]
}
