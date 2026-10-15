'use client';
import { ServiceIcon } from './ServiceIcon';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Icon } from './Icon';
import styles from './search-select.module.css';

export type SelectOption = { value: string; label: string };
type Props = {
  id: string;
  label: string;
  placeholder: string;
  searchPlaceholder: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  icon: 'search' | 'pin' | 'city' | 'service';
  disabled?: boolean;
  hideLabel?: boolean;
  describedBy?: string;
};
const normalize = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('ro').trim();

// The browser's auto popover supplies light dismissal, top-layer rendering and
// exclusivity between instances, without a global listener or a UI dependency.
export function SearchSelect({ id, label, placeholder, searchPlaceholder, options, value, onChange, icon, disabled = false, hideLabel = false, describedBy }: Props) {
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(-1);
  const choices = [{ value: '', label: placeholder }, ...options];
  const filtered = choices.filter(option => normalize(option.label).includes(normalize(query)));
  const selected = choices.find(option => option.value === value) ?? choices[0];
  const listId = `${id}-options`;
  const activeId = active >= 0 && active < filtered.length ? `${id}-option-${active}` : undefined;

  function positionPanel() {
    const button = trigger.current;
    const popup = panel.current;
    if (!button || !popup) return;
    const viewport = window.visualViewport;
    const leftEdge = (viewport?.offsetLeft ?? 0) + 12;
    const rightEdge = leftEdge + (viewport?.width ?? window.innerWidth) - 24;
    const bottomEdge = (viewport?.offsetTop ?? 0) + (viewport?.height ?? window.innerHeight) - 12;
    let rect = button.getBoundingClientRect();
    // Keep the menu beneath its field even when the mobile keyboard reduces
    // the visible viewport. Scrolling the field creates space for its menu.
    if (bottomEdge - rect.bottom < 180) {
      button.scrollIntoView({ block: 'start', behavior: 'instant' });
      rect = button.getBoundingClientRect();
    }
    const width = Math.min(Math.max(rect.width, 260), rightEdge - leftEdge);
    Object.assign(popup.style, {
      top: `${rect.bottom + 8}px`,
      left: `${Math.max(leftEdge, Math.min(rect.left, rightEdge - width))}px`,
      width: `${width}px`,
      maxHeight: `${Math.max(0, Math.min(340, bottomEdge - rect.bottom - 8))}px`,
    });
  }

  function close(restoreFocus = false) {
    panel.current?.hidePopover();
    setOpen(false);
    if (restoreFocus) trigger.current?.focus({ preventScroll: true });
  }

  function show(focusSearch: boolean, last = false) {
    setQuery('');
    const selectedIndex = choices.findIndex(option => option.value === value);
    setActive(last ? choices.length - 1 : Math.max(0, selectedIndex));
    positionPanel();
    panel.current?.showPopover();
    setOpen(true);
    if (focusSearch) input.current?.focus({ preventScroll: true });
    else trigger.current?.focus({ preventScroll: true });
  }

  function choose(option: SelectOption) {
    onChange(option.value);
    close(true);
  }

  function handleKeys(event: KeyboardEvent<HTMLElement>) {
    if (event.nativeEvent.isComposing) return;
    const isOpen = panel.current?.matches(':popover-open') ?? false;
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      close(true);
    } else if (event.key === 'Tab' && isOpen) {
      // The search input is internal to this field. Continue Tab from the
      // trigger so the next stop is the next field, including Shift+Tab.
      trigger.current?.focus({ preventScroll: true });
      close();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isOpen) show(true, event.key === 'ArrowUp');
      else {
        input.current?.focus({ preventScroll: true });
        setActive(index => filtered.length ? (index + (event.key === 'ArrowDown' ? 1 : -1) + filtered.length) % filtered.length : -1);
      }
    } else if (event.key === 'Enter' && isOpen) {
      event.preventDefault();
      if (filtered[active]) choose(filtered[active]);
    } else if (event.key === 'Home' && isOpen && event.target !== input.current) {
      event.preventDefault();
      setActive(0);
    } else if (event.key === 'End' && isOpen && event.target !== input.current) {
      event.preventDefault();
      setActive(filtered.length - 1);
    }
  }

  useEffect(() => {
    if (!open) return;
    const viewport = window.visualViewport;
    window.addEventListener('resize', positionPanel);
    window.addEventListener('scroll', positionPanel, { capture: true, passive: true });
    viewport?.addEventListener('resize', positionPanel);
    viewport?.addEventListener('scroll', positionPanel);
    return () => {
      window.removeEventListener('resize', positionPanel);
      window.removeEventListener('scroll', positionPanel, true);
      viewport?.removeEventListener('resize', positionPanel);
      viewport?.removeEventListener('scroll', positionPanel);
    };
  }, [open]);

  useEffect(() => {
    if (open && activeId) document.getElementById(activeId)?.scrollIntoView({ block: 'nearest' });
  }, [open, activeId, query]);

  return <div className={styles.field} onKeyDown={handleKeys}>
    <label id={`${id}-label`} htmlFor={id} className={hideLabel ? 'sr-only' : styles.label}>{label}</label>
    <button ref={trigger} id={id} type="button" className={styles.trigger} disabled={disabled}
      aria-labelledby={`${id}-label ${id}-value`} aria-describedby={describedBy}
      popoverTarget={`${id}-panel`} aria-haspopup="dialog" aria-expanded={open} aria-controls={`${id}-panel`}
      onClick={event => { event.preventDefault(); if (panel.current?.matches(':popover-open')) close(); else show(event.detail === 0 || !window.matchMedia('(pointer: coarse)').matches); }}>
      <>{icon === "service" ? <ServiceIcon serviceIds={value ? [value] : []} /> : <Icon name={icon} />}</><span id={`${id}-value`} className={styles.value}>{selected.label}</span><Icon name="chevron" className={styles.chevron} />
    </button>
    <div ref={panel} id={`${id}-panel`} popover="auto" role="dialog" aria-label={`Alege: ${label}`} className={styles.panel}
      onToggle={event => setOpen(event.currentTarget.matches(':popover-open'))}>
      <div className={styles.search}>
        <Icon name="search" />
        <input ref={input} type="text" role="combobox" aria-label={searchPlaceholder.replace('…', '')}
          aria-expanded={open} aria-controls={listId} aria-autocomplete="list" aria-activedescendant={activeId}
          placeholder={searchPlaceholder} autoComplete="off" spellCheck={false} enterKeyHint="done" value={query}
          onChange={event => { setQuery(event.target.value); setActive(0); }} />
      </div>
      <div className={styles.options} role="listbox" aria-label={label} id={listId}>
        {filtered.map((option, index) => <div key={option.value} id={`${id}-option-${index}`} role="option"
          data-value={option.value} aria-selected={option.value === value} className={styles.option} data-active={index === active}
          onPointerMove={event => { if (event.pointerType === 'mouse') setActive(index); }}
          onMouseDown={event => event.preventDefault()} onClick={() => choose(option)}>
          {icon === "service" && option.value ? <ServiceIcon serviceIds={[option.value]} /> : null}<span>{option.label}</span>{option.value === value ? <Icon name="check" /> : null}
        </div>)}
      </div>
      {!filtered.length ? <p className={styles.empty} role="status">Niciun rezultat</p> : null}
    </div>
  </div>;
}
