import React from 'react';
import Hero from '@/components/hero';
import PopularProducts from '@/components/PopularProducts';
import Howitworks from '@/components/howitworks';
import PopularArtists from '@/components/PopularArtists';

export default function Page() {
  return (
    <main className="overflow-hidden">
      <Hero/>
      <section className="padding-x padding-y">
        <Howitworks/>
      </section>
      <section className="padding-x padding-y">
        <PopularProducts/>
      </section>
      <section className="padding-x padding-y">
        <PopularArtists/>
      </section>

      
    </main>


  );
}
