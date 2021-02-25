import React from 'react';
import { PageBoxAddEdit } from './PageBoxAddEdit';
import { Jumbotron } from 'react-bootstrap';

function PageBoxDetail({ match }) {
    const { appSiteId, pageId, boxId } = match.params;  

    return (
        <>
            <Jumbotron>
                <h1>Gestione del contenuto</h1>
                <p>Modifica dettagli</p>                    
            </Jumbotron>
            <PageBoxAddEdit appSiteId={appSiteId} sitePageId={pageId} pageBoxId={boxId} sortId={1} />            
        </>
    );
}

export { PageBoxDetail }