import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron, Image, Container,Breadcrumb} from 'react-bootstrap';
import { appSiteService } from '../../_services';
import parse from 'html-react-parser';

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

function List({ match }) {
    const { path } = match;
    const [appSites, setAppSites] = useState(null)

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        appSiteService.getAppSites('',0,0).then((x) => { 
            setLoading(false)
            setAppSites(x.result)}
        );
    }, []);

    function deleteAppSite(appSiteId) {
        setLoading(true)
        setAppSites(appSites.map(x => {
            if (x.appSiteId === appSiteId) { x.isDeleting = true; }
            return x;
        }));
        appSiteService.deleteAppSite(appSiteId).then(() => {            
            setLoading(false)
            setAppSites(appSites => appSites.filter(x => x.appSiteId !== appSiteId));
        });
    }

    return (
        <Container>
            <Breadcrumb>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>                
                <Breadcrumb.Item href="/admin">Admin</Breadcrumb.Item>                
                <Breadcrumb.Item active>Siti</Breadcrumb.Item>
            </Breadcrumb>
            <Jumbotron>
                <h1>Siti</h1>
                <p>Elenco dei siti disponibili.</p>
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
                                {parse(appSite.description)}
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
                    {!appSites && loading &&
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