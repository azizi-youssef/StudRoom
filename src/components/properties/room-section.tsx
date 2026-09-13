'use client';

import React, { useState } from 'react';
import { DbRoom, PropertyDetail } from '@/shared/types';
import { formatCurrencyDH } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { BookingForm } from '@/components/forms/booking-form';
import { Bed, CheckCircle2, Clock, XCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface RoomSectionProps {
  rooms: DbRoom[];
  property: PropertyDetail;
}

export function RoomSection({ rooms, property }: RoomSectionProps) {
  const [selectedRoom, setSelectedRoom] = useState<DbRoom | null>(null);

  const getStatusBadge = (status: DbRoom['status']) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <Badge variant="success" className="bg-emerald-100 text-emerald-800 font-bold border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Disponible
          </Badge>
        );
      case 'RESERVED':
        return (
          <Badge variant="warning" className="bg-amber-100 text-amber-800 font-bold border-amber-200">
            <Clock className="w-3.5 h-3.5 mr-1" />
            En cours de réservation
          </Badge>
        );
      case 'OCCUPIED':
        return (
          <Badge variant="default" className="bg-slate-200 text-slate-700 font-bold border-slate-300">
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Occupée
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-slate-500 font-semibold">
            Non disponible
          </Badge>
        );
    }
  };

  const getRoomTypeLabel = (type: DbRoom['room_type']) => {
    switch (type) {
      case 'MASTER':
        return 'Chambre Suite Master';
      case 'PRIVATE':
        return 'Chambre Individuelle Privée';
      case 'SHARED':
        return 'Chambre Partagée (Colocation)';
      case 'STUDIO':
        return 'Studio Autonome';
      default:
        return 'Chambre Étudiante';
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Bed className="w-5 h-5 text-primary-600" />
            Chambres & Disponibilités
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Sélectionnez la chambre de votre choix pour soumettre votre demande.
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1 bg-primary-50 text-primary-700 rounded-full border border-primary-100 w-fit">
          {rooms.filter(r => r.status === 'AVAILABLE').length} / {rooms.length} disponibles
        </span>
      </div>

      {/* Rooms List */}
      <div className="flex flex-col gap-4">
        {rooms.map((room) => {
          const isAvailable = room.status === 'AVAILABLE';
          return (
            <div
              key={room.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                isAvailable
                  ? 'bg-white border-slate-200 hover:border-primary-300 hover:shadow-soft'
                  : 'bg-slate-50 border-slate-200/70 opacity-80'
              }`}
            >
              <div className="flex flex-col gap-2 max-w-lg">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-extrabold text-slate-900 text-base">{room.name}</h4>
                  {getStatusBadge(room.status)}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-semibold">
                  <span className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-700 font-bold">
                    {getRoomTypeLabel(room.room_type)}
                  </span>
                  <span>Superficie : {room.surface_sqm} m²</span>
                  <span>Caution : {formatCurrencyDH(room.deposit_dh)}</span>
                  {room.floor && <span>Étage : {room.floor}</span>}
                </div>

                {room.features && room.features.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {room.features.map((feat, idx) => (
                      <span key={idx} className="text-[11px] font-semibold text-slate-600 bg-slate-100/80 px-2 py-0.5 rounded-md">
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-left md:text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Loyer mensuel</span>
                  <div className="text-xl font-black text-primary-600">
                    {formatCurrencyDH(room.price_monthly)}
                    <span className="text-xs font-semibold text-slate-500"> /mois</span>
                  </div>
                </div>

                <Button
                  variant={isAvailable ? "primary" : "outline"}
                  size="sm"
                  disabled={!isAvailable}
                  onClick={() => setSelectedRoom(room)}
                  className="font-bold gap-1 text-xs px-4"
                >
                  {isAvailable ? (
                    <>
                      Demander cette chambre
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    'Non disponible'
                  )}
                </Button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Booking Dialog Modal for selected room */}
      {selectedRoom && (
        <Dialog isOpen={!!selectedRoom} onClose={() => setSelectedRoom(null)} maxWidth="lg">
          <BookingForm property={property} room={selectedRoom} onSuccess={() => {}} />
        </Dialog>
      )}
    </div>
  );
}
