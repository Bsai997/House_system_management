// House color configurations
export const HOUSE_COLORS = {
  Jal: {
    primary: '#3B82F6',
    light: '#DBEAFE',
    dark: '#1E40AF',
    gradient: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-500',
    ring: 'ring-blue-500',
  },
  Vayu: {
    primary: '#8B5CF6',
    light: '#EDE9FE',
    dark: '#5B21B6',
    gradient: 'from-purple-500 to-purple-700',
    bg: 'bg-purple-500',
    bgLight: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-500',
    ring: 'ring-purple-500',
  },
  Agni: {
    primary: '#EF4444',
    light: '#FEE2E2',
    dark: '#991B1B',
    gradient: 'from-red-500 to-red-700',
    bg: 'bg-red-500',
    bgLight: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-500',
    ring: 'ring-red-500',
  },
  Akash: {
    primary: '#F59E0B',
    light: '#FEF3C7',
    dark: '#92400E',
    gradient: 'from-amber-500 to-amber-700',
    bg: 'bg-amber-500',
    bgLight: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-500',
    ring: 'ring-amber-500',
  },
  Prudhvi: {
    primary: '#22C55E',
    light: '#DCFCE7',
    dark: '#166534',
    gradient: 'from-green-500 to-green-700',
    bg: 'bg-green-500',
    bgLight: 'bg-green-50',
    text: 'text-green-600',
    border: 'border-green-500',
    ring: 'ring-green-500',
  },
};

export const HOUSE_LOGOS = {
  Jal: '/jal-logo.png',
  Vayu: '🌬️',
  Agni: '/agni-logo.png',
  Akash: '/akash-logo.png',
  Prudhvi: '🌍',
};

export const getHouseColor = (houseName) => {
  return HOUSE_COLORS[houseName] || HOUSE_COLORS.Jal;
};

export const getHouseLogo = (houseName) => {
  return HOUSE_LOGOS[houseName] || '🏠';
};

export const isImageLogo = (houseName) => {
  const logo = HOUSE_LOGOS[houseName];
  return logo && (logo.startsWith('/') || logo.startsWith('http'));
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800',
    published: 'bg-green-100 text-green-800',
    closed: 'bg-gray-200 text-gray-700',
  };
  const labels = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    published: 'Ongoing',
    closed: 'Completed',
  };
  return { color: colors[status] || 'bg-gray-100 text-gray-800', label: labels[status] || status };
};
