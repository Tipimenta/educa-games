import { clsx } from 'clsx';
import { twMerge } from 'tailwind-variants';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Normalização simples para comparar status vindos do backend sem depender de maiúsculas/minúsculas
export function normalizeStatus(status) {
  if (status == null) return '';
  return String(status).trim().toLowerCase();
}

// Comparação de status case-insensitive
export function equalsStatus(a, b) {
  return normalizeStatus(a) === normalizeStatus(b);
}

// Tradução para português dos status comuns e de convites
const STATUS_PT = {
  // Convites
  'não_enviado': 'Não enviado',
  'nao_enviado': 'Não enviado',
  'not_sent': 'Não enviado',
  'aguardando_aceitação': 'Aguardando aceitação',
  'aguardando_aceitacao': 'Aguardando aceitação',
  'awaiting_acceptance': 'Aguardando aceitação',
  'aceitado': 'Aceito',
  'accepted': 'Aceito',
  'expirado': 'Expirado',
  'expired': 'Expirado',

  // Genéricos
  'pending': 'Pendente',
  'pendente': 'Pendente',
  'active': 'Ativo',
  'inactive': 'Inativo',
  'completed': 'Concluído',
  'em_progresso': 'Em progresso',
  'in_progress': 'Em progresso',
  'failed': 'Falhou',
  'success': 'Sucesso',
  'error': 'Erro',
  'canceled': 'Cancelado',
  'cancelled': 'Cancelado',
};

function humanizeStatusLabel(s) {
  if (!s) return 'Indefinido';
  const cleaned = s.replace(/[_-]+/g, ' ');
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export function translateStatus(status) {
  const s = normalizeStatus(status);
  return STATUS_PT[s] ?? humanizeStatusLabel(s);
}
