import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import { googleUser } from '../../services/auth';

class Pruebas extends Component {

    
        state={
          isAuthenticated: false, 
          user: {}, 
          token:                ''
        };
    

    logout = () => {
        this.setState({isAuthenticated: false, token: '', user:    null})
    };
    onFailure = (error) => {
      alert(error);
    };
    googleResponse = (response) => {
        const {user} = this.state;
        user.nombreUsuario = response.profileObj.name;
        user.fotoPerfil = response.profileObj.imageUrl;
        user.correo = response.profileObj.email;
        user.googleId = response.profileObj.googleId
        this.setState({user});
        googleUser(this.state.user)
            .then(user=>{
            this.props.history.push(`/profile/${user._id}`);
    })
    };

    render() {
        let content = !!this.state.isAuthenticated ?
            (
                <div>
                    <p>Authenticated</p>
                    <div>
                        {this.state.user.email}
                    </div>
                    <div>
                        <button onClick={this.logout} className="button">
                            Log out
                        </button>
                    </div>
                </div>
            ) :
            (
                <div>
                    <GoogleLogin
                        clientId="853861088301-d6pp525e5fo1sbd9l1ebv0mogs158ofk.apps.googleusercontent.com"
                        buttonText="Login"
                        onSuccess={this.googleResponse}
                        onFailure={this.onFailure}
                    />
                </div>
            );

        return (

            <div className="App">
                {content}
            </div>
        );
    }
}

export default Pruebas;