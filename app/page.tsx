'use client'

import { useEffect, useState } from 'react'
import {
  Container, Typography, Paper, Grid, Button,
  Dialog, DialogTitle, DialogContent, Snackbar, Alert
} from '@mui/material'
import { supabase } from '@/lib/supabase'
import AddMachineForm from '@/components/AddMachineForm'
import MachineCard from '@/components/MachineCard'
import EditMachineDialog from '@/components/EditMachineDialog'

type Machine = {
  id: string
  name: string
  type: string
  model: string
  status: string
}

type Deadline = {
  id: string
  date: string
  frequency_days: number
  machine_id: string
  deadline_types: { name: string } | null
}

export default function HomePage() {
  const [machines, setMachines] = useState<Machine[]>([])
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [loading, setLoading] = useState(true)
  const [openForm, setOpenForm] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null)
  const [snack, setSnack] = useState<{ message: string; severity: 'success' | 'error' } | null>(null)

  const fetchMachines = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('machines').select('*')
    if (error) {
      setSnack({ message: 'Error loading machines', severity: 'error' })
    } else if (data) {
      setMachines(data)
    }
    setLoading(false)
  }

  const fetchDeadlines = async () => {
    const { data, error } = await supabase
      .from('deadlines')
      .select('id, date, frequency_days, machine_id, deadline_types ( name )')

    if (error) {
      setSnack({ message: 'Error loading deadlines', severity: 'error' })
    } else if (data) {
      const normalized: Deadline[] = (data as any[]).map((d) => ({
        id: d.id,
        date: d.date,
        frequency_days: d.frequency_days,
        machine_id: d.machine_id,
        deadline_types: Array.isArray(d.deadline_types) ? d.deadline_types[0] : d.deadline_types
      }))
      setDeadlines(normalized)
    }
  }

  useEffect(() => {
    fetchMachines()
    fetchDeadlines()
  }, [])

  const handleAdd = (machine: Machine) => {
    setMachines((prev) => [...prev, machine])
    setOpenForm(false)
    setSnack({ message: 'Machine added successfully', severity: 'success' })
  }

  const handleEdit = (machine: Machine) => setSelectedMachine(machine)

  const handleSave = async (updated: Machine) => {
    const { error } = await supabase
      .from('machines')
      .update({
        name: updated.name,
        type: updated.type,
        model: updated.model,
        status: updated.status
      })
      .eq('id', updated.id)

    if (error) {
      setSnack({ message: 'Error updating machine', severity: 'error' })
    } else {
      setSnack({ message: 'Machine updated successfully', severity: 'success' })
      setEditOpen(false)
      fetchMachines()
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('machines').delete().eq('id', id)
    if (error) {
      setSnack({ message: 'Error deleting machine', severity: 'error' })
    } else {
      setMachines((prev) => prev.filter((m) => m.id !== id))
      setSnack({ message: 'Machine deleted successfully', severity: 'success' })
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Fleet Vitals System</Typography>

      <Typography variant="h6" gutterBottom>Machines Overview</Typography>

      {loading ? (
        <Typography>Loading machines...</Typography>
      ) : (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {machines.map((m) => {
            const relatedDeadlines = deadlines.filter(d => d.machine_id === m.id)
            return (
              <Grid item xs={12} sm={6} md={4} key={m.id}>
                <MachineCard
                  machine={m}
                  deadlines={relatedDeadlines}
                  onEdit={() => {
                    setSelectedMachine(m)
                    setEditOpen(true)
                  }}
                  onDelete={handleDelete}
                  onDeadlineAdded={fetchDeadlines}
                />
              </Grid>
            )
          })}
        </Grid>
      )}

      <Button variant="contained" onClick={() => setOpenForm(true)}>Add Machine</Button>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New Machine</DialogTitle>
        <DialogContent>
          <AddMachineForm onAdd={handleAdd} />
        </DialogContent>
      </Dialog>

      {selectedMachine && (
        <EditMachineDialog
          open={editOpen}
          machine={selectedMachine}
          onClose={() => setEditOpen(false)}
          onSave={handleSave}
        />
      )}

      {snack && (
        <Snackbar open autoHideDuration={3000} onClose={() => setSnack(null)}>
          <Alert severity={snack.severity} onClose={() => setSnack(null)} sx={{ width: '100%' }}>
            {snack.message}
          </Alert>
        </Snackbar>
      )}
    </Container>
  )
}
