# La Marina · Sito + Area Admin

## Cosa c'è in questo progetto
- Sito pubblico (Home, Calendario, Squadra, Contatti) che legge i dati da Supabase
- Area admin (/admin) protetta da password per gestire giocatori, dirigenza, partite e marcatori
- Tutte le scritture passano da API sicure (mai esposte al browser con la chiave segreta)

## Cosa ti serve prima di iniziare
- Account GitHub (fatto ✅)
- Account Supabase con progetto creato e tabelle già eseguite (fatto ✅)
- Account Vercel (gratuito, se non lo hai già)

## Passaggi per andare online

### 1. Recupera le chiavi da Supabase
Nella dashboard del tuo progetto Supabase:
- Vai su **Project Settings** (icona ingranaggio) → **API**
- Copia questi 3 valori, ti serviranno tra poco:
  - **Project URL**
  - **anon public** (chiave pubblica)
  - **service_role** (chiave segreta — non condividerla mai, non va mai nel browser)

### 2. Carica il codice su GitHub
- Vai su github.com, crea un nuovo repository (es. "la-marina-sito"), lascialo vuoto (senza README)
- Nella pagina del repository, clicca "uploading an existing file"
- Trascina dentro TUTTA la cartella di questo progetto (mantieni la struttura delle sottocartelle)
- Conferma il commit

### 3. Importa il progetto su Vercel
- Vai su vercel.com, accedi con GitHub
- Clicca "Add New..." → "Project"
- Seleziona il repository appena creato e clicca "Import"

### 4. Aggiungi le variabili d'ambiente
Prima di cliccare "Deploy", apri la sezione **Environment Variables** e aggiungi:

| Nome | Valore |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | il Project URL copiato da Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | la chiave anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | la chiave service_role |
| `ADMIN_PASSWORD` | la password che vuoi usare per entrare in /admin |

Poi clicca **Deploy**. Dopo 1-2 minuti il sito sarà online su un indirizzo tipo `la-marina-sito.vercel.app`.

### 5. Primo test
- Apri il sito pubblico: vedrai le sezioni vuote (nessun dato ancora inserito) con messaggi tipo "Nessun giocatore inserito ancora" — è normale
- Vai su `tuosito.vercel.app/admin`, inserisci la password scelta
- Aggiungi un giocatore di prova → torna sul sito pubblico → aggiorna la pagina → dovresti vederlo comparire nella sezione Squadra
- Ripeti per dirigenza e per una partita (prova sia "da giocare" che "giocata" con marcatori)

## Uso quotidiano
Da quel momento in poi non serve più toccare codice: vai su `tuosito.vercel.app/admin`, accedi con la password, e gestisci tutto da lì. Ogni modifica è immediatamente visibile sul sito pubblico.

## Se qualcosa non funziona
- **"Nessun giocatore inserito" anche dopo averli aggiunti**: controlla di aver inserito correttamente le 3 variabili Supabase su Vercel (Project Settings → Environment Variables), poi rifai il deploy
- **Non riesci ad accedere a /admin**: verifica di aver impostato `ADMIN_PASSWORD` su Vercel e che coincida con quella digitata
- **Errori durante il deploy**: controlla di aver caricato TUTTE le cartelle (comprese quelle che iniziano con un punto come .gitignore non è obbligatoria, ma app/, lib/, public/ sì)
