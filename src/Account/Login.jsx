import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { accountService, alertService } from '../_services';

function Login({ history, location }) {
    const initialValues = {
        email: '',
        password: ''
    };

    function onSubmit({ email, password }, { setSubmitting }) {
        alertService.clear();
        accountService.login(email, password)
            .then(() => {
                const { from } = location.state || { from: { pathname: "/" } };
                history.push(from);
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    return (
        <Formik initialValues={initialValues} onSubmit={onSubmit} className="border rounded-xl">
            {({ errors, touched, isSubmitting }) => (
                <Form>
                    <div className="bg-blue-500">
                        <div className="card-header font-sans">
                            <h1 className="text-white font-bold text-xl">EasyCRM</h1>
                            <p className="text-white">Accedi ad area riservata</p>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="form-group">
                            <label>Email</label>
                            <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                            <ErrorMessage name="email" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                            <ErrorMessage name="password" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-row">
                            <div className="form-group col">
                                <button type="submit" disabled={isSubmitting} className="bg-green-500 w-full border-green-300 text-white p-2 rounded-full">
                                    {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                    Accedi
                                </button>
                            </div>
                            <div className="form-group col text-right mt-2">
                                <Link to="register" className="bg-gray-200 ml-2 p-2 rounded-full">Registrati</Link>
                                <Link to="forgot-password" className="bg-gray-200 ml-2 p-2 rounded-full">Password dimenticata?</Link>
                            </div>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export { Login }; 