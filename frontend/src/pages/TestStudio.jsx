import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Save, 
  Layers, 
  Play, 
  Check, 
  Loader2
} from 'lucide-react';
import { useTests } from '../context/TestContext';
import apiClient from '../api/apiClient';

export default function TestStudio() {
  const navigate = useNavigate();
  const { tests, refreshAll, triggerRun } = useTests();
  const [runningSuiteId, setRunningSuiteId] = useState(null);

  const [title, setTitle] = useState('');
  const [intent, setIntent] = useState('');
  const [targetUrl, setTargetUrl] = useState(typeof window !== 'undefined' ? `${window.location.origin}/demo-store` : 'http://localhost:5173/demo-store');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState([
    { order: 1, name: 'Select Product', intent: 'Add headphones to cart', action: 'click', selector: '#btn-add-to-cart', value: '' },
    { order: 2, name: 'View Cart', intent: 'Open shopping cart drawer', action: 'click', selector: '#btn-view-cart', value: '' },
    { order: 3, name: 'Provide Email', intent: 'Fill user email address', action: 'fill', selector: '#input-checkout-email', value: 'lokesh@hackwave.dev' },
    { order: 4, name: 'Authorize Payment', intent: 'Submit order and authorize card', action: 'click', selector: '#btn-complete-order', value: '' }
  ]);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddStep = () => {
    setSteps(prev => [
      ...prev,
      {
        order: prev.length + 1,
        name: `Step ${prev.length + 1}`,
        intent: 'Perform user action',
        action: 'click',
        selector: '#new-element-id',
        value: ''
      }
    ]);
  };

  const handleRemoveStep = (index) => {
    setSteps(prev => prev.filter((_, i) => i !== index).map((s, idx) => ({ ...s, order: idx + 1 })));
  };

  const handleStepChange = (index, field, value) => {
    setSteps(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleRunSuite = async (testId) => {
    setRunningSuiteId(testId);
    try {
      const suite = tests.find(t => t._id === testId);
      const url = suite?.targetUrl && !suite.targetUrl.includes('localhost')
        ? suite.targetUrl
        : `${window.location.origin}/demo-store`;

      await triggerRun(testId, 'mutated', true, { targetUrl: url });
      navigate('/live');
    } catch (err) {
      console.error('Failed to run suite:', err);
      alert('Failed to launch suite: ' + (err.response?.data?.error || err.message));
    } finally {
      setRunningSuiteId(null);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title) return alert('Please enter a test suite title');

    setSaving(true);
    try {
      await apiClient.post('/tests', {
        title,
        intent: intent || title,
        targetUrl,
        description,
        steps,
        tags: ['Custom Intent Suite']
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      refreshAll();
      setTitle('');
      setIntent('');
    } catch (err) {
      alert('Failed to save test suite: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-6 space-y-6">
      {/* Studio Header */}
      <div className="card p-5 sm:p-6 shadow-card">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent" />
          <span className="text-2xs font-mono text-accent uppercase font-semibold tracking-wider">
            Intent-to-Test Studio
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-ink mt-1 tracking-tight">Author Intent Test Suites</h1>
        <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
          Define tests based on user goals rather than static CSS selectors. Selectors act as dynamic baselines that auto-heal if modified by product updates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Test Creator Form */}
        <div className="lg:col-span-2 card p-5 sm:p-6 space-y-5 shadow-card">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Suite Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Premium Checkout Flow"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Target Endpoint *</label>
                <input
                  type="url"
                  required
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="http://localhost:5173/demo-store"
                  className="input input-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Primary User Outcome / Goal *
              </label>
              <textarea
                rows={2}
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                placeholder="Describe user outcome: Complete purchase of hardware package with standard shipping and payment confirmation"
                className="input"
              />
            </div>

            {/* Steps Section */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-xs font-semibold text-ink uppercase font-mono tracking-wider">
                  Execution Steps ({steps.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="btn btn-secondary btn-sm flex items-center gap-1.5 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Step</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {steps.map((st, idx) => (
                  <div key={idx} className="p-3.5 bg-surface border border-border rounded-md space-y-2.5 shadow-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-surface-raised border border-border text-2xs font-mono font-semibold flex items-center justify-center text-ink-secondary">
                          {st.order}
                        </span>
                        <input
                          type="text"
                          value={st.name}
                          onChange={(e) => handleStepChange(idx, 'name', e.target.value)}
                          placeholder="Step Name"
                          className="bg-transparent border-b border-border text-xs sm:text-sm font-semibold text-ink focus:outline-none focus:border-accent px-1 py-0.5"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={st.action}
                          onChange={(e) => handleStepChange(idx, 'action', e.target.value)}
                          className="bg-surface-raised text-2xs font-mono text-ink border border-border rounded px-2 py-1 font-medium shadow-card"
                        >
                          <option value="click">click</option>
                          <option value="fill">fill</option>
                          <option value="assert">assert</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(idx)}
                          className="text-ink-tertiary hover:text-danger transition p-1"
                          title="Remove step"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-2xs font-mono text-ink-secondary block mb-1 font-medium">Step Intent</label>
                        <input
                          type="text"
                          value={st.intent}
                          onChange={(e) => handleStepChange(idx, 'intent', e.target.value)}
                          placeholder="What does this step achieve?"
                          className="input"
                        />
                      </div>

                      <div>
                        <label className="text-2xs font-mono text-ink-secondary block mb-1 font-medium">Baseline Selector</label>
                        <input
                          type="text"
                          value={st.selector}
                          onChange={(e) => handleStepChange(idx, 'selector', e.target.value)}
                          placeholder="#btn-id or .class"
                          className="input input-mono text-accent font-semibold"
                        />
                      </div>
                    </div>

                    {st.action === 'fill' && (
                      <div>
                        <label className="text-2xs font-mono text-ink-secondary block mb-1 font-medium">Input Value</label>
                        <input
                          type="text"
                          value={st.value}
                          onChange={(e) => handleStepChange(idx, 'value', e.target.value)}
                          placeholder="Text to type"
                          className="input input-mono"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary w-full py-2.5 text-xs sm:text-sm font-medium"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Suite Saved Successfully!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Test Suite</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Existing Test Suites List */}
        <div className="card p-5 space-y-3.5 h-fit shadow-card">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="text-xs font-semibold text-ink uppercase font-mono tracking-wider">
              Configured Suites ({tests.length})
            </h3>
          </div>

          <div className="space-y-2.5">
            {tests.map((t) => (
              <div
                key={t._id}
                className="p-3 bg-surface border border-border rounded-md hover:bg-surface-raised transition-colors space-y-2 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-semibold text-ink">
                    {t.title}
                  </h4>
                  <span className="badge badge-neutral text-2xs font-mono">
                    {t.steps?.length || 0} steps
                  </span>
                </div>
                <p className="text-2xs text-ink-secondary line-clamp-2 leading-relaxed">{t.intent || t.description}</p>
                <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-2xs font-mono text-ink-tertiary truncate max-w-[130px]">
                    {t.targetUrl}
                  </span>
                  <button
                    onClick={() => handleRunSuite(t._id)}
                    disabled={runningSuiteId === t._id}
                    className="btn btn-primary btn-xs flex items-center gap-1 font-medium"
                    title="Launch this suite and view live execution in runner"
                  >
                    {runningSuiteId === t._id ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Launching...</span>
                      </>
                    ) : (
                      <>
                        <span>Run & Inspect</span>
                        <Play className="w-2.5 h-2.5 fill-current" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
