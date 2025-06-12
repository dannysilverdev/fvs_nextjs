'use client'

import { useState } from 'react'
import {
  Card, CardContent, Typography, IconButton, Tooltip, Stack, Button,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import AddDeadlineDialog from './AddDeadlineDialog'

type Deadline = {
  id: string
  date: string
  frequency_days: number
  deadline_types: { name: string } | null
}

type Machine = {
  id: string
  name: string
  type: string
  model: string
  status: string
}

type Props = {
  machine: Machine
  deadlines: Deadline[]
  onEdit: (machine: Machine) => void
  onDelete: (id: string) => void
  onDeadlineAdded: () => void
}

export default function MachineCard({ machine, deadlines, onEdit, onDelete, onDeadlineAdded }: Props) {
  const [openDialog, setOpenDialog] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const getColor = (date: string, freq: number): string => {
    const last = new Date(date + 'T00:00')
    const due = new Date(last)
    due.setDate(due.getDate() + freq)

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (diff <= 15) return 'red'
    if (diff <= 30) return 'yellow'
    return 'green'
  }

  const getTooltipContent = (d: Deadline) => {
    const last = new Date(d.date + 'T00:00')
    const due = new Date(last)
    due.setDate(due.getDate() + d.frequency_days)

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    return `
${d.deadline_types?.name?.toUpperCase() || 'VENCIMIENTO'}
Última revisión: ${last.toLocaleDateString()}
Frecuencia: ${d.frequency_days} días
Vence: ${due.toLocaleDateString()}
Restan: ${diff} días
    `.trim()
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{machine.name}</Typography>
        <Typography variant="body2">Type: {machine.type}</Typography>
        <Typography variant="body2">Model: {machine.model}</Typography>
        <Typography variant="body2">Status: {machine.status}</Typography>

        <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
          {deadlines.map((d) => (
            <Stack key={d.id} direction="row" alignItems="center" spacing={1}>
              <Tooltip title={<pre>{getTooltipContent(d)}</pre>} arrow>
                <span style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: getColor(d.date, d.frequency_days),
                  display: 'inline-block',
                  cursor: 'pointer'
                }} />
              </Tooltip>
              <Typography variant="body2">{d.deadline_types?.name || 'Desconocido'}</Typography>
            </Stack>
          ))}
        </Stack>

        <Tooltip title="Agregar vencimiento">
          <IconButton onClick={() => setOpenDialog(true)} size="small" sx={{ mt: 2 }}>
            <span style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              display: 'inline-block',
              lineHeight: '1',
              transform: 'scale(1.3)'
            }}>＋</span>
          </IconButton>
        </Tooltip>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <IconButton onClick={() => onEdit(machine)}><Edit /></IconButton>
          <IconButton onClick={() => setConfirmOpen(true)}><Delete /></IconButton>
        </Stack>

        <AddDeadlineDialog
          open={openDialog}
          machineId={machine.id}
          onClose={() => setOpenDialog(false)}
          onAdded={onDeadlineAdded}
        />

        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>¿Eliminar máquina?</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que quieres eliminar esta máquina? Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
            <Button
              onClick={() => {
                onDelete(machine.id)
                setConfirmOpen(false)
              }}
              color="error"
              variant="contained"
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  )
}
