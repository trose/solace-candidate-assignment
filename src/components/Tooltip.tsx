"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  delay = 200
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipId = useMemo(() => `tooltip-${Math.random().toString(36).substr(2, 9)}`, []);

  const showTooltip = useCallback(() => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  }, [delay]);

  const hideTooltip = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  }, [timeoutId]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (isVisible) {
        hideTooltip();
      } else {
        showTooltip();
      }
    } else if (event.key === 'Escape') {
      event.preventDefault();
      hideTooltip();
    }
  }, [isVisible, showTooltip, hideTooltip]);

  // Check if children are interactive elements
  const isInteractive = useMemo(() => {
    if (React.isValidElement(children)) {
      const element = children as React.ReactElement;
      return element.type === 'button' ||
             element.type === 'a' ||
             element.props?.onClick ||
             element.props?.onKeyDown ||
             element.props?.tabIndex !== undefined;
    }
    return false;
  }, [children]);

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2"
  };

  const arrowClasses = {
    top: "top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800",
    bottom: "bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800",
    left: "left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800",
    right: "right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800"
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      onKeyDown={handleKeyDown}
      tabIndex={!isInteractive ? 0 : undefined}
      aria-describedby={isVisible ? tooltipId : undefined}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          id={tooltipId}
          className={`absolute z-50 px-2 py-1 text-sm text-white bg-gray-800 rounded shadow-lg whitespace-nowrap ${positionClasses[position]}`}
          role="tooltip"
          aria-hidden={!isVisible}
          aria-live="polite"
        >
          {content}
          <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`} />
        </div>
      )}
    </div>
  );
};
