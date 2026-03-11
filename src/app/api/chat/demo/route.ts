import { SYSTEM_PROMPT } from '@/lib/types'

export const runtime = 'nodejs'

// Demo responses simulating a Danish legal AI assistant
const DEMO_RESPONSES: Record<string, string> = {
  default: `Tak for dit spørgsmål. Som din juridiske AI-assistent vil jeg gerne hjælpe dig.

**Bemærk:** Denne besked er genereret i demo-tilstand. For at få rigtige AI-svar skal du tilføje gyldige API-nøgler med credits i \`.env.local\`.

Jeg kan hjælpe med følgende juridiske områder:
- **Selskabsret** (selskabsloven, ApS og A/S)
- **Aftaleret** (aftaleloven, købeloven)
- **Erhvervslejeret** (erhvervslejeloven)
- **Arbejdsret** i erhvervsmæssig kontekst
- **EU-ret** som implementeret i dansk lovgivning
- **Konkurrenceret** og markedsføringsret

Stil venligst et specifikt juridisk spørgsmål, så giver jeg dig et detaljeret svar med lovhenvisninger.`,

  aps_as: `## Forskellen mellem ApS og A/S

Der er flere væsentlige forskelle mellem et **anpartsselskab (ApS)** og et **aktieselskab (A/S)** i dansk ret:

### 1. Kapitalkrav
- **ApS:** Minimumkapital på **40.000 kr.** (selskabslovens § 4, stk. 2)
- **A/S:** Minimumkapital på **400.000 kr.** (selskabslovens § 4, stk. 2)

### 2. Ledelsesstruktur
- **ApS:** Kan nøjes med én **direktør**. Bestyrelse er valgfri (selskabslovens § 111)
- **A/S:** Skal have enten en **bestyrelse + direktion** eller et **tilsynsråd + direktion** (selskabslovens § 111, stk. 1)

### 3. Omsættelighed af kapitalandele
- **ApS:** Anparter er **ikke frit omsættelige** som udgangspunkt. Der gælder samtykkekrav (selskabslovens § 48)
- **A/S:** Aktier er som udgangspunkt **frit omsættelige** (selskabslovens § 48)

### 4. Børsnotering
- **ApS:** Kan **ikke** børsnoteres
- **A/S:** Kan **børsnoteres** på Nasdaq Copenhagen

### 5. Revision
- **ApS:** Kan under visse betingelser **fravælge revision** (årsregnskabslovens § 135)
- **A/S:** Skal altid have **revisor** tilknyttet

### Lovgrundlag
Begge selskabsformer reguleres af **selskabsloven (lov nr. 470 af 12. juni 2009)** med senere ændringer.

*⚠️ Demo-tilstand — dette er et simuleret svar.*`,

  erhvervsleje: `## Opsigelse af erhvervslejekontrakt

Opsigelse af erhvervslejemål reguleres primært af **erhvervslejeloven (lov nr. 1714 af 16. december 2010)**.

### Udlejers opsigelsesmuligheder (§ 61)
Udlejer kan opsige, når:
1. **Udlejer selv vil benytte det lejede** (§ 61, stk. 2, nr. 1)
2. **Nedrivning eller ombygning** gør fortsat brug umulig (§ 61, stk. 2, nr. 2)
3. **Lejers misligholdelse** (§ 61, stk. 2, nr. 3)
4. **Andre vægtige grunde** (§ 61, stk. 2, nr. 4)

### Opsigelsesvarsler
- **Sædvanligt varsel:** 1 år for erhvervslejemål (§ 61, stk. 3)
- Kan være aftalt anderledes i kontrakten

### Lejers indsigelsesret (§ 62)
Lejer kan gøre indsigelse mod opsigelsen inden **6 uger**. Udlejer skal herefter anlægge sag ved boligretten inden yderligere **6 uger**, ellers bortfalder opsigelsen.

### Erstatning (§ 66)
Lejer har som udgangspunkt krav på erstatning ved opsigelse, medmindre opsigelsen skyldes misligholdelse.

*⚠️ Demo-tilstand — dette er et simuleret svar.*`,

  konkurrenceret: `## Konkurrencelovens § 6

**Konkurrencelovens § 6** (lov nr. 155 af 1. marts 2018) indeholder forbuddet mod konkurrencebegrænsende aftaler.

### Hovedreglen (§ 6, stk. 1)
Det er forbudt at indgå aftaler, der har til **formål eller følge** at begrænse konkurrencen. Dette omfatter bl.a.:
1. **Prisfastsættelse** — direkte eller indirekte fastsættelse af købs- eller salgspriser
2. **Markedsdeling** — opdeling af markeder eller forsyningskilder
3. **Produktionsbegrænsning** — begrænsning af produktion, afsætning eller teknisk udvikling
4. **Diskrimination** — anvendelse af ulige vilkår over for handelspartnere

### Bagatelreglen (§ 7)
Aftaler undtages hvis:
- Samlet markedsandel **under 10%** (konkurrenter)
- Samlet markedsandel **under 15%** (ikke-konkurrenter)

### EU-retlig parallel
§ 6 svarer til **TEUF artikel 101** (tidligere EF-traktatens art. 81). Dansk praksis følger i vidt omfang EU-Kommissionens og EU-Domstolens fortolkning.

### Sanktioner
Overtrædelse kan medføre **bøde** op til 10% af virksomhedens årlige omsætning samt **erstatningsansvar** over for skadelidte.

*⚠️ Demo-tilstand — dette er et simuleret svar.*`,

  bestyrelse: `## Krav til bestyrelse i A/S-selskaber

Kravene til bestyrelsen i et A/S reguleres af **selskabsloven (lov nr. 470 af 12. juni 2009)**.

### Sammensætning
- Bestyrelsen skal bestå af **mindst 3 medlemmer** (selskabslovens § 120, stk. 1)
- Flertallet af bestyrelsesmedlemmer skal være **ikke-direktører** (§ 120, stk. 2)
- Formanden vælges af bestyrelsen (§ 121)

### Valg og valgperiode
- Bestyrelsesmedlemmer vælges af **generalforsamlingen** (§ 120, stk. 1)
- Valgperioden er **højst 4 år** ad gangen (§ 120, stk. 3)
- Medarbejdervalgte bestyrelsesmedlemmer i selskaber med **≥ 35 ansatte** (§ 140)

### Bestyrelsens opgaver (§ 115)
1. **Overordnet ledelse** af selskabet
2. **Tilsyn** med direktionens ledelse
3. **Sikre forsvarlig organisation** af virksomheden
4. Påse at **bogføring og regnskab** foregår tilfredsstillende
5. Sikre tilstrækkelig **likviditet** og **kapitalberedskab**

### Ansvar
Bestyrelsesmedlemmer kan ifalde **erstatningsansvar** efter dansk rets almindelige culpa-regel, jf. selskabslovens § 361.

*⚠️ Demo-tilstand — dette er et simuleret svar.*`,
}

function matchResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase()
  if (msg.includes('aps') || msg.includes('a/s') || msg.includes('anparts') || msg.includes('aktieselskab') || msg.includes('forskel'))
    return DEMO_RESPONSES.aps_as
  if (msg.includes('erhvervsleje') || msg.includes('opsig') || msg.includes('lejekontrakt'))
    return DEMO_RESPONSES.erhvervsleje
  if (msg.includes('konkurrence') || msg.includes('§6') || msg.includes('§ 6') || msg.includes('karteller'))
    return DEMO_RESPONSES.konkurrenceret
  if (msg.includes('bestyrelse') || msg.includes('krav til') || msg.includes('direktion'))
    return DEMO_RESPONSES.bestyrelse
  return DEMO_RESPONSES.default
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'Beskeder mangler' }, { status: 400 })
    }

    const lastUserMessage = [...messages].reverse().find((m: { role: string }) => m.role === 'user')
    const responseText = matchResponse(lastUserMessage?.content || '')

    // Simulate streaming by sending chunks with delays
    const encoder = new TextEncoder()
    const words = responseText.split(' ')

    const readableStream = new ReadableStream({
      async start(controller) {
        for (let i = 0; i < words.length; i++) {
          const word = (i === 0 ? '' : ' ') + words[i]
          controller.enqueue(encoder.encode(word))
          // Simulate typing speed
          await new Promise((resolve) => setTimeout(resolve, 20 + Math.random() * 30))
        }
        controller.close()
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (err) {
    console.error('Demo API error:', err)
    return Response.json({ error: 'Demo fejl' }, { status: 500 })
  }
}
