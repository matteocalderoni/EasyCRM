import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Navbar, Nav } from 'react-bootstrap'
import { LanguageSelect } from './Select/LanguageSelect';

function FooterNav({appSiteId, sitePageId, onSave, onLanguageChange, languageCode}) {

    return (
        <Navbar fixed="bottom" className="flex items-center bg-blue-800">
            <Nav className="flex w-full items-center justify-center space-x-3 md:space-x-1 text-sm font-medium mr-auto">
                {onSave &&
                <Button onClick={() => onSave()} className="flex items-center mr-3 justify-center rounded-full bg-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span className='hidden md:block'>Salva</span>
                </Button>}
                {onSave == null &&
                <Link className="flex items-center justify-center rounded-full bg-blue-200 p-1 text-blue-900" to={`/admin/sites/edit/${appSiteId}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span className='hidden md:block'>Modifica sito</span>
                </Link>}
                <Link to={`/admin/sites/sitepages/${appSiteId}`} title="Pagine del sito" 
                    className="flex items-center justify-center rounded-full bg-blue-200 p-1 text-blue-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                    <span className='hidden md:block'>Pagine</span>
                </Link>
                {sitePageId > 0 && 
                <Link title="Vai a gestione contenuti della pagina" to={`/admin/sites/sitepages/pageboxes/${appSiteId}/${sitePageId}`} 
                    className="flex items-center justify-center rounded-full  bg-blue-400 text-white p-2 ml-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                    <span className='hidden md:block'>Contenitori</span>
                </Link>}
                <Link to={`/admin/sites/sitelanguages/${appSiteId}`} title="Lingue del sito" className="flex items-center justify-center rounded-full bg-blue-200 p-1 text-blue-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    <span className='hidden md:block'>Lingue</span>
                </Link>
                <Link to={`/admin/sites/siteproducts/${appSiteId}`} title="Prodotti del sito" className="flex items-center justify-center rounded-full bg-blue-200 p-1 text-blue-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className='hidden md:block'>Prodotti</span>
                </Link>
                <Link to={`/admin/sites/sitesurveys/${appSiteId}`} title="Lingue del sito" className="flex items-center justify-center rounded-full bg-blue-200 p-1 text-blue-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span className='hidden md:block'>Percorsi</span>
                </Link>
                <Link to={`/admin/sites/siteorders/${appSiteId}`} title="Ordini del sito" className="flex items-center justify-center rounded-full bg-blue-200 p-1 text-blue-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                    <span className='hidden md:block'>Ordini</span>
                </Link>
                <Link className="flex items-center justify-center rounded-full bg-blue-200 p-1 text-blue-900" to={`/admin/sites/users/${appSiteId}`}>                        
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className='hidden md:block'>Utenti</span>
                </Link>
            </Nav>

            <Form inline className="hidden items-center justify-center md:block">
                <LanguageSelect appSiteId={appSiteId} onLanguageChange={(code) => onLanguageChange(code)} />      
            </Form>                
        </Navbar> 
    )
}

export { FooterNav }