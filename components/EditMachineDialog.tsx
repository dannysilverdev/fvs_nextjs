'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material'

type Machine = {
  id: string
  name: string
  type: string
  model: string
  status: string
  plate_number: string
  brand: string
}

type Props = {
  open: boolean
  machine: Machine
  onClose: () => void
  onSave: (machine: Machine) => void
}

export default function EditMachineDialog({ open, machine, onClose, onSave }: Props) {
  const [form, setForm] = useState(machine)

  useEffect(() => {
    setForm(machine)
  }, [machine])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    onSave(form)
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Machine</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="normal"
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          label="Type"
          name="type"
          fullWidth
          margin="normal"
          value={form.type}
          onChange={handleChange}
        />
        <TextField
          label="Model"
          name="model"
          fullWidth
          margin="normal"
          value={form.model}
          onChange={handleChange}
        />
        <TextField
          label="Status"
          name="status"
          fullWidth
          margin="normal"
          value={form.status}
          onChange={handleChange}
        />
        <TextField
          label="Plate Number"
          name="plate_number"
          fullWidth
          margin="normal"
          value={form.plate_number}
          onChange={handleChange}
        />
        <TextField
          label="Brand"
          name="brand"
          fullWidth
          margin="normal"
          value={form.brand}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}
