import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { DeleteConfirmation } from '../../../../_components/DeleteConfirmation';
import { BsPencil} from 'react-icons/bs';
import { FcHome } from 'react-icons/fc';
import { productService } from '../../../../_services';
import { SiteProductTypeModal } from './SiteProductTypeModal';
import parse from 'html-react-parser';

function SiteProductTypeList({ match }) {
    const appSiteId = parseInt(match.params.appSiteId);
    const [siteProductTypes, setSiteProductTypes] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [total, setTotal] = useState(0);
  
    useEffect(() => {
        getSiteProductTypes()
    },[searchText])
    
    function getSiteProductTypes() {
        productService.getSiteProductTypes(searchText,0,0,appSiteId)
            .then((_siteProductTypes) => { 
                setTotal(_siteProductTypes.totalCount)
                setSiteProductTypes(_siteProductTypes.result)
            });
    }

    function deleteSiteProductType(siteProductTypeId) {
        setSiteProductTypes(siteProductTypes.map(x => {
            if (x.siteProductTypeId === siteProductTypeId) 
                x.isDeleting = true; 
            return x;
        }));
        productService.deleteSiteProductType(appSiteId, +siteProductTypeId)
            .then(() => getSiteProductTypes());                
    }

    return (
    <Container fluid>
        <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to={`/`}><FcHome /></Link></li>                
            <li className="breadcrumb-item"><Link to={`/admin`}>Dashboard</Link></li>                
            <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>
            <li className="breadcrumb-item"><Link to={`/admin/sites/siteproducts/${appSiteId}`}>Elenco Prodotti</Link></li>
            <li className="breadcrumb-item active">Elenco Tipi Prodotti ({total})</li>
        </ul>

        <div className='mt-2'>
            <input type='text' placeholder='Ricerca Prodotti' className='form-control' onChange={(e) => setSearchText(e.target.value)}></input>
        </div>
        
        <div className="mt-2 flex flex-wrap space-x-2">
            {siteProductTypes && siteProductTypes.map(siteProductType =>                                    
                <div className="mt-2 rounded-xl border w-96 mx-auto overflow-hidden" key={siteProductType.siteProductTypeId}>
                    <div className="p-8 h-36 overflow-hidden">
                        <span className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
                            {siteProductType.code}
                        </span>
                        <div className="mt-2 text-slate-500">
                            {siteProductType.description && parse(siteProductType.description)}
                        </div>
                    </div>
                    <div className='flex p-2 space-y-2'>
                        <Link title="Modifica prodotti" to={`/admin/sites/siteproducts/siteproducttypes/edit/${appSiteId}/${siteProductType.siteProductTypeId}`} 
                            className="rounded-full flex bg-blue-500 p-2 pl-3 pr-3 text-white">
                            <BsPencil />
                        </Link>
                        <div className="p-1 rounded-full block bg-red-500 text-white">
                            <DeleteConfirmation onConfirm={() => deleteSiteProductType(siteProductType.siteProductTypeId)} />
                        </div>                                                    
                    </div>                    
                </div>                    
            )}   
        </div>
        <Navbar fixed="bottom" variant="dark" bg="dark">
            <Nav className="mr-right">
                <SiteProductTypeModal appSiteId={appSiteId} siteProductTypeId={0} handleAddEdit={(appSiteId) => getSiteProductTypes()} /> 
                
                <Link to={`/admin/sites/edit/${appSiteId}`}
                    className="flex items-center justify-center rounded-full  bg-blue-500 text-white p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Modifica sito
                </Link>
            </Nav>
        </Navbar>
    </Container>
  );
};

export { SiteProductTypeList };