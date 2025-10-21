"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createOrUpdateTicket } from "@/services/ticket"
import { getEventTypes } from "@/services/event"
import type { AddEventTypeViewModelResult } from "@/types/event"
import { Loader2 } from "lucide-react"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventId: number
  eventName?: string
}

export default function EventRegistrationModal({ open, onOpenChange, eventId, eventName }: Props) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [ticketTypeId, setTicketTypeId] = useState<string>("")
  const [types, setTypes] = useState<Array<{ id: number; name: string }>>([])
  const [loadingTypes, setLoadingTypes] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setLoadingTypes(true)
    getEventTypes()
      .then((res: AddEventTypeViewModelResult) => {
        const list = (res?.data ? [res.data] : []).filter(Boolean) as any[]
        // Some APIs return single object; others list — normalize conservatively
        const flattened: Array<{ id: number; name: string }> = Array.isArray(list)
          ? list.map((x: any) => ({ id: Number(x?.id ?? x?.Id ?? 0), name: String(x?.name ?? x?.Name ?? "") })).filter(t => t.id && t.name)
          : []
        setTypes(flattened)
      })
      .catch(() => {})
      .finally(() => setLoadingTypes(false))
  }, [open])

  useEffect(() => {
    if (!open) {
      setFirstName("")
      setLastName("")
      setEmail("")
      setPhone("")
      setFile(null)
      setTicketTypeId("")
      setError(null)
    }
  }, [open])

  const canSubmit = useMemo(() => {
    return !!eventId && firstName.trim() && lastName.trim() && email.trim() && phone.trim()
  }, [eventId, firstName, lastName, email, phone])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      await createOrUpdateTicket({
        id: null,
        eventId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phoneNumber: phone.trim(),
        file: file ?? undefined,
      })
      onOpenChange(false)
    } catch (err: any) {
      const msg = err?.response?.data?.responseMessage || err?.response?.data?.message || err?.message || "Unable to submit registration"
      setError(String(msg))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Register for {eventName || "Event"}</DialogTitle>
          <DialogDescription>
            Please provide your details to secure your ticket. We’ll send a confirmation to your email.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone number</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Ticket type</Label>
              <Select value={ticketTypeId} onValueChange={setTicketTypeId}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingTypes ? "Loading..." : (types.length ? "Select a type" : "No types available")} />
                </SelectTrigger>
                <SelectContent>
                  {types.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="file">Attachment (optional)</Label>
              <Input id="file" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button>
            <Button type="submit" disabled={!canSubmit || submitting} className="bg-primary hover:bg-primary/90 text-white">
              {submitting ? (<><Loader2 className="h-4 w-4 animate-spin mr-2" /> Submitting...</>) : ("Submit Registration")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}





