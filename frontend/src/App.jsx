import { useState, useEffect } from 'react';
import axios from 'axios';
import { Cloud, Database, Cpu, Activity, Server, ArrowRightLeft } from 'lucide-react';

function App() {
  const [pricing, setPricing] = useState(null);
  const [provider, setProvider] = useState('AWS');
  const [loading, setLoading] = useState(true);
  
  // Slider states
  const [storage, setStorage] = useState(500); // GB
  const [compute, setCompute] = useState(730); // Hours
  const [transfer, setTransfer] = useState(100); // GB

  useEffect(() => {
    // Fetch pricing data from backend
    axios.get('/api/pricing')
      .then(res => {
        setPricing(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching pricing, using fallbacks", err);
        // Fallback for demo purposes if backend isn't running
        setPricing({
          AWS: { storage: { rate: 0.023 }, compute: { rate: 0.0416 }, transfer: { rate: 0.09 } },
          Azure: { storage: { rate: 0.0208 }, compute: { rate: 0.0410 }, transfer: { rate: 0.087 } },
          GCP: { storage: { rate: 0.020 }, compute: { rate: 0.0336 }, transfer: { rate: 0.085 } }
        });
        setLoading(false);
      });
  }, []);

  if (loading || !pricing) {
    return <div className="spinner"></div>;
  }

  const currentPricing = pricing[provider];
  
  // Calculations
  const storageCost = storage * currentPricing.storage.rate;
  const computeCost = compute * currentPricing.compute.rate;
  const transferCost = transfer * currentPricing.transfer.rate;
  const totalCost = storageCost + computeCost + transferCost;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  const getSliderClass = () => `slider-${provider.toLowerCase()}`;

  return (
    <div className="container">
      <header className="header">
        <h1>Cloud Cost Calculator</h1>
        <p>Simulate real-world cloud infrastructure costs across AWS, Azure, and GCP. Understand storage, compute, and data transfer pricing instantly.</p>
      </header>

      <div className="calculator-grid">
        <div className="card">
          <div className="provider-tabs">
            {['AWS', 'Azure', 'GCP'].map(p => (
              <button 
                key={p}
                className={`tab ${provider === p ? 'active' : ''}`}
                data-provider={p}
                onClick={() => setProvider(p)}
              >
                <Cloud size={18} /> {p}
              </button>
            ))}
          </div>

          <div className="input-group">
            <div className="input-header">
              <span className="input-label"><Database size={18} color="#94A3B8"/> Storage</span>
              <span className="input-value">{storage} GB</span>
            </div>
            <input 
              type="range" 
              className={getSliderClass()}
              min="0" max="5000" step="10"
              value={storage} 
              onChange={(e) => setStorage(Number(e.target.value))} 
            />
          </div>

          <div className="input-group">
            <div className="input-header">
              <span className="input-label"><Cpu size={18} color="#94A3B8"/> Compute</span>
              <span className="input-value">{compute} Hrs</span>
            </div>
            <input 
              type="range" 
              className={getSliderClass()}
              min="0" max="730" step="1"
              value={compute} 
              onChange={(e) => setCompute(Number(e.target.value))} 
            />
            <div style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem'}}>
              (730 hours roughly equals 1 month of 24/7 uptime)
            </div>
          </div>

          <div className="input-group">
            <div className="input-header">
              <span className="input-label"><ArrowRightLeft size={18} color="#94A3B8"/> Data Transfer (Out)</span>
              <span className="input-value">{transfer} GB</span>
            </div>
            <input 
              type="range" 
              className={getSliderClass()}
              min="0" max="2000" step="10"
              value={transfer} 
              onChange={(e) => setTransfer(Number(e.target.value))} 
            />
          </div>
        </div>

        <div className="card summary-panel">
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
            <Server size={20} color="var(--text-primary)" />
            <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>Cost Breakdown</h2>
          </div>
          
          <div className="formula-list">
            <div className="formula-item">
              <span className="formula-label">Storage</span>
              <span className="formula-math">{storage} × ${currentPricing.storage.rate.toFixed(4)}</span>
              <span className="formula-result">{formatCurrency(storageCost)}</span>
            </div>
            <div className="formula-item">
              <span className="formula-label">Compute</span>
              <span className="formula-math">{compute} × ${currentPricing.compute.rate.toFixed(4)}</span>
              <span className="formula-result">{formatCurrency(computeCost)}</span>
            </div>
            <div className="formula-item">
              <span className="formula-label">Transfer</span>
              <span className="formula-math">{transfer} × ${currentPricing.transfer.rate.toFixed(4)}</span>
              <span className="formula-result">{formatCurrency(transferCost)}</span>
            </div>
          </div>

          <div className="cost-display">
            <div className="cost-title">Estimated Monthly Cost</div>
            <div className="cost-amount">
              {formatCurrency(totalCost).split('.')[0]}
              <span>.{formatCurrency(totalCost).split('.')[1]}</span>
            </div>
          </div>
          
          <div style={{textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem'}}>
            <Activity size={14} style={{display: 'inline', verticalAlign: 'middle', marginRight: '4px'}}/>
            Prices are estimates and may vary by region
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
