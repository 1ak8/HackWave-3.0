import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  Layers, 
  Sparkles, 
  Play, 
  Check, 
  ArrowRight,
  Code2,
  MousePointer,
  Edit3,
  Search
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">Intent-to-Test Studio</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Author Intent-Driven Test Suites</h1>
          <p className="text-xs text-slate-400">
            Define high-level user outcomes. Selectors are treated as dynamic baselines that auto-heal if modified.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Test Creator Form */}
        <div className="lg:col-span-2 bg-obsidian-900 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Suite Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. VIP Subscription Checkout Flow"
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Target Web Endpoint *</label>
                <input
                  type="url"
                  required
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="http://localhost:5173/demo-store"
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Primary Goal / Business Intent *
              </label>
              <textarea
                rows={2}
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                placeholder="Describe user outcome: Complete purchase of hardware package with standard shipping and payment confirmation"
                className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>

            {/* Steps Definition Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-semibold text-white uppercase">
                  Execution Steps ({steps.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-mono font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Step
                </button>
              </div>

              <div className="space-y-3">
                {steps.map((st, idx) => (
                  <div key={idx} className="p-3.5 bg-obsidian-950 border border-white/5 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-obsidian-800 text-[10px] font-mono font-bold flex items-center justify-center text-slate-300">
                          {st.order}
                        </span>
                        <input
                          type="text"
                          value={st.name}
                          onChange={(e) => handleStepChange(idx, 'name', e.target.value)}
                          placeholder="Step Name"
                          className="bg-transparent border-b border-white/10 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 px-1 py-0.5"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={st.action}
                          onChange={(e) => handleStepChange(idx, 'action', e.target.value)}
                          className="bg-obsidian-850 text-[11px] font-mono text-slate-300 border border-white/10 rounded px-2 py-1"
                        >
                          <option value="click">click</option>
                          <option value="fill">fill</option>
                          <option value="assert">assert</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(idx)}
                          className="text-slate-500 hover:text-red-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[10px] font-mono text-slate-500 block mb-0.5">Step Intent</label>
                        <input
                          type="text"
                          value={st.intent}
                          onChange={(e) => handleStepChange(idx, 'intent', e.target.value)}
                          placeholder="What does this step achieve?"
                          className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-slate-500 block mb-0.5">Baseline Selector</label>
                        <input
                          type="text"
                          value={st.selector}
                          onChange={(e) => handleStepChange(idx, 'selector', e.target.value)}
                          placeholder="#btn-id or .class"
                          className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-emerald-300"
                        />
                      </div>
                    </div>

                    {st.action === 'fill' && (
                      <div>
                        <label className="text-[10px] font-mono text-slate-500 block mb-0.5">Input Text Value</label>
                        <input
                          type="text"
                          value={st.value}
                          onChange={(e) => handleStepChange(idx, 'value', e.target.value)}
                          placeholder="Text to type"
                          className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono"
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
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg disabled:opacity-50"
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
        <div className="bg-obsidian-900 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
            Configured Suites ({tests.length})
          </h3>

          <div className="space-y-3">
            {tests.map((t) => (
              <div
                key={t._id}
                className="p-4 bg-obsidian-950 border border-white/5 rounded-xl hover:border-emerald-500/30 transition space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                    {t.title}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                    {t.steps?.length || 0} steps
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{t.intent || t.description}</p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 truncate max-w-[150px]">
                    {t.targetUrl}
                  </span>
                  <button
                    onClick={() => triggerRun(t._id, 'mutated', true)}
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300"
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
