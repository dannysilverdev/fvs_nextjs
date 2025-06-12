'use client'

import { useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import { supabase } from '@/lib/supabase'

type Machine = {
  id: string
  name: string
  type: string
  model: string
  status: string
}

type Props = {
  onAdd: (newMachine: Machine) => void
}

export default function AddMachineForm({ onAdd }: Props) {
  const [form, setForm] = useState({
    name: '',
    type: '',
    model: '',
    status: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data, error } = await supabase.from('machines').insert([form]).select().single()

    if (error) {
      console.error('Error creating machine', error.message)
    } else if (data) {
      onAdd(data)
      setForm({ name: '', type: '', model: '', status: '' })
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="subtitle1" gutterBottom>Add New Machine</Typography>

      <TextField label="Name" name="name" fullWidth margin="normal" required value={form.name} onChange={handleChange} />
      <TextField label="Type" name="type" fullWidth margin="normal" required value={form.type} onChange={handleChange} />
      <TextField label="Model" name="model" fullWidth margin="normal" required value={form.model} onChange={handleChange} />
      <TextField label="Status" name="status" fullWidth margin="normal" required value={form.status} onChange={handleChange} />

      <Button type="submit" variant="contained" sx={{ mt: 2 }}>Add</Button>
    </Box>
  )
}
