import React, { useState, useEffect } from 'react';
import { Container, Form } from 'react-bootstrap';
import { orderService } from '../../../_services';
import { SiteProductPreview } from '../../../_components/SiteProductPreview'

function OrderDetailList({appSiteId, orderYear, orderId})
{
    const [orderDetails, setOrderDetails] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        orderService.getOrderDetails(+orderId,+orderYear,+appSiteId)
            .then((_orderDetails) => {
                setOrderDetails(_orderDetails.result)
                setLoading(false)
            })        
    }, [appSiteId, orderYear, orderId]);     
    
    return (
        <Container className='p-2 border rounded-b-lg'>                        
            <div className="mt-2">
            {orderDetails && !loading && orderDetails.map(orderDetail =>                                    
                <div className="md:flex mt-1 md:space-x-2" key={orderDetail.productId}>
                    <div className='flex-1'>                    
                        {orderDetail && orderDetail.siteProductId > 0 &&
                        <SiteProductPreview 
                            appSiteId={orderDetail.appSiteId} 
                            siteProductId={orderDetail.siteProductId}
                            onChange={() => {}}
                            readOnly={true} />}
                    </div>
                    <div className='flex-none'>
                        <Form.Group>
                            <Form.Label className='text-sm'>Quantità</Form.Label>
                            <input type="number" readOnly="true" className="form-control" name="quantity" value={orderDetail.quantity} />                        
                        </Form.Group> 
                        <Form.Group>
                            <Form.Label className='text-sm'>Prezzo</Form.Label>
                            <input type="number" readOnly="true" className="form-control" name="price" value={orderDetail.price} />                        
                        </Form.Group> 
                    </div>
                </div>                    
            )}                                                
            </div>                            
        </Container>
    );
}

export { OrderDetailList };