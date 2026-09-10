import { supabase } from '../lib/supabaseClient';
import Header from './components/Header';
import Hero from './components/Hero';
import InfoStrip from './components/InfoStrip';
import LastResult from './components/LastResult';
import CalendarSection from './components/CalendarSection';
import SquadraSection from './components/SquadraSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import RevealObserver from './components/RevealObserver';

// Non mettere in cache: ogni visita legge i dati aggiornati dal database
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [playersRes, staffRes, matchesRes] = await Promise.all([
    supabase.from('players').select('*').order('sort_order').order('number'),
    supabase.from('staff').select('*').order('sort_order'),
    supabase.from('matches').select('*, scorers(id, player_name, goals)').order('giornata'),
  ]);

  const players = playersRes.data || [];
  const staff = staffRes.data || [];
  const matches = matchesRes.data || [];

  const playedMatches = matches
    .filter((m) => m.status === 'played' && m.match_date)
    .sort((a, b) => new Date(b.match_date) - new Date(a.match_date));
  const lastMatch = playedMatches[0] || null;

  return (
    <>
      <Header />
      <Hero />
      <InfoStrip />
      <LastResult match={lastMatch} />
      <CalendarSection matches={matches} />
      <SquadraSection staff={staff} players={players} />
      <ContactSection />
      <Footer />
      <RevealObserver />
    </>
  );
}
