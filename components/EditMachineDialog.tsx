'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material'
import { useState, useEffect } from 'react'

interface Machine {
  id: string
  name: string
  model: string
  type: string
  status: string
}

interface Props {
  open: boolean
  machine: Machine | null
  onClose: () => void
  onSave: (updated: Machine) => void
}

export default function EditMachineDialog({ open, machine, onClose, onSave }: Props) {
  const [form, setForm] = useState<Machine | null>(null)

  useEffect(() => {
    setForm(machine)
  }, [machine])

  if (!form) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value } as Machine)
  }

  const handleSave = () => {
    if (form) {
      onSave(form)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} disableEnforceFocus>
      <DialogTitle>Edit Machine</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="name"
          label="Name"
          fullWidth
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="model"
          label="Model"
          fullWidth
          value={form.model}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="type"
          label="Type"
          fullWidth
          value={form.type}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="status"
          label="Status"
          fullWidth
          value={form.status}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  )
}
