import React,{useState, useEffect} from 'react'; 
import { productService } from '../_services'
import { SiteProductSelect } from './Select/SiteProductSelect';
import { Image } from 'react-bootstrap'
import parse from 'html-react-parser'

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

function SiteProductPreview({ appSiteId, siteProductId, template, onChange, readOnly }) 
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
            <div>
                {template === 1 &&
                <div className='border rounded-xl overflow-hidden md:flex' style={{backgroundColor: siteProduct.boxColor}}>
                    <Image className='w-full md:w-48 h-48' src={baseImageUrl+siteProduct.imageUrl} fluid />                    
                    <div className='p-2'>
                        <h1 className='font-semibold text-xl'>{siteProduct.code}</h1>
                        {siteProduct.siteProductType && siteProduct.siteProductType.category === 1 &&
                        <div className='font-bold'> € {siteProduct.price} </div>}
                        <div className='h-12 overflow-hidden'>
                            {siteProduct.description && parse(siteProduct.description)}
                        </div>
                        <div className="space-x-4 mb-6 text-sm font-medium">
                            <div className="mx-auto">
                                <button className="h-10 px-6 font-semibold rounded-md bg-black text-white" type="submit">
                                    Azione
                                </button>                                
                            </div>                            
                        </div>
                    </div>
                </div>}

                {template === 2 &&
                <div className="flex font-sans">
                    <div className="flex-none w-48 relative">
                        <img src={baseImageUrl+siteProduct.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <form className="flex-auto p-6">
                        <div className="flex flex-wrap">
                            <h1 className="flex-auto text-lg font-semibold text-slate-900">
                            {siteProduct.code}
                            </h1>
                            {siteProduct.siteProductType && siteProduct.siteProductType.category === 1 &&
                            <div className="text-lg font-semibold text-slate-500">                            
                                € {siteProduct.price}
                            </div>}                            
                        </div>
                        
                        <div className="flex space-x-4 mb-6 text-sm font-medium">
                            <div className="flex-auto flex space-x-4">
                                <button className="h-10 px-6 font-semibold rounded-md bg-black text-white" type="submit">
                                    Azione
                                </button>                                
                            </div>                            
                        </div>
                        <p className="text-sm text-slate-700">
                            {siteProduct.description && parse(siteProduct.description)}
                        </p>
                    </form>
                </div>}
                

                {template === 3 &&
                <div className='bg-cover h-56 flex items-center text-center' style={{backgroundImage: `url(${baseImageUrl+siteProduct.imageUrl})`}}>
                    <div className='flex-1 text-center'>
                        <h1 className="w-full text-xl font-semibold">
                        {siteProduct.code}
                        </h1>
                        {siteProduct.siteProductType && siteProduct.siteProductType.category === 1 &&
                        <div className="text-lg font-semibold">                            
                            € {siteProduct.price}
                        </div>}
                        <div className="w-full flex-none text-sm font-medium text-slate-700 mt-2">
                            {siteProduct.description && parse(siteProduct.description)}
                        </div>
                        <div className="space-x-4 mb-6 text-sm font-medium">
                            <div className="mx-auto">
                                <button className="h-10 px-6 font-semibold rounded-md bg-black text-white" type="submit">
                                    Azione
                                </button>                                
                            </div>                            
                        </div>
                    </div>
                </div>}

                {template === 4 &&
                <div className='h-56 flex items-center text-center' style={{backgroundColor: siteProduct.boxColor}}>
                    <div className='flex-1 text-center'>
                        <h1 className="w-full text-xl font-semibold">
                        {siteProduct.code}
                        </h1>
                        {siteProduct.siteProductType && siteProduct.siteProductType.category === 1 &&
                        <div className="text-lg font-semibold">                            
                            € {siteProduct.price}
                        </div>}
                        <div className="w-full flex-none text-sm font-medium text-slate-700 mt-2">
                            {siteProduct.description && parse(siteProduct.description)}
                        </div>
                        <div className="space-x-4 mb-6 text-sm font-medium">
                            <div className="mx-auto">
                                <button className="h-10 px-6 font-semibold rounded-md bg-black text-white" type="submit">
                                    Azione
                                </button>                                
                            </div>                            
                        </div>
                    </div>
                </div>}
            </div>}
        </>
    );
}

export { SiteProductPreview }