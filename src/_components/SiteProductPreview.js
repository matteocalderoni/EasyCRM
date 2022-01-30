import React,{useState, useEffect} from 'react'; 
import { productService } from '../_services'
import { SiteProductSelect } from './SiteProductSelect';
import { Image } from 'react-bootstrap'
import parse from 'html-react-parser'

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

function SiteProductPreview({ appSiteId, siteProductId, onChange, readOnly }) 
{
    const [selSiteProductId, setSelSiteProductId] = useState(siteProductId)
    const [siteProduct, setSiteProduct] = useState()
    const isReadOnly = readOnly || false;

    useEffect(() => {
        if (selSiteProductId > 0) {
            productService.getSiteProductById(appSiteId, selSiteProductId)
                .then((result) => {
                    setSiteProduct(result)
                })
        }
    },[appSiteId, selSiteProductId])

    const handleSiteProductId = (_siteProductId) => {
        setSelSiteProductId(_siteProductId)
        onChange(_siteProductId)
    }

    return (
        <>
            {!isReadOnly && 
            <SiteProductSelect appSiteId={appSiteId} siteProductId={selSiteProductId} onChange={(_siteProductId) => handleSiteProductId(_siteProductId)} />}
            {siteProduct && 
            <div className='border rounded md:flex'>
                <Image className='w-48 h-48' src={baseImageUrl+siteProduct.imageUrl} fluid />                    
                <div className='bg-gray-200 p-2'>
                    <h1 className='font-semibold'>{siteProduct.code}</h1>
                    {siteProduct.description && parse(siteProduct.description)}
                    <div>
                        € {siteProduct.price}
                    </div>
                </div>
            </div>}
        </>
    );
}

export { SiteProductPreview }