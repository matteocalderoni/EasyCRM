import React,{useState, useEffect} from 'react'; 
import { productService } from '../_services'
import { Image } from 'react-bootstrap'

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

function SiteProductPreviewSmall({ appSiteId, siteProductId }) {
    
    const [siteProduct, setSiteProduct] = useState()

    useEffect(() => {
        if (siteProductId > 0) {
            productService.getSiteProductById(appSiteId, siteProductId)
                .then((result) => setSiteProduct(result))
        }
    },[appSiteId, siteProductId])

    return (
        <>
            {siteProduct && 
            <div className='border rounded-xl overflow-hidden md:flex' style={{backgroundColor: siteProduct.boxColor}}>
                <Image className='w-full md:w-24 h-12' src={baseImageUrl+siteProduct.imageUrl} fluid />                    
                <div className='h-12'>
                    <label className='font-semibold text-sm'>{siteProduct.code} <b>€ {siteProduct.price}</b></label>                    
                </div>
            </div>}
        </>
    );
}

export { SiteProductPreviewSmall }