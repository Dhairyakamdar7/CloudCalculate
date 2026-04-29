const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock pricing data based on general industry averages for simulation
const pricingData = {
  AWS: {
    storage: {
      rate: 0.023, // per GB per month
      unit: 'GB',
    },
    compute: {
      rate: 0.0416, // per hour (e.g., t3.medium)
      unit: 'hour',
    },
    transfer: {
      rate: 0.09, // per GB outbound
      unit: 'GB',
    }
  },
  Azure: {
    storage: {
      rate: 0.0208,
      unit: 'GB',
    },
    compute: {
      rate: 0.0410, // e.g., B2s
      unit: 'hour',
    },
    transfer: {
      rate: 0.087,
      unit: 'GB',
    }
  },
  GCP: {
    storage: {
      rate: 0.020,
      unit: 'GB',
    },
    compute: {
      rate: 0.0336, // e.g., e2-medium
      unit: 'hour',
    },
    transfer: {
      rate: 0.085,
      unit: 'GB',
    }
  }
};

app.get('/api/pricing', (req, res) => {
  res.json(pricingData);
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
