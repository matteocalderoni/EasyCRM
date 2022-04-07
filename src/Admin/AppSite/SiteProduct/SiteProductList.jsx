import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { DeleteConfirmation } from '../../../_components/DeleteConfirmation';
import { BsPencil} from 'react-icons/bs';
import { FcHome } from 'react-icons/fc';
import { productService } from '../../../_services';
import { SiteProductModal } from './SiteProductModal';
import parse from 'html-react-parser';
import { FooterNav } from '../../../_components/FooterNav';

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

function SiteProductList({ match }) {
    const appSiteId = parseInt(match.params.appSiteId);
    const [siteProducts, setSiteProducts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [total, setTotal] = useState(0);
  
    useEffect(() => {
        getSiteProducts()
    },[searchText, appSiteId])
    
    function getSiteProducts() {
        productService.getSiteProducts(searchText,0,0,appSiteId)
            .then((_siteProducts) => { 
                setTotal(_siteProducts.totalCount)
                setSiteProducts(_siteProducts.result)
            });
    }

    function deleteSiteProduct(siteProductId) {
        setSiteProducts(siteProducts.map(x => {
            if (x.siteProductId === siteProductId) 
                x.isDeleting = true; 
            return x;
        }));
        productService.deleteSiteProduct(appSiteId, +siteProductId)
            .then(() => getSiteProducts());                
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
        
        <div className="mt-2 flex flex-wrap space-x-2">
            {siteProducts && siteProducts.map(siteProduct =>                                    
                <div className="mt-2 rounded-xl border w-80 mx-auto overflow-hidden" key={siteProduct.siteProductId} style={{backgroundColor: siteProduct.boxColor}}>
                    <div className="md:shrink-0">
                        <img className="h-24 w-full object-cover" src={baseImageUrl+siteProduct.imageUrl} alt={siteProduct.code} />
                    </div>
                    <div className="p-8 h-24 overflow-hidden">
                        <span className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
                            {siteProduct.code} ({siteProduct.internalCode})
                        </span>
                        {siteProduct.siteProductType && siteProduct.siteProductType.category === 1 && 
                        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                            € {siteProduct.price} - Qty {siteProduct.stockQuantity}
                        </div>}
                        {/* <div className="mt-2 text-slate-500">
                            {siteProduct.description && parse(siteProduct.description)}
                        </div> */}
                    </div>
                    <div className='flex items-center p-2 space-x-2 space-y-2'>
                        <div className='flex-1'>
                            <Link title="Modifica prodotti" to={`/admin/sites/siteproducts/edit/${appSiteId}/${siteProduct.siteProductId}`} 
                                className="rounded-full flex bg-blue-500 p-2 pl-3 pr-3 text-white">
                                <BsPencil />
                            </Link>
                        </div>
                        <div className="flex-1 p-1 rounded-full block bg-red-500 text-white">
                            <DeleteConfirmation onConfirm={() => deleteSiteProduct(siteProduct.siteProductId)} />
                        </div>                                                    
                    </div>                    
                </div>                    
            )}   
        </div>

        <div className='relative'>
            <div className="fixed flex items-center bottom-20 md:bottom-16 left-2">
                <Link to={`/admin/sites/siteproducts/siteproducttypes/${appSiteId}`}
                    className="text-white px-4 pt-2 w-auto h-16 bg-cyan-500 rounded-full hover:bg-cyan-700 border-cyan-500 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Tipi
                </Link>
            </div>

            <SiteProductModal appSiteId={appSiteId} siteProductId={0} handleAddEdit={(appSiteId) => getSiteProducts()} /> 
        </div>

        <FooterNav appSiteId={appSiteId} />
        
    </Container>
  );
};

export { SiteProductList };