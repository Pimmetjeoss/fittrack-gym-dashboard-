'use client';

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { TitleBar } from '@/features/dashboard/TitleBar';

export default function TrainingPage() {
  const { id } = useParams();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', daysPerWeek: '3' });
  const [saving, setSaving] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null);
  const [dayForm, setDayForm] = useState({ dayNumber: '1', name: '' });
  const [exerciseForm, setExerciseForm] = useState({ name: '', sets: '3', reps: '10', weight: '' });

  const load = useCallback(() => {
    fetch(`/api/gym/members/${id}/training`)
      .then(res => res.json())
      .then((data) => {
        setPlans(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/gym/members/${id}/training`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, description: form.description || undefined, daysPerWeek: Number(form.daysPerWeek) }),
    });
    if (res.ok) {
      setForm({ name: '', description: '', daysPerWeek: '3' });
      setShowForm(false);
      load();
    }
    setSaving(false);
  };

  const handleAddDay = async (planId: number) => {
    const res = await fetch(`/api/gym/training/${planId}/days`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dayNumber: Number(dayForm.dayNumber), name: dayForm.name }),
    });
    if (res.ok) {
      setDayForm({ dayNumber: '1', name: '' });
      load();
    }
  };

  const handleAddExercise = async (dayId: number) => {
    const res = await fetch(`/api/gym/training/days/${dayId}/exercises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: exerciseForm.name, sets: Number(exerciseForm.sets), reps: exerciseForm.reps, weight: exerciseForm.weight || undefined }),
    });
    if (res.ok) {
      setExerciseForm({ name: '', sets: '3', reps: '10', weight: '' });
      load();
    }
  };

  const handlePlanToggle = (planId: number) => {
    setExpandedPlan(expandedPlan === planId ? null : planId);
  };

  const handlePlanKeyDown = (e: React.KeyboardEvent, planId: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePlanToggle(planId);
    }
  };

  return (
    <>
      <TitleBar title="Training Plans" description="Manage workout schedules" />

      <div className="mb-4">
        <button type="button" onClick={() => setShowForm(!showForm)} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
          {showForm ? 'Cancel' : '+ Add Plan'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreatePlan} className="mb-6 rounded-md bg-card p-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="training-name" className="mb-1 block text-sm font-medium">Plan Name *</label>
              <input id="training-name" type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label htmlFor="training-description" className="mb-1 block text-sm font-medium">Description</label>
              <input id="training-description" type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label htmlFor="training-daysPerWeek" className="mb-1 block text-sm font-medium">Days/Week</label>
              <input id="training-daysPerWeek" type="number" min="1" max="7" value={form.daysPerWeek} onChange={e => setForm({ ...form, daysPerWeek: e.target.value })} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
            </div>
          </div>
          <button type="submit" disabled={saving} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Plan'}
          </button>
        </form>
      )}

      {loading
        ? <p className="text-muted-foreground">Loading...</p>
        : plans.length === 0
          ? <p className="text-muted-foreground">No training plans yet.</p>
          : (
              <div className="space-y-4">
                {plans.map(plan => (
                  <div key={plan.id} className="rounded-md bg-card p-5">
                    <div
                      role="button"
                      tabIndex={0}
                      className="flex cursor-pointer items-center justify-between"
                      onClick={() => handlePlanToggle(plan.id)}
                      onKeyDown={e => handlePlanKeyDown(e, plan.id)}
                    >
                      <div>
                        <div className="text-lg font-semibold">{plan.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {plan.daysPerWeek}
                          {' '}
                          days/week ·
                          {' '}
                          {plan.days?.length ?? 0}
                          {' '}
                          days configured
                        </div>
                      </div>
                      <span className={`text-sm ${plan.isActive ? 'text-green-600' : 'text-red-500'}`}>{plan.isActive ? 'Active' : 'Inactive'}</span>
                    </div>

                    {expandedPlan === plan.id && (
                      <div className="mt-4 space-y-4 border-t pt-4">
                        {plan.days?.map((day: any) => (
                          <div key={day.id} className="rounded border p-3">
                            <div className="mb-2 font-medium">
                              Day
                              {day.dayNumber}
                              :
                              {day.name}
                            </div>
                            {day.exercises?.length > 0
                              ? (
                                  <table className="mb-2 w-full text-sm">
                                    <thead>
                                      <tr className="text-left text-muted-foreground">
                                        <th className="pb-1">Exercise</th>
                                        <th className="pb-1">Sets</th>
                                        <th className="pb-1">Reps</th>
                                        <th className="pb-1">Weight</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {day.exercises.map((ex: any) => (
                                        <tr key={ex.id}>
                                          <td className="py-1">{ex.name}</td>
                                          <td className="py-1">{ex.sets}</td>
                                          <td className="py-1">{ex.reps}</td>
                                          <td className="py-1">{ex.weight ? `${ex.weight} kg` : '-'}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                )
                              : <p className="mb-2 text-sm text-muted-foreground">No exercises yet.</p>}
                            <div className="flex gap-2">
                              <input type="text" placeholder="Exercise" value={exerciseForm.name} onChange={e => setExerciseForm({ ...exerciseForm, name: e.target.value })} className="rounded-md border bg-background px-2 py-1 text-sm" />
                              <input type="number" placeholder="Sets" value={exerciseForm.sets} onChange={e => setExerciseForm({ ...exerciseForm, sets: e.target.value })} className="w-14 rounded-md border bg-background px-2 py-1 text-sm" />
                              <input type="text" placeholder="Reps" value={exerciseForm.reps} onChange={e => setExerciseForm({ ...exerciseForm, reps: e.target.value })} className="w-14 rounded-md border bg-background px-2 py-1 text-sm" />
                              <input type="number" step="0.5" placeholder="kg" value={exerciseForm.weight} onChange={e => setExerciseForm({ ...exerciseForm, weight: e.target.value })} className="w-16 rounded-md border bg-background px-2 py-1 text-sm" />
                              <button type="button" onClick={() => handleAddExercise(day.id)} disabled={!exerciseForm.name} className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground disabled:opacity-50">+</button>
                            </div>
                          </div>
                        ))}

                        <div className="flex gap-2">
                          <input type="number" min="1" placeholder="#" value={dayForm.dayNumber} onChange={e => setDayForm({ ...dayForm, dayNumber: e.target.value })} className="w-14 rounded-md border bg-background px-2 py-1 text-sm" />
                          <input type="text" placeholder="Day name (e.g. Chest & Triceps)" value={dayForm.name} onChange={e => setDayForm({ ...dayForm, name: e.target.value })} className="rounded-md border bg-background px-2 py-1 text-sm" />
                          <button type="button" onClick={() => handleAddDay(plan.id)} disabled={!dayForm.name} className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground disabled:opacity-50">Add Day</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
    </>
  );
}
