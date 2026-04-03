'use client';

import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TitleBar } from '@/features/dashboard/TitleBar';

export default function MemberDetailPage() {
  const { id } = useParams();

  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    goal: '',
    height: '',
    notes: '',
  });
  const [savingEdit, setSavingEdit] = useState(false);

  // Weight form state
  const [weightForm, setWeightForm] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    bodyFatPercentage: '',
    notes: '',
  });
  const [savingWeight, setSavingWeight] = useState(false);

  // Nutrition form state
  const [showNutritionForm, setShowNutritionForm] = useState(false);
  const [nutritionForm, setNutritionForm] = useState({
    name: '',
    description: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });
  const [savingNutrition, setSavingNutrition] = useState(false);

  const [expandedNutritionPlan, setExpandedNutritionPlan] = useState<any>(null);
  const [mealForm, setMealForm] = useState({ name: '', time: '', calories: '', protein: '', carbs: '', fat: '' });

  // Training form state
  const [showTrainingForm, setShowTrainingForm] = useState(false);
  const [trainingForm, setTrainingForm] = useState({ name: '', description: '', daysPerWeek: '3' });
  const [savingTraining, setSavingTraining] = useState(false);

  const [expandedTrainingPlan, setExpandedTrainingPlan] = useState<any>(null);
  const [dayForm, setDayForm] = useState({ dayNumber: '1', name: '' });
  const [exerciseForm, setExerciseForm] = useState({ name: '', sets: '3', reps: '10', weight: '' });

  const loadMember = useCallback(() => {
    fetch(`/api/gym/members/${id}`)
      .then(res => res.json())
      .then((data) => {
        setMember(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    loadMember();
  }, [loadMember]);

  // Edit handlers
  const handleStartEdit = () => {
    if (!member) {
      return;
    }
    setEditForm({
      firstName: member.firstName || '',
      lastName: member.lastName || '',
      email: member.email || '',
      phone: member.phone || '',
      goal: member.goal || '',
      height: member.height ? String(member.height) : '',
      notes: member.notes || '',
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEdit(true);
    const res = await fetch(`/api/gym/members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email || undefined,
        phone: editForm.phone || undefined,
        goal: editForm.goal || undefined,
        height: editForm.height ? Number(editForm.height) : undefined,
        notes: editForm.notes || undefined,
      }),
    });
    if (res.ok) {
      setIsEditing(false);
      loadMember();
    }
    setSavingEdit(false);
  };

  // Delete member handler
  const handleDeleteMember = async () => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Are you sure? This will delete all data for this member.')) {
      return;
    }
    const res = await fetch(`/api/gym/members/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      window.location.href = '/dashboard/gym/members';
    }
  };

  // Toggle active/inactive handler
  const handleToggleActive = async () => {
    const res = await fetch(`/api/gym/members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !member.isActive }),
    });
    if (res.ok) {
      loadMember();
    }
  };

  // Delete sub-item handlers
  const handleDeleteWeight = async (entryId: number) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Are you sure you want to delete this weight entry?')) {
      return;
    }
    const res = await fetch(`/api/gym/weight/${entryId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      loadMember();
    }
  };

  const handleDeleteNutritionPlan = async (planId: number) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Are you sure you want to delete this nutrition plan?')) {
      return;
    }
    const res = await fetch(`/api/gym/nutrition/${planId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      loadMember();
    }
  };

  const handleDeleteMeal = async (mealId: number) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Are you sure you want to delete this meal?')) {
      return;
    }
    const res = await fetch(`/api/gym/nutrition/meals/${mealId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      loadMember();
    }
  };

  const handleDeleteTrainingPlan = async (planId: number) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Are you sure you want to delete this training plan?')) {
      return;
    }
    const res = await fetch(`/api/gym/training/${planId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      loadMember();
    }
  };

  const handleDeleteExercise = async (exerciseId: number) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Are you sure you want to delete this exercise?')) {
      return;
    }
    const res = await fetch(`/api/gym/training/exercises/${exerciseId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      loadMember();
    }
  };

  // Weight handlers
  const handleAddWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingWeight(true);
    const res = await fetch(`/api/gym/members/${id}/weight`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(weightForm),
    });
    if (res.ok) {
      setWeightForm({ date: new Date().toISOString().split('T')[0], weight: '', bodyFatPercentage: '', notes: '' });
      loadMember();
    }
    setSavingWeight(false);
  };

  // Nutrition handlers
  const handleCreateNutritionPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingNutrition(true);
    const res = await fetch(`/api/gym/members/${id}/nutrition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nutritionForm.name,
        description: nutritionForm.description || undefined,
        calories: nutritionForm.calories ? Number(nutritionForm.calories) : undefined,
        protein: nutritionForm.protein ? Number(nutritionForm.protein) : undefined,
        carbs: nutritionForm.carbs ? Number(nutritionForm.carbs) : undefined,
        fat: nutritionForm.fat ? Number(nutritionForm.fat) : undefined,
      }),
    });
    if (res.ok) {
      setNutritionForm({ name: '', description: '', calories: '', protein: '', carbs: '', fat: '' });
      setShowNutritionForm(false);
      loadMember();
    }
    setSavingNutrition(false);
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
      loadMember();
    }
  };

  // Training handlers
  const handleCreateTrainingPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingTraining(true);
    const res = await fetch(`/api/gym/members/${id}/training`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: trainingForm.name,
        description: trainingForm.description || undefined,
        daysPerWeek: Number(trainingForm.daysPerWeek),
      }),
    });
    if (res.ok) {
      setTrainingForm({ name: '', description: '', daysPerWeek: '3' });
      setShowTrainingForm(false);
      loadMember();
    }
    setSavingTraining(false);
  };

  const handleAddDay = async (planId: number) => {
    const res = await fetch(`/api/gym/training/${planId}/days`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dayNumber: Number(dayForm.dayNumber), name: dayForm.name }),
    });
    if (res.ok) {
      setDayForm({ dayNumber: '1', name: '' });
      loadMember();
    }
  };

  const handleAddExercise = async (dayId: number) => {
    const res = await fetch(`/api/gym/training/days/${dayId}/exercises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: exerciseForm.name,
        sets: Number(exerciseForm.sets),
        reps: exerciseForm.reps,
        weight: exerciseForm.weight || undefined,
      }),
    });
    if (res.ok) {
      setExerciseForm({ name: '', sets: '3', reps: '10', weight: '' });
      loadMember();
    }
  };

  const handleNutritionPlanToggle = (planId: number) => {
    setExpandedNutritionPlan(expandedNutritionPlan === planId ? null : planId);
  };

  const handleNutritionPlanKeyDown = (e: React.KeyboardEvent, planId: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNutritionPlanToggle(planId);
    }
  };

  const handleTrainingPlanToggle = (planId: number) => {
    setExpandedTrainingPlan(expandedTrainingPlan === planId ? null : planId);
  };

  const handleTrainingPlanKeyDown = (e: React.KeyboardEvent, planId: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTrainingPlanToggle(planId);
    }
  };

  if (loading) {
    return (
      <>
        <TitleBar title="Member Details" />
        <p className="text-muted-foreground">Loading...</p>
      </>
    );
  }

  if (!member || member.error) {
    return (
      <>
        <TitleBar title="Member Details" />
        <p className="text-destructive">Member not found</p>
      </>
    );
  }

  const latestWeight = member.weightEntries?.[0];
  const weightChange = member.weightEntries?.length >= 2
    ? (member.weightEntries[0].weight - member.weightEntries[1].weight).toFixed(1)
    : null;

  return (
    <>
      <TitleBar
        title={`${member.firstName} ${member.lastName}`}
        description={member.goal || 'No goal set'}
      />

      <div className="flex flex-col gap-4">
        {/* Stat cards */}
        <div className="*:data-[slot=card]:shadow-xs grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card sm:grid-cols-2 xl:grid-cols-4">
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Start Weight</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                {member.startWeight ? `${member.startWeight} kg` : '-'}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">Initial</Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="text-muted-foreground">
                Recorded at registration
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Current Weight</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                {latestWeight ? `${latestWeight.weight} kg` : '-'}
              </CardTitle>
              <CardAction>
                {weightChange !== null && (
                  <Badge variant="outline">
                    {Number(weightChange) <= 0
                      ? <IconTrendingDown className="size-3" />
                      : <IconTrendingUp className="size-3" />}
                    {weightChange}
                    {' '}
                    kg
                  </Badge>
                )}
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="text-muted-foreground">
                {member.weightEntries?.length ?? 0}
                {' '}
                total entries
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Nutrition Plans</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                {member.nutritionPlans?.length ?? 0}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  {member.nutritionPlans?.filter((p: { isActive: boolean }) => p.isActive)?.length ?? 0}
                  {' '}
                  active
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="text-muted-foreground">
                Meal planning & macros
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Training Plans</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                {member.trainingPlans?.length ?? 0}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  {member.trainingPlans?.filter((p: { isActive: boolean }) => p.isActive)?.length ?? 0}
                  {' '}
                  active
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="text-muted-foreground">
                Workout schedules
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Member Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Member Info</CardTitle>
            <CardAction>
              <div className="flex items-center gap-2">
                <Badge variant={member.isActive ? 'default' : 'destructive'}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </Badge>
                {!isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleStartEdit}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            {isEditing
              ? (
                  <form onSubmit={handleSaveEdit}>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="edit-firstName">First Name</Label>
                        <Input
                          id="edit-firstName"
                          type="text"
                          value={editForm.firstName}
                          onChange={e => setEditForm({ ...editForm, firstName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-lastName">Last Name</Label>
                        <Input
                          id="edit-lastName"
                          type="text"
                          value={editForm.lastName}
                          onChange={e => setEditForm({ ...editForm, lastName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-email">Email</Label>
                        <Input
                          id="edit-email"
                          type="email"
                          value={editForm.email}
                          onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-phone">Phone</Label>
                        <Input
                          id="edit-phone"
                          type="text"
                          value={editForm.phone}
                          onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-goal">Goal</Label>
                        <Input
                          id="edit-goal"
                          type="text"
                          value={editForm.goal}
                          onChange={e => setEditForm({ ...editForm, goal: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-height">Height (cm)</Label>
                        <Input
                          id="edit-height"
                          type="number"
                          value={editForm.height}
                          onChange={e => setEditForm({ ...editForm, height: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="edit-notes">Notes</Label>
                        <Input
                          id="edit-notes"
                          type="text"
                          value={editForm.notes}
                          onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button type="submit" disabled={savingEdit}>
                        {savingEdit ? 'Saving...' : 'Save'}
                      </Button>
                      <Button type="button" variant="outline" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )
              : (
                  <div className="grid gap-2 text-sm md:grid-cols-2">
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      {' '}
                      {member.email || '-'}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>
                      {' '}
                      {member.phone || '-'}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Height:</span>
                      {' '}
                      {member.height ? `${member.height} cm` : '-'}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Birth Date:</span>
                      {' '}
                      {member.birthDate || '-'}
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-muted-foreground">Notes:</span>
                      {' '}
                      {member.notes || '-'}
                    </div>
                  </div>
                )}
            {!isEditing && (
              <div className="mt-4 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleToggleActive}
                >
                  {member.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteMember}
                >
                  Delete Member
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabbed content: Weight | Nutrition | Training */}
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="weight">
              <TabsList>
                <TabsTrigger value="weight">Weight</TabsTrigger>
                <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                <TabsTrigger value="training">Training</TabsTrigger>
              </TabsList>

              {/* Weight Tab */}
              <TabsContent value="weight">
                <div className="space-y-4 pt-4">
                  <form onSubmit={handleAddWeight} className="rounded-lg border p-4">
                    <div className="mb-3 text-sm font-semibold">Add Weight Entry</div>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label htmlFor="weight-date">Date *</Label>
                        <Input
                          id="weight-date"
                          type="date"
                          required
                          value={weightForm.date}
                          onChange={e => setWeightForm({ ...weightForm, date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight-weight">Weight (kg) *</Label>
                        <Input
                          id="weight-weight"
                          type="number"
                          step="0.1"
                          required
                          value={weightForm.weight}
                          onChange={e => setWeightForm({ ...weightForm, weight: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight-bodyFat">Body Fat %</Label>
                        <Input
                          id="weight-bodyFat"
                          type="number"
                          step="0.1"
                          value={weightForm.bodyFatPercentage}
                          onChange={e => setWeightForm({ ...weightForm, bodyFatPercentage: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight-notes">Notes</Label>
                        <Input
                          id="weight-notes"
                          type="text"
                          value={weightForm.notes}
                          onChange={e => setWeightForm({ ...weightForm, notes: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={savingWeight} className="mt-4">
                      {savingWeight ? 'Saving...' : 'Add Entry'}
                    </Button>
                  </form>

                  {member.weightEntries?.length > 0
                    ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Weight (kg)</TableHead>
                              <TableHead>Body Fat %</TableHead>
                              <TableHead>Notes</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {member.weightEntries.map((entry: { id: number; date: string; weight: number; bodyFatPercentage: number | null; notes: string | null }) => (
                              <TableRow key={entry.id}>
                                <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                                <TableCell className="font-medium">{entry.weight}</TableCell>
                                <TableCell>{entry.bodyFatPercentage || '-'}</TableCell>
                                <TableCell>{entry.notes || '-'}</TableCell>
                                <TableCell>
                                  <button
                                    type="button"
                                    className="text-sm text-red-500 hover:text-red-700"
                                    onClick={() => handleDeleteWeight(entry.id)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleDeleteWeight(entry.id);
                                      }
                                    }}
                                    aria-label="Delete weight entry"
                                  >
                                    x
                                  </button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )
                    : <p className="py-4 text-sm text-muted-foreground">No weight entries yet.</p>}
                </div>
              </TabsContent>

              {/* Nutrition Tab */}
              <TabsContent value="nutrition">
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">Nutrition Plans</div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNutritionForm(!showNutritionForm)}
                    >
                      {showNutritionForm ? 'Cancel' : '+ Add Plan'}
                    </Button>
                  </div>

                  {showNutritionForm && (
                    <form onSubmit={handleCreateNutritionPlan} className="rounded-lg border p-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="nutrition-name">Plan Name *</Label>
                          <Input
                            id="nutrition-name"
                            type="text"
                            required
                            value={nutritionForm.name}
                            onChange={e => setNutritionForm({ ...nutritionForm, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nutrition-description">Description</Label>
                          <Input
                            id="nutrition-description"
                            type="text"
                            value={nutritionForm.description}
                            onChange={e => setNutritionForm({ ...nutritionForm, description: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nutrition-calories">Calories</Label>
                          <Input
                            id="nutrition-calories"
                            type="number"
                            value={nutritionForm.calories}
                            onChange={e => setNutritionForm({ ...nutritionForm, calories: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nutrition-protein">Protein (g)</Label>
                          <Input
                            id="nutrition-protein"
                            type="number"
                            value={nutritionForm.protein}
                            onChange={e => setNutritionForm({ ...nutritionForm, protein: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nutrition-carbs">Carbs (g)</Label>
                          <Input
                            id="nutrition-carbs"
                            type="number"
                            value={nutritionForm.carbs}
                            onChange={e => setNutritionForm({ ...nutritionForm, carbs: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nutrition-fat">Fat (g)</Label>
                          <Input
                            id="nutrition-fat"
                            type="number"
                            value={nutritionForm.fat}
                            onChange={e => setNutritionForm({ ...nutritionForm, fat: e.target.value })}
                          />
                        </div>
                      </div>
                      <Button type="submit" disabled={savingNutrition} className="mt-4">
                        {savingNutrition ? 'Saving...' : 'Save Plan'}
                      </Button>
                    </form>
                  )}

                  {member.nutritionPlans?.length > 0
                    ? (
                        <div className="space-y-3">
                          {member.nutritionPlans.map((plan: { id: number; name: string; calories: number | null; protein: number | null; carbs: number | null; fat: number | null; isActive: boolean; meals: { id: number; name: string; time: string | null; calories: number | null; protein: number | null; carbs: number | null; fat: number | null }[] }) => (
                            <Card key={plan.id}>
                              <CardHeader>
                                <div
                                  role="button"
                                  tabIndex={0}
                                  className="flex cursor-pointer items-center justify-between"
                                  onClick={() => handleNutritionPlanToggle(plan.id)}
                                  onKeyDown={e => handleNutritionPlanKeyDown(e, plan.id)}
                                >
                                  <div>
                                    <CardTitle className="text-base">{plan.name}</CardTitle>
                                    <CardDescription>
                                      {plan.calories ? `${plan.calories} kcal` : ''}
                                      {plan.protein ? ` P: ${plan.protein}g` : ''}
                                      {plan.carbs ? ` C: ${plan.carbs}g` : ''}
                                      {plan.fat ? ` F: ${plan.fat}g` : ''}
                                    </CardDescription>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={plan.isActive ? 'default' : 'destructive'}>
                                      {plan.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                    <button
                                      type="button"
                                      className="text-sm text-red-500 hover:text-red-700"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteNutritionPlan(plan.id);
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          handleDeleteNutritionPlan(plan.id);
                                        }
                                      }}
                                      aria-label={`Delete nutrition plan ${plan.name}`}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </CardHeader>

                              {expandedNutritionPlan === plan.id && (
                                <CardContent className="border-t pt-4">
                                  <div className="mb-2 text-sm font-medium">Meals</div>
                                  {plan.meals?.length > 0
                                    ? (
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>Meal</TableHead>
                                              <TableHead>Time</TableHead>
                                              <TableHead>Kcal</TableHead>
                                              <TableHead>P</TableHead>
                                              <TableHead>C</TableHead>
                                              <TableHead>F</TableHead>
                                              <TableHead>Actions</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {plan.meals.map(meal => (
                                              <TableRow key={meal.id}>
                                                <TableCell>{meal.name}</TableCell>
                                                <TableCell>{meal.time || '-'}</TableCell>
                                                <TableCell>{meal.calories || '-'}</TableCell>
                                                <TableCell>{meal.protein || '-'}</TableCell>
                                                <TableCell>{meal.carbs || '-'}</TableCell>
                                                <TableCell>{meal.fat || '-'}</TableCell>
                                                <TableCell>
                                                  <button
                                                    type="button"
                                                    className="text-sm text-red-500 hover:text-red-700"
                                                    onClick={() => handleDeleteMeal(meal.id)}
                                                    onKeyDown={(e) => {
                                                      if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        handleDeleteMeal(meal.id);
                                                      }
                                                    }}
                                                    aria-label={`Delete meal ${meal.name}`}
                                                  >
                                                    x
                                                  </button>
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      )
                                    : <p className="mb-4 text-sm text-muted-foreground">No meals yet.</p>}

                                  <div className="mt-3 flex flex-wrap gap-2">
                                    <Input
                                      placeholder="Meal name"
                                      value={mealForm.name}
                                      onChange={e => setMealForm({ ...mealForm, name: e.target.value })}
                                      className="w-auto"
                                    />
                                    <Input
                                      placeholder="Time"
                                      value={mealForm.time}
                                      onChange={e => setMealForm({ ...mealForm, time: e.target.value })}
                                      className="w-20"
                                    />
                                    <Input
                                      type="number"
                                      placeholder="Kcal"
                                      value={mealForm.calories}
                                      onChange={e => setMealForm({ ...mealForm, calories: e.target.value })}
                                      className="w-20"
                                    />
                                    <Button
                                      type="button"
                                      size="sm"
                                      onClick={() => handleAddMeal(plan.id)}
                                      disabled={!mealForm.name}
                                    >
                                      Add
                                    </Button>
                                  </div>
                                </CardContent>
                              )}
                            </Card>
                          ))}
                        </div>
                      )
                    : <p className="py-4 text-sm text-muted-foreground">No nutrition plans yet.</p>}
                </div>
              </TabsContent>

              {/* Training Tab */}
              <TabsContent value="training">
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">Training Plans</div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTrainingForm(!showTrainingForm)}
                    >
                      {showTrainingForm ? 'Cancel' : '+ Add Plan'}
                    </Button>
                  </div>

                  {showTrainingForm && (
                    <form onSubmit={handleCreateTrainingPlan} className="rounded-lg border p-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="training-name">Plan Name *</Label>
                          <Input
                            id="training-name"
                            type="text"
                            required
                            value={trainingForm.name}
                            onChange={e => setTrainingForm({ ...trainingForm, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="training-description">Description</Label>
                          <Input
                            id="training-description"
                            type="text"
                            value={trainingForm.description}
                            onChange={e => setTrainingForm({ ...trainingForm, description: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="training-daysPerWeek">Days/Week</Label>
                          <Input
                            id="training-daysPerWeek"
                            type="number"
                            min="1"
                            max="7"
                            value={trainingForm.daysPerWeek}
                            onChange={e => setTrainingForm({ ...trainingForm, daysPerWeek: e.target.value })}
                          />
                        </div>
                      </div>
                      <Button type="submit" disabled={savingTraining} className="mt-4">
                        {savingTraining ? 'Saving...' : 'Save Plan'}
                      </Button>
                    </form>
                  )}

                  {member.trainingPlans?.length > 0
                    ? (
                        <div className="space-y-3">
                          {member.trainingPlans.map((plan: { id: number; name: string; daysPerWeek: number; isActive: boolean; days: { id: number; dayNumber: number; name: string; exercises: { id: number; name: string; sets: number; reps: string; weight: number | null }[] }[] }) => (
                            <Card key={plan.id}>
                              <CardHeader>
                                <div
                                  role="button"
                                  tabIndex={0}
                                  className="flex cursor-pointer items-center justify-between"
                                  onClick={() => handleTrainingPlanToggle(plan.id)}
                                  onKeyDown={e => handleTrainingPlanKeyDown(e, plan.id)}
                                >
                                  <div>
                                    <CardTitle className="text-base">{plan.name}</CardTitle>
                                    <CardDescription>
                                      {plan.daysPerWeek}
                                      {' '}
                                      days/week
                                      {' '}
                                      &middot;
                                      {' '}
                                      {plan.days?.length ?? 0}
                                      {' '}
                                      days configured
                                    </CardDescription>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={plan.isActive ? 'default' : 'destructive'}>
                                      {plan.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                    <button
                                      type="button"
                                      className="text-sm text-red-500 hover:text-red-700"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteTrainingPlan(plan.id);
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          handleDeleteTrainingPlan(plan.id);
                                        }
                                      }}
                                      aria-label={`Delete training plan ${plan.name}`}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </CardHeader>

                              {expandedTrainingPlan === plan.id && (
                                <CardContent className="space-y-4 border-t pt-4">
                                  {plan.days?.map(day => (
                                    <div key={day.id} className="rounded-lg border p-3">
                                      <div className="mb-2 text-sm font-medium">
                                        Day
                                        {' '}
                                        {day.dayNumber}
                                        :
                                        {' '}
                                        {day.name}
                                      </div>
                                      {day.exercises?.length > 0
                                        ? (
                                            <Table>
                                              <TableHeader>
                                                <TableRow>
                                                  <TableHead>Exercise</TableHead>
                                                  <TableHead>Sets</TableHead>
                                                  <TableHead>Reps</TableHead>
                                                  <TableHead>Weight</TableHead>
                                                  <TableHead>Actions</TableHead>
                                                </TableRow>
                                              </TableHeader>
                                              <TableBody>
                                                {day.exercises.map(ex => (
                                                  <TableRow key={ex.id}>
                                                    <TableCell>{ex.name}</TableCell>
                                                    <TableCell>{ex.sets}</TableCell>
                                                    <TableCell>{ex.reps}</TableCell>
                                                    <TableCell>{ex.weight ? `${ex.weight} kg` : '-'}</TableCell>
                                                    <TableCell>
                                                      <button
                                                        type="button"
                                                        className="text-sm text-red-500 hover:text-red-700"
                                                        onClick={() => handleDeleteExercise(ex.id)}
                                                        onKeyDown={(e) => {
                                                          if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            handleDeleteExercise(ex.id);
                                                          }
                                                        }}
                                                        aria-label={`Delete exercise ${ex.name}`}
                                                      >
                                                        x
                                                      </button>
                                                    </TableCell>
                                                  </TableRow>
                                                ))}
                                              </TableBody>
                                            </Table>
                                          )
                                        : <p className="mb-2 text-sm text-muted-foreground">No exercises yet.</p>}
                                      <div className="mt-2 flex flex-wrap gap-2">
                                        <Input
                                          placeholder="Exercise"
                                          value={exerciseForm.name}
                                          onChange={e => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                                          className="w-auto"
                                        />
                                        <Input
                                          type="number"
                                          placeholder="Sets"
                                          value={exerciseForm.sets}
                                          onChange={e => setExerciseForm({ ...exerciseForm, sets: e.target.value })}
                                          className="w-16"
                                        />
                                        <Input
                                          placeholder="Reps"
                                          value={exerciseForm.reps}
                                          onChange={e => setExerciseForm({ ...exerciseForm, reps: e.target.value })}
                                          className="w-16"
                                        />
                                        <Input
                                          type="number"
                                          step="0.5"
                                          placeholder="kg"
                                          value={exerciseForm.weight}
                                          onChange={e => setExerciseForm({ ...exerciseForm, weight: e.target.value })}
                                          className="w-16"
                                        />
                                        <Button
                                          type="button"
                                          size="sm"
                                          onClick={() => handleAddExercise(day.id)}
                                          disabled={!exerciseForm.name}
                                        >
                                          +
                                        </Button>
                                      </div>
                                    </div>
                                  ))}

                                  <div className="flex flex-wrap gap-2">
                                    <Input
                                      type="number"
                                      min="1"
                                      placeholder="#"
                                      value={dayForm.dayNumber}
                                      onChange={e => setDayForm({ ...dayForm, dayNumber: e.target.value })}
                                      className="w-16"
                                    />
                                    <Input
                                      placeholder="Day name (e.g. Chest & Triceps)"
                                      value={dayForm.name}
                                      onChange={e => setDayForm({ ...dayForm, name: e.target.value })}
                                      className="w-auto"
                                    />
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleAddDay(plan.id)}
                                      disabled={!dayForm.name}
                                    >
                                      Add Day
                                    </Button>
                                  </div>
                                </CardContent>
                              )}
                            </Card>
                          ))}
                        </div>
                      )
                    : <p className="py-4 text-sm text-muted-foreground">No training plans yet.</p>}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
