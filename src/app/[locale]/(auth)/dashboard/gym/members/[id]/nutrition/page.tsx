'use client';

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { TitleBar } from '@/features/dashboard/TitleBar';

export default function NutritionPage() {
  const { id } = useParams();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', calories: '', protein: '', carbs: '', fat: '' });
  const [saving, setSaving] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null);
  const [mealForm, setMealForm] = useState({ name: '', time: '', calories: '', protein: '', carbs: '', fat: '' });

  const load = useCallback(() => {
    fetch(`/api/gym/members/${id}/nutrition`)
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
    const res = await fetch(`/api/gym/members/${id}/nutrition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        description: form.description || undefined,
        calories: form.calories ? Number(form.calories) : undefined,
        protein: form.protein ? Number(form.protein) : undefined,
        carbs: form.carbs ? Number(form.carbs) : undefined,
        fat: form.fat ? Number(form.fat) : undefined,
      }),
    });
    if (res.ok) {
      setForm({ name: '', description: '', calories: '', protein: '', carbs: '', fat: '' });
      setShowForm(false);
      load();
    }
    setSaving(false);
  };

  const handleAddMeal = async (planId: number) => {
    const res = await fetch(`/api/gym/nutrition/${planId}/meals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: mealForm.name,
        time: mealForm.time || undefined,
        calories: mealForm.calories ? Number(mealForm.calories) : undefined,
        protein: mealForm.protein ? Number(mealForm.protein) : undefined,
        carbs: mealForm.carbs ? Number(mealForm.carbs) : undefined,
        fat: mealForm.fat ? Number(mealForm.fat) : undefined,
      }),
    });
    if (res.ok) {
      setMealForm({ name: '', time: '', calories: '', protein: '', carbs: '', fat: '' });
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
      <TitleBar title="Nutrition Plans" description="Manage meal plans and macros" />

      <div className="mb-4">
        <button type="button" onClick={() => setShowForm(!showForm)} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
          {showForm ? 'Cancel' : '+ Add Plan'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreatePlan} className="mb-6 rounded-md bg-card p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="nutrition-name" className="mb-1 block text-sm font-medium">Plan Name *</label>
              <input id="nutrition-name" type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label htmlFor="nutrition-description" className="mb-1 block text-sm font-medium">Description</label>
              <input id="nutrition-description" type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label htmlFor="nutrition-calories" className="mb-1 block text-sm font-medium">Calories</label>
              <input id="nutrition-calories" type="number" value={form.calories} onChange={e => setForm({ ...form, calories: e.target.value })} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label htmlFor="nutrition-protein" className="mb-1 block text-sm font-medium">Protein (g)</label>
              <input id="nutrition-protein" type="number" value={form.protein} onChange={e => setForm({ ...form, protein: e.target.value })} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label htmlFor="nutrition-carbs" className="mb-1 block text-sm font-medium">Carbs (g)</label>
              <input id="nutrition-carbs" type="number" value={form.carbs} onChange={e => setForm({ ...form, carbs: e.target.value })} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label htmlFor="nutrition-fat" className="mb-1 block text-sm font-medium">Fat (g)</label>
              <input id="nutrition-fat" type="number" value={form.fat} onChange={e => setForm({ ...form, fat: e.target.value })} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
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
          ? <p className="text-muted-foreground">No nutrition plans yet.</p>
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
                          {plan.calories ? `${plan.calories} kcal` : ''}
                          {' '}
                          {plan.protein ? `P: ${plan.protein}g` : ''}
                          {' '}
                          {plan.carbs ? `C: ${plan.carbs}g` : ''}
                          {' '}
                          {plan.fat ? `F: ${plan.fat}g` : ''}
                        </div>
                      </div>
                      <span className={`text-sm ${plan.isActive ? 'text-green-600' : 'text-red-500'}`}>{plan.isActive ? 'Active' : 'Inactive'}</span>
                    </div>

                    {expandedPlan === plan.id && (
                      <div className="mt-4 border-t pt-4">
                        <div className="mb-2 font-medium">Meals</div>
                        {plan.meals?.length > 0
                          ? (
                              <table className="mb-4 w-full text-sm">
                                <thead>
                                  <tr className="border-b text-left text-muted-foreground">
                                    <th className="pb-1">Meal</th>
                                    <th className="pb-1">Time</th>
                                    <th className="pb-1">Kcal</th>
                                    <th className="pb-1">P</th>
                                    <th className="pb-1">C</th>
                                    <th className="pb-1">F</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {plan.meals.map((meal: any) => (
                                    <tr key={meal.id} className="border-b">
                                      <td className="py-1">{meal.name}</td>
                                      <td className="py-1">{meal.time || '-'}</td>
                                      <td className="py-1">{meal.calories || '-'}</td>
                                      <td className="py-1">{meal.protein || '-'}</td>
                                      <td className="py-1">{meal.carbs || '-'}</td>
                                      <td className="py-1">{meal.fat || '-'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )
                          : <p className="mb-4 text-sm text-muted-foreground">No meals yet.</p>}

                        <div className="flex gap-2">
                          <input type="text" placeholder="Meal name" value={mealForm.name} onChange={e => setMealForm({ ...mealForm, name: e.target.value })} className="rounded-md border bg-background px-2 py-1 text-sm" />
                          <input type="text" placeholder="Time" value={mealForm.time} onChange={e => setMealForm({ ...mealForm, time: e.target.value })} className="w-20 rounded-md border bg-background px-2 py-1 text-sm" />
                          <input type="number" placeholder="Kcal" value={mealForm.calories} onChange={e => setMealForm({ ...mealForm, calories: e.target.value })} className="w-16 rounded-md border bg-background px-2 py-1 text-sm" />
                          <button type="button" onClick={() => handleAddMeal(plan.id)} disabled={!mealForm.name} className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground disabled:opacity-50">Add</button>
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
