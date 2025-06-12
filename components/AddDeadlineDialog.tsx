'use client'

import { useEffect, useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, FormControl, InputLabel, Select
} from '@mui/material'
import { supabase } from '@/lib/supabase'

type DeadlineType = {
  id: string
  name: string
}

type Props = {
  open: boolean
  machineId: string
  onClose: () => void
  onAdded: () => void
}

export default function AddDeadlineDialog({ open, machineId, onClose, onAdded }: Props) {
  const [types, setTypes] = useState<DeadlineType[]>([])
  const [selectedType, setSelectedType] = useState('')
  const [date, setDate] = useState('')
  const [frequency, setFrequency] = useState(180)

  useEffect(() => {
    const fetchTypes = async () => {
      const { data } = await supabase.from('deadline_types').select('*')
      setTypes(data || [])
    }
    fetchTypes()
  }, [])

  const handleSubmit = async () => {
    if (!selectedType || !date || !frequency) return

    const { error } = await supabase.from('deadlines').insert({
      machine_id: machineId,
      type_id: selectedType,
      date,
      frequency_days: frequency
    })

    if (!error) {
      onAdded()
      onClose()
      setSelectedType('')
      setDate('')
      setFrequency(180)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Agregar Vencimiento</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <FormControl fullWidth>
          <InputLabel>Tipo</InputLabel>
          <Select
            value={selectedType}
            label="Tipo"
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {types.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Fecha de realización"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <TextField
          label="Frecuencia (días)"
          type="number"
          value={frequency}
          onChange={(e) => setFrequency(Number(e.target.value))}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  )
}
