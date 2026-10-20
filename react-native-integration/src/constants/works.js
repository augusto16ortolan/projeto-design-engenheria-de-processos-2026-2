export const WORK_TYPES = [
  { value: "movie", label: "Filme" },
  { value: "series", label: "Série" },
];

export const WORK_STATUSES = [
  { value: "want_to_watch", label: "Quero assistir", icon: "bookmark-outline" },
  { value: "watching", label: "Assistindo", icon: "play-circle-outline" },
  { value: "watched", label: "Assistido", icon: "check-circle-outline" },
];

export function workTypeLabel(type) {
  return WORK_TYPES.find((item) => item.value === type)?.label || "Obra";
}

export function workStatusLabel(status) {
  return WORK_STATUSES.find((item) => item.value === status)?.label || "Sem status";
}

export function workStatusIcon(status) {
  return WORK_STATUSES.find((item) => item.value === status)?.icon;
}
