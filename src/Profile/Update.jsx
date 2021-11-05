import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { accountService, alertService } from '../_services';

function Update({ history }) {
    const user = accountService.userValue;
    const initialValues = {
        title: user.title,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: '',
        confirmPassword: ''
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Titolo è richiesto'),
        firstName: Yup.string()
            .required('Nome è richiesto'),
        lastName: Yup.string()
            .required('Cognome è richiesto'),
        email: Yup.string()
            .email('Email non valida')
            .required('Email è richiesta'),
        password: Yup.string()
            .min(6, 'Password deve contenere almeno 6 caratteri'),
        confirmPassword: Yup.string()
            .when('password', (password, schema) => {
                if (password) return schema.required('Conferrma Password è richiesto');
            })
            .oneOf([Yup.ref('password')], 'Passwords non corrisponde')
    });

    function onSubmit(fields, { setStatus, setSubmitting }) {
        setStatus();
        accountService.update(user.id, fields)
            .then(() => {
                alertService.success('Aggiornato con successo', { keepAfterRouteChange: true });
                history.push('.');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    const [isDeleting, setIsDeleting] = useState(false);
    function onDelete() {
        //if (confirm('Are you sure?')) {
            setIsDeleting(true);
            accountService.delete(user.id)
                .then(() => alertService.success('Account eliminato con successo'));
        //}
    }

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ errors, touched, isSubmitting }) => (
                <Form>
                    <div className="shadow rounded-xl mt-16 bg-gray-100 p-8">
                        <h1 className="font-bold text-green-900">Modifica Profilo</h1> 
                        <p>Aggiorna le tue informazioni personali.</p>
                    </div>
                    

                    <div className="border rounded mt-4 m-2">
                        <div className="m-2">
                            <label>Title</label>
                            <Field name="title" as="select" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')}>
                                <option value=""></option>
                                <option value="Mr">Mr</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Miss">Miss</option>
                                <option value="Ms">Ms</option>
                            </Field>
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>
                        <div className="m-2">
                            <label>First Name</label>
                            <Field name="firstName" type="text" className={'form-control' + (errors.firstName && touched.firstName ? ' is-invalid' : '')} />
                            <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
                        </div>
                        <div className="m-2">
                            <label>Last Name</label>
                            <Field name="lastName" type="text" className={'form-control' + (errors.lastName && touched.lastName ? ' is-invalid' : '')} />
                            <ErrorMessage name="lastName" component="div" className="invalid-feedback" />
                        </div>
                    </div>

                    <div className="border rounded m-2">
                        <div className="m-2">
                            <label>Email</label>
                            <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                            <ErrorMessage name="email" component="div" className="invalid-feedback" />
                        </div>
                    </div>
                    <div className="border rounded m-2">
                        <h3 className="text-red-800 m-2">Change Password</h3>
                        <p className="m-2">Leave blank to keep the same password</p>
                        <div className="md:flex">
                            <div className="form-group col">
                                <label>Password</label>
                                <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                <ErrorMessage name="password" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col">
                                <label>Confirm Password</label>
                                <Field name="confirmPassword" type="password" className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')} />
                                <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                            </div>
                        </div>
                    </div>
                    <div className="flex border rounded m-2">
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary m-2">
                            {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Aggiorna Profilo
                        </button>
                        <button type="button" onClick={() => onDelete()} className="btn btn-danger m-2" disabled={isDeleting}>
                            {isDeleting
                                ? <span className="spinner-border spinner-border-sm"></span>
                                : <span>Elimina</span>
                            }
                        </button>
                        <Link to="." className="btn btn-link bg-grey-200 m-2">Annulla</Link>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export { Update };