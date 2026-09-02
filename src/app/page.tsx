import React from 'react';
import { HeroSection } from '@/components/home/hero-section';
import { BenefitsSection } from '@/components/home/benefits-section';
import { FeaturedProperties } from '@/components/home/featured-properties';
import { HowItWorksPreview } from '@/components/home/how-it-works-preview';
import { LandlordBanner } from '@/components/home/landlord-banner';
import { PropertyDetail } from '@/shared/types';
import { DbUniversity } from '@/shared/types/database';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function getFeaturedProperties(): Promise<PropertyDetail[]> {
  try {
    const res = await fetch(`${API_URL}/properties/featured`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

async function getUniversities(): Promise<DbUniversity[]> {
  try {
    const res = await fetch(`${API_URL}/universities`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [universities, properties] = await Promise.all([
    getUniversities(),
    getFeaturedProperties(),
  ]);

  return (
    <>
      <HeroSection universities={universities} />
      <BenefitsSection />
      <FeaturedProperties properties={properties} />
      <HowItWorksPreview />
      <LandlordBanner />
    </>
  );
}
