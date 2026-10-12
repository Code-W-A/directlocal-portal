# Profil de firmă

URL unic `/firme/[firma]/`; firma se înregistrează o singură dată.

Afișează numele comercial, descriere factuală, contact public, sediu declarat separat de serviciile și localitățile deservite, surse și datele consultării. Când adresa nu este confirmată, spune asta; nu completa câmpurile cu presupuneri.

Fiecare fapt are dovezi: `evidence` pentru identitate/descriere/contact, `headquarters.sourceIds` pentru sediu, `offerings.sourceIds` pentru serviciu și `coverage[].sourceIds` pentru asocierea serviciu–localitate. Toate referințele indică surse existente în profil.

`LocalBusiness` se generează numai în profil, din aceleași date afișate. Fără ratings, reviews, priceRange, program sau certificări nesusținute. Numele juridic nu este dedus din brand. O adresă incompletă poate limita eligibilitatea rezultatelor îmbogățite Google.
