import { ErrorMessage, Field } from 'formik';

export default function FormikTextInput({ fieldClassName, labelName, type, id, name, component, rows, maxLength }) {

    const formikFieldProps = { className: fieldClassName, type, id, name, component, rows, maxLength };
    
    return <div className='from-field-wrap'>
        <div>
            <label>
                <span className='form-label-field'> {labelName} </span>
            </label>
        </div>
        <div>
            <Field {...formikFieldProps} />
        </div>
        <ErrorMessage name={name} className='form-label-field text-feedback' component="span" />
    </div>
}