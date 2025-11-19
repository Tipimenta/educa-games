import 'react-day-picker/dist/style.css';

import * as Popover from '@radix-ui/react-popover';
import { ptBR } from 'date-fns/locale';
import { useMemo, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';

export default function DatePicker({ value = '', onChange, error = false, className = '' }) {
  const parseISO = (str) => {
    if (!str) return undefined;
    const [y, m, d] = str.split('-').map((n) => parseInt(n, 10));
    if (!y || !m || !d) return undefined;
    return new Date(y, m - 1, d);
  };

  const toISO = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const minDate = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 120);
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const selected = parseISO(value);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);

  const base = 'w-full rounded-lg border px-4 py-3 transition focus:ring-2 focus:outline-none';
  const border = error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500';

  return (
    <div className={`relative ${className}`}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className={`${base} ${border} pr-10 flex items-center justify-between bg-white`}
            ref={buttonRef}
          >
            <span>{selected ? selected.toLocaleDateString('pt-BR') : 'Selecione uma data'}</span>
            <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z" />
            </svg>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
              side="bottom"
              align="start"
              sideOffset={8}
              avoidCollisions={true}
              className="z-[1000] w-[22rem] rounded-lg border border-gray-200 bg-white p-3 shadow-lg"
            >
              <DayPicker
                mode="single"
                selected={selected}
                onSelect={(date) => {
                  if (!date) return;
                  onChange?.(toISO(date));
                  setOpen(false);
                }}
                captionLayout="dropdown"
                navLayout="after"
                fromYear={minDate.getFullYear()}
                toYear={today.getFullYear()}
                fromDate={minDate}
                toDate={today}
                locale={ptBR}
                className="rounded-md"
                styles={{
                  month_caption: { display: 'flex', justifyContent: 'flex-start', gap: '0.5rem' },
                  dropdown: { fontSize: '0.875rem', textAlign: 'center', textAlignLast: 'center' },
                  caption_label: { fontSize: '0.875rem' },
                }}
              />
            <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
              <button
                type="button"
                className="rounded px-2 py-1 hover:bg-gray-100"
                onClick={() => {
                  onChange?.(toISO(today));
                  setOpen(false);
                }}
              >
                Hoje
              </button>
              <button
                type="button"
                className="rounded px-2 py-1 hover:bg-gray-100"
                onClick={() => {
                  onChange?.('');
                  setOpen(false);
                }}
              >
                Limpar
              </button>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
