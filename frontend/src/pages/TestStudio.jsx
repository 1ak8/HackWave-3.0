import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  Layers, 
  Play, 
  Check
} from 'lucide-react';
import { useTests } from '../context/TestContext';
import apiClient from '../api/apiClient';

export default function TestStudio() {
  const { tests, refreshAll, triggerRun } = useTests();

  const [title, setTitle] = useState('');
  const [intent, setIntent] = useState('');
  const [targetUrl, setTargetUrl] = useState('http://localhost:5173/demo-store');
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
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-8">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-apple-blue" />
            <span className="text-xs font-mono text-apple-blue uppercase font-bold tracking-wider">
              Intent-to-Test Studio
            </span>
          </div>
          <h1 className="text-2xl font-bold text-apple-text mt-1 tracking-tight">Author Test Specifications</h1>
          <p className="text-xs text-apple-secondary">
            Define high-level user outcomes. Selectors are treated as dynamic baselines that auto-heal if modified.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Test Creator Form */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-2xl border border-black/[0.06] rounded-3xl p-6 sm:p-8 shadow-apple-card space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-apple-text mb-1.5">Suite Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. VIP Subscription Checkout Flow"
                  className="w-full bg-white border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-apple-text focus:outline-none focus:border-apple-blue shadow-apple-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-apple-text mb-1.5">Target Endpoint *</label>
                <input
                  type="url"
                  required
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="http://localhost:5173/demo-store"
                  className="w-full bg-white border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-apple-text focus:outline-none focus:border-apple-blue font-mono shadow-apple-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-apple-text mb-1.5">
                Primary Goal / Business Intent *
              </label>
              <textarea
                rows={2}
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                placeholder="Describe user outcome: Complete purchase of hardware package with standard shipping and payment confirmation"
                className="w-full bg-white border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-apple-text focus:outline-none focus:border-apple-blue shadow-apple-sm"
              />
            </div>

            {/* Steps Definition Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-apple-text uppercase font-mono">
                  Execution Steps ({steps.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="flex items-center gap-1 text-xs text-apple-blue hover:text-apple-blue-hover font-semibold active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Step
                </button>
              </div>

              <div className="space-y-3">
                {steps.map((st, idx) => (
                  <div key={idx} className="p-4 bg-black/[0.02] border border-black/[0.04] rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-white text-[10px] font-mono font-bold flex items-center justify-center text-apple-secondary border border-black/[0.06] shadow-apple-sm">
                          {st.order}
                        </span>
                        <input
                          type="text"
                          value={st.name}
                          onChange={(e) => handleStepChange(idx, 'name', e.target.value)}
                          placeholder="Step Name"
                          className="bg-transparent border-b border-black/[0.1] text-xs font-bold text-apple-text focus:outline-none focus:border-apple-blue px-1 py-0.5"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={st.action}
                          onChange={(e) => handleStepChange(idx, 'action', e.target.value)}
                          className="bg-white text-[11px] font-mono text-apple-text border border-black/[0.08] rounded-lg px-2 py-1 font-semibold shadow-apple-sm"
                        >
                          <option value="click">click</option>
                          <option value="fill">fill</option>
                          <option value="assert">assert</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(idx)}
                          className="text-apple-secondary hover:text-apple-red transition p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[10px] font-mono text-apple-tertiary block mb-0.5 font-medium">Step Intent</label>
                        <input
                          type="text"
                          value={st.intent}
                          onChange={(e) => handleStepChange(idx, 'intent', e.target.value)}
                          placeholder="What does this step achieve?"
                          className="w-full bg-white border border-black/[0.06] rounded-xl px-2.5 py-1.5 text-xs text-apple-text shadow-apple-sm"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-apple-tertiary block mb-0.5 font-medium">Baseline Selector</label>
                        <input
                          type="text"
                          value={st.selector}
                          onChange={(e) => handleStepChange(idx, 'selector', e.target.value)}
                          placeholder="#btn-id or .class"
                          className="w-full bg-white border border-black/[0.06] rounded-xl px-2.5 py-1.5 text-xs font-mono text-apple-blue font-bold shadow-apple-sm"
                        />
                      </div>
                    </div>

                    {st.action === 'fill' && (
                      <div>
                        <label className="text-[10px] font-mono text-apple-tertiary block mb-0.5 font-medium">Input Text Value</label>
                        <input
                          type="text"
                          value={st.value}
                          onChange={(e) => handleStepChange(idx, 'value', e.target.value)}
                          placeholder="Text to type"
                          className="w-full bg-white border border-black/[0.06] rounded-xl px-2.5 py-1.5 text-xs text-apple-text font-mono shadow-apple-sm"
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
              className="w-full py-3 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white font-semibold text-xs flex items-center justify-center gap-2 transition shadow-sm active:scale-[0.98] disabled:opacity-50"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
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
        <div className="bg-white/80 backdrop-blur-2xl border border-black/[0.06] rounded-3xl p-6 shadow-apple-card space-y-4">
          <h3 className="text-xs font-bold text-apple-text uppercase font-mono tracking-tight">
            Configured Suites ({tests.length})
          </h3>

          <div className="space-y-3">
            {tests.map((t) => (
              <div
                key={t._id}
                className="p-4 bg-black/[0.02] border border-black/[0.04] rounded-2xl hover:border-apple-blue/30 transition space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-apple-text group-hover:text-apple-blue transition">
                    {t.title}
                  </h4>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-apple-blue/10 text-apple-blue">
                    {t.steps?.length || 0} steps
                  </span>
                </div>
                <p className="text-[11px] text-apple-secondary line-clamp-2">{t.intent || t.description}</p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-apple-tertiary truncate max-w-[140px]">
                    {t.targetUrl}
                  </span>
                  <button
                    onClick={() => triggerRun(t._id, 'mutated', true)}
                    className="flex items-center gap-1 text-[11px] font-bold text-apple-blue hover:text-apple-blue-hover active:scale-95"
                  >
                    <span>Run</span>
                    <Play className="w-3 h-3 fill-current" />
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
