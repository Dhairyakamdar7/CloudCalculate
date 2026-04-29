export const pricingData = {
  AWS: {
    storage: { rate: 0.023, unit: 'GB' },
    compute: { rate: 0.0416, unit: 'hour' },
    transfer: { rate: 0.09, unit: 'GB' }
  },
  Azure: {
    storage: { rate: 0.0208, unit: 'GB' },
    compute: { rate: 0.0410, unit: 'hour' },
    transfer: { rate: 0.087, unit: 'GB' }
  },
  GCP: {
    storage: { rate: 0.020, unit: 'GB' },
    compute: { rate: 0.0336, unit: 'hour' },
    transfer: { rate: 0.085, unit: 'GB' }
  }
};
