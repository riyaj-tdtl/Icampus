import Swal from 'sweetalert2';

// Base configuration to match the premium purple SaaS theme
const baseConfig = {
  background: '#ffffff',
  color: '#0f172a',
  confirmButtonColor: '#8456f1',
  cancelButtonColor: '#94a3b8',
  customClass: {
    popup: 'swal2-premium-popup',
    title: 'swal2-premium-title',
    confirmButton: 'swal2-premium-confirm',
    cancelButton: 'swal2-premium-cancel'
  }
};

export const showSuccess = (title, text = '') => {
  return Swal.fire({
    ...baseConfig,
    title,
    text,
    icon: 'success',
    confirmButtonText: 'Done',
  });
};

export const showError = (title, text = '') => {
  return Swal.fire({
    ...baseConfig,
    title,
    text,
    icon: 'error',
    confirmButtonColor: '#ef4444',
  });
};

export const confirmAction = (title, text, confirmText = 'Yes, proceed!') => {
  return Swal.fire({
    ...baseConfig,
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#8456f1',
    confirmButtonText: confirmText,
  });
};

export const confirmDelete = (title = 'Are you sure?', text = 'You will not be able to recover this record!') => {
  return Swal.fire({
    ...baseConfig,
    title,
    text,
    icon: 'error',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'Yes, delete it!',
  });
};

export const confirmLogout = (title = 'Logout?', text = 'Are you sure you want to end your current session?') => {
  return Swal.fire({
    ...baseConfig,
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'Yes, log out',
  });
};

export const showComplexForm = (title, fields = []) => {
  const getFieldValue = (field) => {
    if (field.value !== undefined && field.value !== null) return field.value;
    return '';
  };

  const html = `
    <form autocomplete="off" style="display: flex; flex-direction: column; gap: 20px; text-align: left; padding: 10px 5px;">
      <input type="text" name="hidden-username" autocomplete="off" style="display:none" />
      <input type="password" name="hidden-password" autocomplete="new-password" style="display:none" />
      ${fields.map(field => `
        <div style="width: 100%;">
          <label style="display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 8px; font-family: 'Outfit', sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">${field.label}</label>
          ${field.type === 'textarea' ? `
            <textarea 
              id="swal-input-${field.id}" 
              name="swal-input-${field.id}"
              autocomplete="off"
              placeholder="${field.placeholder || ''}" 
              style="width: 100%; height: 120px; border-radius: 12px; border: 1px solid #e2e8f0; padding: 12px 16px; font-size: 15px; font-family: 'Inter', sans-serif; transition: all 0.2s; background: #f8fafc; resize: none;"
              onfocus="this.style.borderColor='#8456f1'; this.style.backgroundColor='#ffffff'; this.style.boxShadow='0 0 0 4px rgba(132, 86, 241, 0.1)'"
              onblur="this.style.borderColor='#e2e8f0'; this.style.backgroundColor='#f8fafc'; this.style.boxShadow='none'"
            >${getFieldValue(field)}</textarea>
          ` : field.type === 'select' ? `
            <select
              id="swal-input-${field.id}"
              name="swal-input-${field.id}"
              autocomplete="off"
              style="width: 100%; height: 50px; border-radius: 12px; border: 1px solid #e2e8f0; padding: 0 16px; font-size: 15px; font-family: 'Inter', sans-serif; transition: all 0.2s; background: #f8fafc;"
              onfocus="this.style.borderColor='#8456f1'; this.style.backgroundColor='#ffffff'; this.style.boxShadow='0 0 0 4px rgba(132, 86, 241, 0.1)'"
              onblur="this.style.borderColor='#e2e8f0'; this.style.backgroundColor='#f8fafc'; this.style.boxShadow='none'"
            >
              ${(field.options || []).map(option => {
                const value = typeof option === 'string' ? option : option.value;
                const label = typeof option === 'string' ? option : option.label;
                return `<option value="${value}" ${String(getFieldValue(field)) === String(value) ? 'selected' : ''}>${label}</option>`;
              }).join('')}
            </select>
          ` : `
            <input 
              id="swal-input-${field.id}" 
              name="swal-input-${field.id}"
              autocomplete="${field.type === 'password' ? 'new-password' : 'off'}"
              type="${field.type || 'text'}" 
              value="${getFieldValue(field)}"
              placeholder="${field.placeholder || ''}" 
              style="width: 100%; height: 50px; border-radius: 12px; border: 1px solid #e2e8f0; padding: 0 16px; font-size: 15px; font-family: 'Inter', sans-serif; transition: all 0.2s; background: #f8fafc;"
              onfocus="this.style.borderColor='#8456f1'; this.style.backgroundColor='#ffffff'; this.style.boxShadow='0 0 0 4px rgba(132, 86, 241, 0.1)'"
              onblur="this.style.borderColor='#e2e8f0'; this.style.backgroundColor='#f8fafc'; this.style.boxShadow='none'"
            >
          `}
        </div>
      `).join('')}
    </form>
  `;

  return Swal.fire({
    ...baseConfig,
    title,
    html,
    width: '500px',
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Save Record',
    preConfirm: () => {
      const results = {};
      let isValid = true;
      fields.forEach(field => {
        const val = document.getElementById(`swal-input-${field.id}`).value;
        if (field.required !== false && !val) isValid = false;
        results[field.id] = val;
      });
      if (!isValid) {
        Swal.showValidationMessage('Please fill in all fields');
        return false;
      }
      return results;
    }
  });
};

// Alias for backward compatibility
export const showFormModal = showComplexForm;

export const showComingSoon = (featureName = 'This feature') => {
  return Swal.fire({
    ...baseConfig,
    title: 'Coming Soon!',
    text: `${featureName} is currently under development and will be available in the next release.`,
    icon: 'info',
    confirmButtonText: 'Got it',
  });
};
