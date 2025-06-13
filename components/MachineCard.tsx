'use client'

import { useState } from 'react'
import {
  Card, CardContent, Typography, IconButton, Tooltip, Stack, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, useTheme, useMediaQuery, Box
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
  plate_number: string
  brand: string
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
  const [selectedDeadline, setSelectedDeadline] = useState<Deadline | null>(null)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

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

  const getDueDate = (date: string, freq: number): Date => {
    const d = new Date(date + 'T00:00')
    d.setDate(d.getDate() + freq)
    return d
  }

  const getDaysRemaining = (due: Date): number => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  return (
    <Card sx={{ position: 'relative' }}>
      {/* Botones en la esquina superior derecha */}
      <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
        <IconButton onClick={() => onEdit(machine)} size="small"><Edit /></IconButton>
        <IconButton onClick={() => setConfirmOpen(true)} size="small"><Delete /></IconButton>
      </Box>

      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
          {machine.name}
        </Typography>
        <Typography variant="body2">Patente: {machine.plate_number}</Typography>
        <Typography variant="body2">Tipo: {machine.type}</Typography>
        <Typography variant="body2">Marca: {machine.brand}</Typography>
        <Typography variant="body2">Modelo: {machine.model}</Typography>
        <Typography variant="body2">Status: {machine.status}</Typography>

        <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
          {deadlines.map((d) => {
            const due = getDueDate(d.date, d.frequency_days)
            return (
              <Stack key={d.id} direction="row" alignItems="center" spacing={1}>
                <span
                  onClick={() => setSelectedDeadline(d)}
                  style={{
                    width: isMobile ? 30 : 18,
                    height: isMobile ? 30 : 18,
                    borderRadius: '50%',
                    backgroundColor: getColor(d.date, d.frequency_days),
                    display: 'inline-block',
                    cursor: 'pointer',
                    marginRight: 4
                  }}
                />
                <Typography variant="body2">{d.deadline_types?.name || 'Desconocido'}</Typography>
              </Stack>
            )
          })}
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

        <AddDeadlineDialog
          open={openDialog}
          machineId={machine.id}
          onClose={() => setOpenDialog(false)}
          onAdded={onDeadlineAdded}
        />

        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Delete machine?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this machine? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                onDelete(machine.id)
                setConfirmOpen(false)
              }}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={!!selectedDeadline} onClose={() => setSelectedDeadline(null)}>
          <DialogTitle>{selectedDeadline?.deadline_types?.name || 'Detail'}</DialogTitle>
          <DialogContent>
            {selectedDeadline && (
              <>
                <Typography>Last maintenance: {new Date(selectedDeadline.date).toLocaleDateString()}</Typography>
                <Typography>Frequency: {selectedDeadline.frequency_days} days</Typography>
                <Typography>
                  Due: {getDueDate(selectedDeadline.date, selectedDeadline.frequency_days).toLocaleDateString()}
                </Typography>
                <Typography>
                  Remaining: {getDaysRemaining(getDueDate(selectedDeadline.date, selectedDeadline.frequency_days))} days
                </Typography>
              </>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
