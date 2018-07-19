import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';

class Pruebas extends Component {

    
        state={
          isAuthenticated: false, 
          user: null, 
          token:                ''
        };
    

    logout = () => {
        this.setState({isAuthenticated: false, token: '', user:    null})
    };
    onFailure = (error) => {
      alert(error);
    };
    googleResponse = (response) => {
        console.log(response);
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
                        clientId="esladelbackend"
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