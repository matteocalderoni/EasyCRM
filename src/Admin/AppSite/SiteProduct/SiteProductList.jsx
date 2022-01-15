import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Navbar, Nav } from 'react-bootstrap';
import { DeleteConfirmation } from '../../../_components/DeleteConfirmation';
import { BsPencil} from 'react-icons/bs';
import { FcHome } from 'react-icons/fc';
import { productService } from '../../../_services';
import { SiteProductModal } from './SiteProductModal';

function SiteProductList({ match }) {
    const appSiteId = parseInt(match.params.appSiteId);
    const [siteProducts, setSiteProducts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [total, setTotal] = useState(0);
  
    useEffect(() => {
        getSiteProducts()
    },[searchText])
    
    function getSiteProducts() {
        productService.getSiteProducts(searchText,0,0,appSiteId)
            .then((_siteProducts) => { 
                setTotal(_siteProducts.totalCount)
                setSiteProducts(_siteProducts.result)
            });
        // eslint-disable-next-line    
    }

    function deleteSiteProduct(siteProductId) {
        setSiteProducts(siteProducts.map(x => {
            if (x.siteProductId === siteProductId) { x.isDeleting = true; }
                return x;
        }));
        productService.deleteSiteProduct(appSiteId, +siteProductId).then(() => {            
            getSiteProducts()
        });                
    }

    return (
    <Container fluid>
        <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to={`/`}><FcHome /></Link></li>                
            <li className="breadcrumb-item"><Link to={`/admin`}>Dashboard</Link></li>                
            <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>
            <li className="breadcrumb-item active">Elenco Prodotti ({total})</li>
        </ul>

        <div className='mt-2'>
            <input type='text' placeholder='Ricerca Prodotti' className='form-control' onChange={(e) => setSearchText(e.target.value)}></input>
        </div>
        
        <div className="mt-2">
            {siteProducts && siteProducts.map(siteProduct =>                                    
                <div className="block mt-1" key={siteProduct.siteProductId}>
                    <Card>
                        <Card.Header className="bg-gray-200 rounded-lg">
                            <div className="flex space-x-2">             
                                <div className='flex-1'>
                                    <p className='font-semibold'>{siteProduct.code}</p>                                                        
                                </div>
                                <Link title="Modifica prodotti" to={`/admin/sites/siteproducts/edit/${appSiteId}/${siteProduct.siteProductId}`} 
                                    className="rounded-full flex bg-blue-500 p-2 pl-3 pr-3 text-white">
                                    <BsPencil />
                                </Link>
                                <div className="p-1 rounded-full block bg-red-500 text-white">
                                    <DeleteConfirmation onConfirm={() => deleteSiteProduct(siteProduct.siteProductId)} />
                                </div>                            
                            </div>                                                        
                        </Card.Header>                                                
                    </Card>                                            
                </div>                    
            )}   
        </div>
        <Navbar fixed="bottom" variant="dark" bg="dark">
            <Nav className="mr-right">
                <SiteProductModal appSiteId={appSiteId} siteProductId={0} handleAddEdit={(appSiteId) => getSiteProducts()} /> 
                
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

export { SiteProductList };