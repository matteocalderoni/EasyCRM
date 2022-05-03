import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import { surveyService } from '../../../../_services';
import { BsPencil} from 'react-icons/bs';
import { DeleteConfirmation } from '../../../../_components/DeleteConfirmation';

function UserSurveyList({appSiteId, siteSurveyId})
{    
    const [userSurveys, setUserSurveys] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getUserSurveys()
    }, [appSiteId, siteSurveyId]);     
    
    function deleteUserSurvey(userSurvey) {
        setLoading(true)
        setUserSurveys(userSurveys.map(x => {
            if (x.appSiteId === appSiteId && x.siteSurveyId === siteSurveyId && x.userSurveyId === userSurvey.userSurveyId) 
                x.isDeleting = true; 
            return x;
        }));
        surveyService.deleteUserSurvey(appSiteId, siteSurveyId, userSurvey.userSurveyId)
            .then(() => getUserSurveys());                
    }

    function getUserSurveys() {
        setLoading(true)
        surveyService.getUserSurveys(appSiteId, siteSurveyId)
            .then((x) => { 
                setLoading(false)
                setUserSurveys(x.result)
            });
    }
    
    return (
        <Container fluid>            
            <div className="mt-2">
            {!loading && userSurveys && userSurveys.map(userSurvey =>                                    
                <div className="block mt-1" key={userSurvey.userSurveyId}>
                    <Card text="white">
                        <Card.Header className="bg-blue-500">
                            <Card.Title className="flex">
                                <div className="flex-none">
                                    <div className='rounded-full bg-blue-800 p-2'># {userSurvey.userSurveyId}</div>
                                </div>                 
                            </Card.Title>                                                        
                        </Card.Header>                        
                        <Card.Body className="mx-full md:flex space-y-2 md:space-x-2">                                       
                            <Link title="Modifica la pagina" to={`/admin/sites/sitesurveys/usersurveys/edit/${appSiteId}/${siteSurveyId}/${userSurvey.userSurveyId}`} 
                                className="flex flex-1 items-center justify-center rounded-full bg-green-500 p-1 text-white">
                                <BsPencil className="mr-2" /> modifica
                            </Link>
                            <div className="mt-2 flex-1 rounded-full block bg-red-500">
                                <DeleteConfirmation onConfirm={() => deleteUserSurvey(userSurvey)} /> Elimina
                            </div>                            
                        </Card.Body>
                    </Card>                                            
                </div>                    
            )}                                                
            </div>                            
        </Container>
    );

}

export { UserSurveyList };