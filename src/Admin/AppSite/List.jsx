import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron, Image, Container,Breadcrumb} from 'react-bootstrap';
import { appSiteService } from '../../_services';

const baseImageUrl = `${process.env.REACT_APP_API_URL}/Resources/Images/`;

function List({ match }) {
    const { path } = match;
    const [appSites, setAppSites] = useState(null);

    useEffect(() => {
        appSiteService.getAppSites('',0,0).then(x => setAppSites(x.result));
    }, []);

    function deleteAppSite(appSiteId) {
        setAppSites(appSites.map(x => {
            if (x.appSiteId === appSiteId) { x.isDeleting = true; }
            return x;
        }));
        appSiteService.deleteAppSite(appSiteId).then(() => {
            setAppSites(appSites => appSites.filter(x => x.appSiteId !== appSiteId));
        });
    }

    return (
        <Container>
            <Breadcrumb>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>                
                <Breadcrumb.Item href="/admin">Admin</Breadcrumb.Item>                
                <Breadcrumb.Item active>Ristoranti</Breadcrumb.Item>
            </Breadcrumb>
            <Jumbotron>
                <h1>Ristoranti</h1>
                <p>Elenco dei ristoranti disponibili: ogni sito viene collegato a un singolo ristorante e visualizza le relative informazioni.</p>
            </Jumbotron>
            
            <Link to={`${path}/add/0`} className="btn btn-sm btn-success mb-2">nuovo</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '10%' }}>Logo</th>
                        <th style={{ width: '70%' }}>Name</th>
                        <th style={{ width: '20%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {appSites && appSites.map(appSite =>
                        <tr key={appSite.appSiteId}>
                            <td><Image src={baseImageUrl+appSite.companyLogo} fluid /></td>
                            <td>
                                <b>{appSite.name}</b><br />
                                <p>{appSite.homeDescription}</p>
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`${path}/edit/${appSite.appSiteId}`} className="btn btn-sm btn-primary mr-1">dettagli</Link>
                                <Link to={`${path}/sitepages/${appSite.appSiteId}`} className="btn btn-sm btn-primary mr-1">pagine</Link>
                                <button onClick={() => deleteAppSite(appSite.appSiteId)} className="btn btn-sm btn-danger" style={{ width: '60px' }} disabled={appSite.isDeleting}>
                                    {appSite.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>elimina</span>
                                    }
                                </button>
                            </td>
                        </tr>
                    )}
                    {!appSites &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <span className="spinner-border spinner-border-lg align-center"></span>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </Container>
    );
}

export { List };