import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { HiOutlinePhotograph } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { accountService } from '../_services';

function Home() {
    const user = accountService.userValue;
    
    return (
        <Container fluid className="pt-4">
            <div className="shadow rounded-xl mt-16 bg-gray-100 p-4">
                <h1 className="font-bold text-green-900">Benvenuto {user.firstName} {user.lastName}!</h1>
                <p className="text-grey-100">Easy<b className="text-red-800">CRM</b> è un <b className="text-red-800">C</b>ontent <b className="text-red-800">R</b>apid <b className="text-red-800">M</b>anagament: un sistema rapido e semplice per gestire i contenuti online.</p>
                <small>Questa piattaforma si basa sua una gestione <b>semplice</b> e <b>intuitiva</b> per pubblicare i <b>tuoi contenuti online</b>.<br />
                Ti permette di creare rapidamente delle <b>nuove PAGINE</b> e con i <b>CONTENITORI</b> disponibili puoi rapidamente aggiungere testo, immagini e molto altro.</small>                
            </div>            
            <div className="md:flex mt-8">
                <div className="md:m-2">
                    <Card className="shadow">
                        <Card.Header className="bg-blue-50">
                            <Card.Title className="text-blue-900">Profilo utente</Card.Title>
                        </Card.Header>
                        <Card.Body> 
                            <Card.Text>
                                Gestione profilo personale: modifica email e/o password.
                                Tramite questa sezione puoi modificare email e password per accedere ad area riservata.
                            </Card.Text>                            
                        </Card.Body>
                        <Card.Footer className="d-flex justify-content-end bg-blue-100">
                            <Link to="/profile" variant="primary" className="text-white bg-blue-900 p-2 rounded">Vai</Link>
                        </Card.Footer>                            
                    </Card>
                </div>
                <div className="md:m-2 mt-2">
                    <Card className="flex shadow">
                        <Card.Header className="bg-blue-50">
                            <Card.Title className="text-blue-900">Dashboard</Card.Title>
                        </Card.Header>
                        <Card.Body>                            
                            <Card.Text>
                                Gestione siti e altre impostazioni.
                                In questa sezione trovi le funzioni principali per la gestione dei tuoi siti: 
                                aggiungere testi, immagini, lingue differenti, mappe e molto altro.                                
                            </Card.Text>                            
                        </Card.Body>
                        <Card.Footer className="d-flex justify-content-end bg-blue-100">
                            <Link to="/admin" variant="primary" className="text-white bg-blue-900 p-2 rounded">Vai</Link>
                        </Card.Footer>
                    </Card>
                </div>                
            </div>

            <Card className="mt-2">
                <Card.Header className="text-blue-800">
                    Note sui rilasci: tutti gli aggiornamenti vengono documentati in questa sezione.
                </Card.Header>
                <Card.Body>
                    <ul className="list-group">
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.4.5.29 (Aprile 2022)</b>: ecco gli ultimi aggiornamenti:                             
                            <ul className="list-disc ml-3">  
                                <li><b>Ricerca</b>: abbiamo integrato la un motore di ricerca nel sito pubblico (libreria Meilisearch). Questa funzione utilizza un indice ad alte prestazioni che viene aggiornato ad ogni modifica su pagine e contenuti.</li>                                                              
                                <li><b>Pagamento opzionale</b>: permetti agli utenti di pagare alla consegna (rimuove obbligo del pagamento online per concludere un ordine).</li>                                                              
                                <li><b>Nuovi Bottoni e Navigazione fondo pagina</b>: abbiamo aggiornato i bottoni più importanti per poterli utilizzare comodamente in tutti i layout. 
                                    Inoltre abbiamo aggiornato la barra di navigazione in fondo alla pagina permettendo di passare rapidamente nelle varie sezioni di gestione del sito.</li>                                                              
                                <li><b>bug</b>: sistemazione dei problemi che ci segnalate, grazie per la vostra fondamentale collaborazione.</li>                                
                            </ul>                            
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.4.4.28 (Marzo 2022)</b>: ecco gli ultimi aggiornamenti:                             
                            <ul className="list-disc ml-3">  
                                <li>Nuova gestione <b>Prodotti</b>: abbiamo aggiunto 4 modelli diversi per esporre i prodotti del sito. Tramite i prodotti è possibile creare contenitori riutilizzabili. In fase di sviluppo la possibilità di collegare i prodotti per creare delle opzioni o dei gruppi.</li>                                                              
                                <li><b>Disponibilità</b>: è possibile assegnare una disponibilità ai prodotti per limitare gli acquisti. Appena il prodotto viene aggiunto al carello viene rimosso da disponibilità. Lasciare a -1 per disponibilità illimitata.</li>
                                <li><b>Mail di conferma</b>: invio della mail solo dopo il pagamento effettuato. Nuovo modello della mail con dettagli di pagamento.</li>
                                <li><b>bug</b>: sistemazione dei problemi che ci segnalate, grazie per la vostra fondamentale collaborazione.</li>                                
                            </ul>                            
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.4.3.27 (Marzo 2022)</b>: ecco gli ultimi aggiornamenti:                             
                            <ul className="list-disc ml-3">  
                                <li><b>Percorsi</b>: nuovo layout per i percorsi. Abbiamo lavorato molto per migliorare la compilazione di un percorso: il contenitore apre una finestra con layout unico per fisso e mobile, nella finestra sono visibili tutte le informazioni importanti.</li>                              
                                <li><b>Ordini</b>: visualizzazione del percorso nell'ordine. Da adesso è possibile visualizzare in dettaglio la selezione effettuata da utente.</li>                              
                                <li><b>bug</b>: sistemazione dei problemi che ci segnalate, grazie per la vostra fondamentale collaborazione.</li>                                
                            </ul>                            
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.4.3.26 (Marzo 2022)</b>: ecco gli ultimi aggiornamenti:                             
                            <ul className="list-disc ml-3">                                
                                <li><b>Nuovi Font</b>: aggiunta di numerosi font nuovi.</li>
                                <li><b>bug</b>: sistemazione dei problemi che ci segnalate, grazie per la vostra fondamentale collaborazione.</li>                                
                            </ul>                            
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.4.3.25 (Febbraio 2022)</b>: ecco gli ultimi aggiornamenti:                             
                            <ul className="list-disc ml-3">
                                <li><b>Contenitore Prodotto</b>: è possibile inserire un singolo prodotto al posto del catalogo.</li>
                                <li><b>margin e padding</b>: gestione di spazio interno ed esterno di contenitore (da 0 a 5).</li>                                                                                                                              
                                <li><b>notifiche whattsapp</b>: invio di messaggi whattsapp tramite Twilio per notifiche rapide sugli ordini.</li>                                                                                                                              
                                <li>riduzione layout: le pagine dispono di 3 layout al posto di 5.</li>
                                <li><b>bug</b>: sistemazione dei problemi che ci segnalate, grazie per la fondamentale collaborazione.</li>                                
                            </ul>                            
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.4.3.24 (Gennaio 2022)</b>: ecco gli ultimi aggiornamenti:                             
                            <ul className="list-disc ml-3">
                                <li><b>gestione pagamenti</b>: tramite il gestore Stripe è possibile ricevere pagamenti online con carte e altri formati.</li>                                
                                <li><b>forma per contenitori</b>: i contenitori di testo e immagine possono essere inseriti in diverse forme (quadrato, cerchio).</li>                                                                
                                <li><b>info su risoluzioni</b>: dalla gestione contenitori è possibile visualizzare la risoluzione attiva.</li>                                                                
                                <li>colore sfondo di prodotto: è possibile assegnare un colore di sfondo del prodotto per tutti i contenitori a cui viene asseganto.</li>                                                                
                                <li><b>bug</b>: sistemazione dei problemi che ci segnalate, grazie per la fondamentale collaborazione.</li>                                
                            </ul>                            
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.4.2.23 (Gennaio 2022)</b>: ecco gli ultimi aggiornamenti:                             
                            <ul className="list-disc ml-3">
                                <li><b>gestione prodotti</b>: creazione dei prodotti per lo shop e abbinamento al contenitore catalogo.</li>                                
                                <li><b>contenitore IFrame</b>: tramite questo contenitore è possibile inserire un IFrame con contenuti dinamici.</li>                                
                                <li><b>allineamento navigazione</b>: la barra di navigazione può essere allineata a sinistra, centro o destra.</li>                                
                                <li><b>colorazione fondo pagina</b>: è possibile assegnare un colore specifico per ogni fondo pagina, diverso dal menù di navigazione.</li>                                
                                <li><b>collegamento prodotti a percorsi</b>: adesso le risposte dei percorsi possono essere dei prodotti.</li>                                
                                <li><b>bug</b>: sistemazione campi numerici decimali.</li>                                
                            </ul>                            
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.4.2.22 (Dicembre 2021)</b>: ecco gli ultimi aggiornamenti:                             
                            <ul className="list-disc ml-3">
                                <li><b>trascinamento dei contenitori</b>: per ordinare i contenitori delle pagine puoi trascinarli comodamente, oppure inserire manualmente ordine.</li>                                
                                <li><b>ricerca delle pagine</b>: è possibile ricercare le pagine del sito per titolo o tipo (default, privacy o landing).</li>                                                                
                            </ul>                            
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.4.1.21 (Dicembre 2021)</b>: grosse novità in questo aggiornamento:                             
                            <ul className="list-disc ml-3">
                                <li>completamento dei percorsi: finalmente è possibile utilizzare i percorsi nei siti e creare moduli personalizzati per ottenere ordini di prodotti o sondaggi su specifiche tematiche. Aspettiamo i vostri feedback per migliorare continuamente il servizio.</li>
                                <li><b>iscrizione utenti pubblici</b>: da adesso gli utenti che visitano il vostro sito possono registrarsi per ottenere funzionalità aggiuntive. Ad esempio effettuare ordini o visualizzare pagine o contenuti speciali. Le pagine e i contenitori possono essere attivate solo per gli utenti loggati.</li>
                                <li><b>carrello per ordini</b>: è possibile effettuare ordini direttamente dal sito e visualizzare lo storico tramite la nuova sezione apposita.</li>                                                            
                            </ul>                            
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.4.0.20-preview (Dicembre 2021)</b>: 
                            <ul className="list-disc ml-3">
                                <li>aggiunta selezione posizione della barra di navigazione (fisso sopra o sotto, o scorrevole con la pagina).</li>
                                <li>nuovo layout per la gestione dei contenitori nella pagina: adesso è possibile espandere tutti i contenitori in anteprima</li>
                                <li>aggiunto il tipo pagina: tramite questa funzione si possono creare pagine <b>Landing</b> (di approdo) per collegare i contenitori e creare percorsi di navigazione personalizzati</li>                            
                                <li>aggiunta immagine di sfondo per i contenitori</li>   
                                <li>aggiunta contenitore <b>Slideshow</b>: presenta le immagini con una comoda slideshow</li>
                                <li>preview: avanzamento dei lavori sui percorsi. Nota: aggiunta immagine per le risposte e risposta con upload file.</li>                         
                            </ul>                            
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.4.0.19-preview (Novembre 2021)</b>: aggiunta di <b>12 nuovi font</b> per i testi (Abril Fatface, Arvo, Concert One, Karla, Lora, Montserrat, Rakkas, Roboto, Yatra One, Exo 2, Comforter Brush, Estonia).
                            Aggiunto colore di sfondo per la pagina: tramite questa opzione è possibile selezionare un colore di sfondo per la pagina. 
                            Aggiunto colore per la barra di navigazione: colore diverso per ogni pagina.
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.4.0.18-preview (Novembre 2021)</b>: aggiunta dell'upload immagini nei contenitori di testo. Da adesso è possibile inserire delle immagini direttamente nei paragrafi di testo.
                            Tramite editor di testo selezionare icona <HiOutlinePhotograph className="inline text-xl" /> e tramite opzione <b>upload</b> è possibile caricare un immagine all'interno del paragrafo.
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.4.0.17-preview (Novembre 2021)</b>: Gestione <b>Percorsi</b>: tramite questa nuova funzione è possibile creare dei percorsi guidati per gli utenti che visitano il sito.
                            Ad esempio è possibile presentare un prodotto creando una serie di schede interattive per visualizzare le varie opzioni.
                            Oppure creare un modulo composto da varie domade divise in passaggi.
                            Tutto questo è integrato in un pratico contenitore quindi è possibile inserire i percorsi nella varie pagine proprio come già si fa per le altre tipologie di contenuti. 
                            Questo rilascio è una <b>preview</b> quindi per ora il contenitore Percorsi è disponibile solo nella sezione di amministrazione, a breve il rilascio per il sito pubblico con la relativa area di gestione delle varie rispote ottenute dagli utenti.
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.3.1.16 (Ottobre 2021)</b>: revisione completa layout pagina di modifica 'Dettagli Pagina': anteprima della slide per una migliore compilazione e disposizione ottimizzata dei campi. 
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.3.1.15 (Settembre 2021)</b>: piccole correzioni a layout e miglioramento dei commenti per compilazione dei moduli. 
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.3.1.14 (Agosto 2021)</b>: Nuova veste grafica per area di gestione. Versione molto più moderna e colorata. In arrivo anche la versione per il sito pubblico. 
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.2.8.12 (Aprile 2021)</b>: aggiunti 2 nuovi campi per la gestione dei titoli delle pagine. Titolo per identificare la pagina (usato per selezione) e titolo per menù separato da titolo di slide. 
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.2.7.11 (Marzo 2021)</b>: posizione del logo per le varie pagine. Possibilità di selezionare la posizione del logo per le singole pagine (al posto del valore fisso in cima alla pagina). Inoltre è possibile nascondere il logo. 
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.3.1.11 (Marzo 2021)</b>: in questo rilascio ci sono numerosi aggiornamenti:<br /> 
                            - modifica di titoli relativi a pagine e contenitori testo: possibilità di formattare il testo relativo a <b>Titolo di pagina</b> e <b>Titolo di Contenitori Testo</b>;<br />
                            - visualizzare anteprima di contenitori e sfondo della pagina in elenco contenitori;<br />
                            - modifica dei testi direttamente da anteprima di contenitore testo;<br />
                            - aggiunta feed di instagram con le ultime 8 foto pubblicate (in fase di sviluppo);
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.2.6.10 (Marzo 2021)</b>: aggiunta contenitore per la visualizzazione dei video Youtube. 
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.2.5.9 (Marzo 2021)</b>: aggiunta contenitore per la visualizzazione del Feed di una pagina Facebook. 
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.2.4.8 (Marzo 2021)</b>: aggiunta gestione privacy policy e cookie in rispetto delle norme relative alla GDPR. Nei dati del sito è presente una nuova voce per selezionare la pagina corrispondente (per non visualizzare la pagina nel menù principale non pubblicare la pagina). 
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.2.3.7 (Febbraio 2021)</b>: aggiunta la conferma per azioni di Elimina. 
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.2.2.6 (Febbraio 2021)</b>: gestione recapiti per contenitore Contattaci e gestione coordinare (latitudine e longitudine) in contenitore Mappa.
                            Numerosi miglioramenti a livello di layout: aggiunta barre di navigazione in fondo a pagine per ottimizzare gli spazi e la gestione da mobile.
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.2.1.5 (Febbraio 2021)</b>: gestione dimensioni dei contenitori e colore di background. Gestione sotto-pagine per estendere il numero di pagine.
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.1.3.4 (Febbraio 2021)</b>: 4 nuove dimensioni per alineare le card (servizi top, dipendenti, ecc).
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.1.2.3 (Gennaio 2021)</b>: modifica del componente per la formattazione dei testi. Aggiunta di numerose funzionalità: colore del testo, font, dimensione, tabelle e molte altre.
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.1.1.2 (Gennaio 2021)</b>: aggiunta icone e ottimizazione layout di elenchi e moduli, aggiunta 5 decimali per salvataggio coordinate google maps.
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.1.0.1 (Dicembre 2020)</b>: in questo rilascio è stato aggiunto il supporto multilingua. Con questa funzione è possibile gestire le traduzioni per visualizzare il sito in altre lingue.
                        </li>
                        <li className="list-group-item">
                            <b className="text-blue-800">Ver 1.0.0.0 (Novembre 2020)</b>: prima versione ufficiale.
                        </li>
                    </ul>
                </Card.Body>
            </Card>
        </Container>        
    );
}

export { Home };