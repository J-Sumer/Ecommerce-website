import React, { useState } from 'react';
import Layout from '../core/Layout'
import {signin, authenticate, isAuthenticated} from '../auth'
import { Redirect } from 'react-router-dom'


const Signin = () => {
    const [values, setValues] = useState({
        email: 'admin',
        password: 'password1',
        error: '',
        loading: false,
        redirectToReferrer: false
    })

    const { email, password, error, loading, redirectToReferrer } = values;
    const { user } = isAuthenticated();

    const handleChange = name => event => {
        setValues({...values, error: false, [name]: event.target.value })
    }

    const clickSubmit = (event) => {
        event.preventDefault()
        setValues({...values, error: false, loading: true})

        signin({email, password}).then(data => {
            if(data.error) {
                setValues({ ...values, error: data.error, loading: false})
            }else{
                authenticate(data, () => {
                    setValues({...values, redirectToReferrer:true})                    
                })
            }
        })
    }
    

    const signUpForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange('email')} value={email} type="email" className="form-control" autoFocus/>
            </div>
            <div className="form-group">
                <label className="text-muted">password</label>
                <input onChange={handleChange('password')} value={password} type="password" className="form-control"/>
            </div>
            <button onClick={clickSubmit} className="btn btn-primary">Submit</button>
        </form>
    )

    const showError= () => (
        <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    )

    const showLoading= () => (
        loading && (
            <div className="alert alert-info">
                <h2>Loading...</h2>
            </div>
        )
    )

    const redirectUser = () => {
        
        if(redirectToReferrer) {
            if(user && user.role === 1){
                return <Redirect to="/admin/dashboard" />
            }
            return <Redirect to="/user/dashboard" />
        }
        if(isAuthenticated()) {
            return <Redirect to="/"/>
        }
    }

    return(
        <Layout title="Sign in" description="Sign in to view awesome page" className="container col-md-8 offset-md-2">
            {showLoading()}
            {showError()}
            {signUpForm()}
            {redirectUser()}
        </Layout>
    )
}

export default Signin