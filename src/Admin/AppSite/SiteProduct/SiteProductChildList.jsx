import React, { useEffect, useState } from 'react';
import { productService } from '../../../_services/product.service';
import { Link } from 'react-router-dom';
import { BsPencil} from 'react-icons/bs';
import parse from 'html-react-parser';

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

function SiteProductChildList({appSiteId, siteProductId}) {

    const [childs, setChilds] = useState([])
    const [total, setTotal] = useState(0);

    useEffect(() => {
        productService.getSiteProductChilds('',0,0,appSiteId, siteProductId)
            .then((_childs) => {
                setTotal(_childs.totalCount)
                setChilds(_childs.result)
            })
    }, [appSiteId, siteProductId])

    return (<>
        {childs && childs.map(child =>                                    
        <div className="mt-2 rounded-xl border w-80 mx-auto overflow-hidden" key={child.siteProductChildId}>
            {child.siteProductChild && 
            <div>
                <div className="md:shrink-0">
                    <img className="h-24 w-full object-cover" src={baseImageUrl+child.siteProductChild.imageUrl} alt={child.siteProductChild.code} />
                </div>
                <div className="p-8 h-24 overflow-hidden">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                        € {child.siteProductChild.price}
                    </div>
                    <span className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
                        {child.siteProductChild.code}
                    </span>
                    <div className="mt-2 text-slate-500">
                        {child.siteProductChild.description && parse(child.siteProductChild.description)}
                    </div>
                </div>
                <div className='p-2 space-y-2'>
                    <Link title="Modifica prodotti" to={`/admin/sites/siteproducts/edit/${appSiteId}/${child.siteProductChildId}`} 
                        className="rounded-full flex bg-blue-500 p-2 pl-3 pr-3 text-white">
                        <BsPencil />
                    </Link>
                    {/* <div className="p-1 rounded-full block bg-red-500 text-white">
                        <DeleteConfirmation onConfirm={() => deleteSiteProduct(siteProduct.siteProductId)} />
                    </div>*/}
                </div>                    
            </div>}
        </div>                    
        )}  
    </>)
}

export { SiteProductChildList };