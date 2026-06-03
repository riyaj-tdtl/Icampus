// Minimal stubs for un-migrated components to prevent build errors
// Since we only got APIs for core modules, we provide empty responses for the rest
// to satisfy "Maintain all existing UI and routing structure".

export const visitorService = { 
  getAll: async () => ({ results: [] }),
  delete: async () => {},
  getById: async () => ({}),
  patch: async () => ({}),
  create: async () => ({})
};

export const transportRouteService = { 
  getAll: async () => ({ results: [] }),
  delete: async () => {},
  getById: async () => ({}),
  patch: async () => ({}),
  create: async () => ({})
};

export const systemService = { 
  getAll: async () => ({ results: [] }),
  delete: async () => {},
  getById: async () => ({}),
  patch: async () => ({}),
  create: async () => ({})
};

export const bookService = { 
  getAll: async () => ({ results: [] }),
  delete: async () => {},
  getById: async () => ({}),
  patch: async () => ({}),
  create: async () => ({})
};

export const employeeProfileService = { 
  getAll: async () => ({ results: [] }),
  delete: async () => {},
  getById: async () => ({}),
  patch: async () => ({}),
  create: async () => ({})
};

export const feePlanService = { 
  getAll: async () => ({ results: [] }),
  delete: async () => {},
  getById: async () => ({}),
  patch: async () => ({}),
  create: async () => ({})
};

export const messageService = { 
  getAll: async () => ({ results: [] }),
  delete: async () => {},
  getById: async () => ({}),
  patch: async () => ({}),
  create: async () => ({})
};

export const admissionApplicationService = { 
  getAll: async () => ({ results: [] }),
  delete: async () => {},
  getById: async () => ({}),
  patch: async () => ({}),
  create: async () => ({})
};
