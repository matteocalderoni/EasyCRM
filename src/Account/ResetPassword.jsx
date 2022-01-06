import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
//import queryString from 'query-string';
import { Formik, Field, Form, ErrorMessage } from 'formik';

import { accountService, alertService } from '../_services';

function ResetPassword({ history }) {
    const TokenStatus = {
        Validating: 'Validating',
        Valid: 'Valid',
        Invalid: 'Invalid'
    }
    
    const [token, setToken] = useState(null);
    const [tokenStatus, setTokenStatus] = useState(TokenStatus.Validating);

    // useEffect(() => {
    //     const { token } = queryString.parse(window.location.search);

    //     // remove token from url to prevent http referer leakage
    //     history.replace(window.location.pathname);

    //     accountService.validateResetToken(token)
    //         .then(() => {
    //             setToken(token);
    //             setTokenStatus(TokenStatus.Valid);
    //         })
    //         .catch(() => {
    //             setTokenStatus(TokenStatus.Invalid);
    //         });
    // });

    useEffect(() => {
        var tokenIndex = window.location.search.indexOf('token=');
        const token = window.location.search.substring(tokenIndex + 6);
        
        accountService.validateResetToken(token)
            .then(() => {
                setToken(token);
                setTokenStatus(TokenStatus.Valid);
            })
            .catch(() => {
                setTokenStatus(TokenStatus.Invalid);
            });
    });

    function getForm() {
        const initialValues = {
            password: '',
            confirmPassword: ''
        };
        
        function onSubmit({ password, confirmPassword }, { setSubmitting }) {
            alertService.clear();
            accountService.resetPassword({ token, password, confirmPassword })
                .then(() => {
                    alertService.success('Password reset successful, you can now login', { keepAfterRouteChange: true });
                    history.push('login');
                })
                .catch(error => {
                    setSubmitting(false);
                    alertService.error(error);
                });
        }

        return (
            <Formik initialValues={initialValues} onSubmit={onSubmit}>
                {({ errors, touched, isSubmitting }) => (
                    <Form>
                        <div className="form-group">
                            <label>Password</label>
                            <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                            <ErrorMessage name="password" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <Field name="confirmPassword" type="password" className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')} />
                            <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-row">
                            <div className="form-group col">
                                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                    {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                    Reset Password
                                </button>
                                <Link to="/login" className="btn btn-link">Cancel</Link>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        );
    }

    function getBody() {
        switch (tokenStatus) {
            case TokenStatus.Valid:
                return getForm();
            case TokenStatus.Invalid:
                return <div>Token validation failed, if the token has expired you can get a new one at the <Link to="forgot-password">forgot password</Link> page.</div>;
            case TokenStatus.Validating:
                return <div>Validating token...</div>;
            default:
                return <></>;
        }
    }

    return (
        <div>
            <h3 className="card-header">Reset Password</h3>
            <div className="card-body">{getBody()}</div>
        </div>
    )
}

export { ResetPassword }; 