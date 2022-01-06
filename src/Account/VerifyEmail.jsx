import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
//import queryString from 'query-string';

import { accountService, alertService } from '../_services';

function VerifyEmail() {
    const EmailStatus = {
        Verifying: 'Verifying',
        Failed: 'Failed'
    }

    const [emailStatus, setEmailStatus] = useState(EmailStatus.Verifying);

    useEffect(() => {
        var tokenIndex = window.location.search.indexOf('token=');
        const token = window.location.search.substring(tokenIndex + 6);
        
        accountService.verifyEmail(token)
            .then(() => {
                alertService.success('Verification successful, you can now login', { keepAfterRouteChange: true });
                //history.push('login');
            })
            .catch(() => {
                setEmailStatus(EmailStatus.Failed);
            });
    });

    function getBody() {
        switch (emailStatus) {
            case EmailStatus.Verifying:
                return <div>Verifica in corso...</div>;
            case EmailStatus.Failed:
                return <div>Verification fallita, <Link to="forgot-password">recuperare la password</Link>.</div>;
            default:
                return <></>;
        }
    }

    return (
        <div>
            <h3 className="card-header">Verifica Email</h3>
            <div className="card-body">{getBody()}</div>
        </div>
    )
}

export { VerifyEmail }; 