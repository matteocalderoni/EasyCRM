import React, { useState, useEffect } from 'react';

function BoxTypeInfo({ boxType, boxId }) {
    const [isOpen, setIsOpen] = useState(false)
    const [boxTitle, setBoxTitle] = useState('');
    const [boxDescription, setBoxDescription] = useState('');

    useEffect(() => {
        if (boxType === 1) {
            setBoxTitle('Testo')
            setBoxDescription('Il contenitore di testo permette di inserire un paragrafo di massimo 2000 caratteri. Il testo può essere formattato con colore, dimensione e stile.')
        }
        if (boxType === 2) {
            setBoxTitle('Servizi')
            setBoxDescription('Il contenitore Servizi permette di inserire una serie di riquadri con immagine e testo. Puoi scegliere la dimensione dei riquadri per creare layout differenti.')
        }
        if (boxType === 3) {
            setBoxTitle('Dipendenti/Team')
            setBoxDescription('Il contenitore Dipendenti permette di creare le schede dei componenti della vostra squadra. Viene aggiunta una foto e i testi.')
        }
        if (boxType === 4) {
            setBoxTitle('Giorni Lavorativi')
            setBoxDescription('Il contenitore Giorni Lavorativi permette di inserire i giorni di attività con i relativi orari.')
        }
        if (boxType === 5) {
            setBoxTitle('Prodotti')
            setBoxDescription('Il contenitore Prodotti permette di inserire i prodotti con i lori prezzi.')
        }
        if (boxType === 6) {
            setBoxTitle('Blog')
            setBoxDescription('Il contenitore Blog permette di inserire le news da mostrare ai propri utenti.')
        }
        if (boxType === 7) {
            setBoxTitle('Google Maps')
            setBoxDescription('Il contenitore Google Maps permette di inserire la mappa: indicare le coordinate latitudine e longitudine.')
        }
        if (boxType === 8) {
            setBoxTitle('Immagine')
            setBoxDescription('Il contenitore Immagine permette di inserire un immagine singola.')
        }
        if (boxType === 9) {
            setBoxTitle('Testo Immagine')
            setBoxDescription('Il contenitore Testo Immagine permette di inserire una card con immagine e testo formattabile.')
        }
        if (boxType === 10) {
            setBoxTitle('Contattaci')
            setBoxDescription('Il contenitore Contattaci permette di inserire un form compilabile per ricevere le richieste dagli utenti del sito.')
        }
        if (boxType === 11) {
            setBoxTitle('Facebook')
            setBoxDescription('Il contenitore Facebook permette di inserire la bacheca della pagina facebook selezionata: indicare indirizzo.')
        }
        if (boxType === 12) {
            setBoxTitle('Instagram')
            setBoxDescription('Il contenitore Instagram permette di inserire le 8 ultime foto della pagina instagram.')
        }
        if (boxType === 13) {
            setBoxTitle('Video Youtube')
            setBoxDescription('Il contenitore Video Youtube permette di inserire un video tramite il link a Youtube.')
        }
        if (boxType === 14) {
            setBoxTitle('Percorso')
            setBoxDescription('Il contenitore Percorso permette di inserire un percorso tra quelli creati.')
        }
        if (boxType === 15) {
            setBoxTitle('Slide')
            setBoxDescription('Il contenitore Slide permette di inserire una slide con una serie di immagini.')
        }
    }, [boxType])    
    
    return (
        <div>
            <button className="flex ml-1 z-10 h-full items-center p-1 mr-1 bg-gray-500 border-0 rounded-full" onClick={() => setIsOpen(!isOpen)}>
                <span className='text-white'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </span>
            </button>
            {isOpen && 
            <div className="absolute top-0 left-16 m-1 bg-white rounded-lg border shadow-xl w-56">
                <div className='bg-gray-200 p-2'>
                    <h3>{boxTitle}</h3>
                </div>
                <div className='p-2'>
                    <p>{boxDescription}</p>
                </div>
            </div>}
    </div>
    );
}

export { BoxTypeInfo };