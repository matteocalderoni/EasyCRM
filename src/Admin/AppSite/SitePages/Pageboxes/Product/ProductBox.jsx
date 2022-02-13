import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { productService } from '../../../../../_services';

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

function ProductBox({appSiteId, siteProductId}) {

    const [siteProduct, setSiteProduct] = useState()

    useEffect(() => {
        productService.getSiteProductById(appSiteId, siteProductId)
            .then((_siteProduct) => setSiteProduct(_siteProduct))
    }, [appSiteId, siteProductId])

    return (
        <div className="mx-auto rounded-xl shadow-md overflow-hidden">
            {siteProduct && 
            <div style={{backgroundColor: siteProduct.boxColor}}>
                <div className="md:shrink-0">
                    <img className="h-48 w-full object-cover" src={baseImageUrl+siteProduct.imageUrl} alt={siteProduct.code} />
                </div>
                <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                        € {siteProduct.price}
                    </div>
                    <div className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
                        {siteProduct.code}
                    </div>
                    <div className="mt-2 text-slate-500">
                        {siteProduct.description && parse(siteProduct.description)}
                    </div>
                </div>
            </div>}            
        </div>                                    
    )
}

export { ProductBox }