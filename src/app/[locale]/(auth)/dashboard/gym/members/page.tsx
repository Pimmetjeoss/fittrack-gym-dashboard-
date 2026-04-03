'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    goal: '',
    startWeight: '',
  });
  const [saving, setSaving] = useState(false);

  const loadMembers = useCallback(() => {
    fetch('/api/gym/members')
      .then(res => res.json())
      .then((data) => {
        setMembers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/gym/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ firstName: '', lastName: '', email: '', phone: '', goal: '', startWeight: '' });
      setShowForm(false);
      loadMembers();
    }
    setSaving(false);
  };

  const activeMembers = members.filter(m => m.isActive);
  const inactiveMembers = members.filter(m => !m.isActive);

  const handleDeleteMember = async (memberId: number, memberName: string) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(`Are you sure you want to delete ${memberName}?`)) {
      return;
    }
    const res = await fetch(`/api/gym/members/${memberId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      loadMembers();
    }
  };

  const handleDeleteKeyDown = (e: React.KeyboardEvent, memberId: number, memberName: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDeleteMember(memberId, memberName);
    }
  };

  const renderMembersTable = (membersList: any[]) => {
    if (loading) {
      return <p className="py-4 text-sm text-muted-foreground">Loading...</p>;
    }
    if (membersList.length === 0) {
      return (
        <p className="py-4 text-sm text-muted-foreground">
          No members found.
        </p>
      );
    }
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Goal</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {membersList.map(member => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">
                {member.firstName}
                {' '}
                {member.lastName}
              </TableCell>
              <TableCell>{member.email || '-'}</TableCell>
              <TableCell>{member.phone || '-'}</TableCell>
              <TableCell>{member.goal || '-'}</TableCell>
              <TableCell>
                <Badge variant={member.isActive ? 'default' : 'destructive'}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/gym/members/${member.id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                  <button
                    type="button"
                    className="text-sm text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteMember(member.id, `${member.firstName} ${member.lastName}`)}
                    onKeyDown={e => handleDeleteKeyDown(e, member.id, `${member.firstName} ${member.lastName}`)}
                  >
                    Delete
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <>
      <TitleBar title="Members" description="Manage your gym members" />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div />
          <Button
            type="button"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Add Member'}
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Member</CardTitle>
              <CardDescription>Fill in the details to add a new gym member.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="member-firstName">First Name *</Label>
                    <Input
                      id="member-firstName"
                      type="text"
                      required
                      value={form.firstName}
                      onChange={e => setForm({ ...form, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="member-lastName">Last Name *</Label>
                    <Input
                      id="member-lastName"
                      type="text"
                      required
                      value={form.lastName}
                      onChange={e => setForm({ ...form, lastName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="member-email">Email</Label>
                    <Input
                      id="member-email"
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="member-phone">Phone</Label>
                    <Input
                      id="member-phone"
                      type="text"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="member-goal">Goal</Label>
                    <Input
                      id="member-goal"
                      type="text"
                      value={form.goal}
                      onChange={e => setForm({ ...form, goal: e.target.value })}
                      placeholder="e.g. Weight loss, Muscle gain"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="member-startWeight">Start Weight (kg)</Label>
                    <Input
                      id="member-startWeight"
                      type="number"
                      step="0.1"
                      value={form.startWeight}
                      onChange={e => setForm({ ...form, startWeight: e.target.value })}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={saving}
                  className="mt-4"
                >
                  {saving ? 'Saving...' : 'Save Member'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">
                  All Members (
                  {members.length}
                  )
                </TabsTrigger>
                <TabsTrigger value="active">
                  Active (
                  {activeMembers.length}
                  )
                </TabsTrigger>
                <TabsTrigger value="inactive">
                  Inactive (
                  {inactiveMembers.length}
                  )
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                {renderMembersTable(members)}
              </TabsContent>
              <TabsContent value="active">
                {renderMembersTable(activeMembers)}
              </TabsContent>
              <TabsContent value="inactive">
                {renderMembersTable(inactiveMembers)}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
