'use client';

import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

type Coords = {
  top: number;
  left: number;
  pos: 'top' | 'bottom';
  maxHeight?: number;
};

export const Dropdown = ({ icon: Icon, label, children, active, title }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<Coords>({ top: 0, left: 0, pos: 'bottom' });
  const [isMeasured, setIsMeasured] = useState(false);

  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const DROPDOWN_GAP = 6;
  const DROPDOWN_PADDING = 12;

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !dropdownRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    const dropdownWidth = dropdownRef.current.offsetWidth;
    const dropdownHeight = dropdownRef.current.offsetHeight;

    // Horizontal
    let left = triggerRect.left;
    if (left + dropdownWidth + DROPDOWN_PADDING > viewportW) {
      left = viewportW - dropdownWidth - DROPDOWN_PADDING;
    }
    if (left < DROPDOWN_PADDING) left = DROPDOWN_PADDING;

    // Vertical
    const spaceBottom = viewportH - triggerRect.bottom - DROPDOWN_PADDING;
    const spaceTop = triggerRect.top - DROPDOWN_PADDING;

    let top = 0;
    let pos: 'top' | 'bottom' = 'bottom';
    let maxHeight: number | undefined;

    if (spaceBottom >= dropdownHeight + DROPDOWN_GAP) {
      top = triggerRect.bottom + DROPDOWN_GAP;
      pos = 'bottom';
    } else if (spaceTop >= dropdownHeight + DROPDOWN_GAP) {
      top = triggerRect.top - dropdownHeight - DROPDOWN_GAP;
      pos = 'top';
    } else {
      if (spaceBottom >= spaceTop) {
        top = triggerRect.bottom + DROPDOWN_GAP;
        pos = 'bottom';
        maxHeight = spaceBottom;
      } else {
        top = DROPDOWN_PADDING;
        pos = 'top';
        maxHeight = spaceTop;
      }
    }

    setCoords({ top, left, pos, maxHeight });
    setIsMeasured(true);
  }, []);

  // Open dropdown safely
  const openDropdown = () => {
    setIsOpen(true);
  };

  // Outside click & resize
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      )
        return;
      setIsOpen(false);
    };

    window.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition, true);

    // initial position
    calculatePosition();

    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition, true);
    };
  }, [isOpen, calculatePosition]);

  // Recalculate after first render to adjust exact height
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      calculatePosition();
    }
  }, [isOpen, calculatePosition]);

  return (
    <div ref={triggerRef} className="relative inline-block">
      <button
        type="button"
        title={title}
        onClick={() => (isOpen ? setIsOpen(false) : openDropdown())}
        className={`flex items-center gap-1 rounded-lg p-2 transition-all hover:bg-indigo-50 ${
          active || isOpen ? 'bg-indigo-100 font-bold text-indigo-700 shadow-sm' : 'text-slate-600'
        }`}
      >
        {Icon && <Icon size={18} strokeWidth={2.5} />}
        {label && <span className="max-w-20 truncate text-xs font-semibold">{label}</span>}
        <ChevronDown
          size={11}
          className={`opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            className="fixed z-9999"
            style={{
              top: coords?.top ?? -9999,
              left: coords?.left ?? -9999,
            }}
          >
            <div
              ref={dropdownRef}
              className={`animate-in fade-in zoom-in-95 custom-scrollbar max-w-[calc(100vw-24px)] min-w-40 overflow-y-auto rounded-xl border border-slate-100 bg-white p-1 shadow-2xl ${
                !isMeasured ? 'invisible' : ''
              }`}
              style={{ maxHeight: coords?.maxHeight ? `${coords.maxHeight}px` : undefined }}
            >
              {children}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};
