import React from 'react';
import Hero from '@/components/hero';
import PopularProducts from '@/components/home/PopularProducts';
import PopularArtists from '@/components/home/PopularArtists';

export default function Page() {
  return (
    <main className="overflow-hidden">
      <Hero/>
      <section className="padding-x padding-y">
        <PopularProducts/>
      </section>
      <section className="padding-x padding-y">
        <PopularArtists/>
      </section>
    </main>


  );
}
