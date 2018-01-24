import React, { Component } from 'react';
import axios from 'axios';

export default class UpdateBio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bio: '' // should thid be empty?
        }
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleChange=this.handleChange.bind(this);
    }

    // put form stuff into state
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value // this is NOT AN ARRAY
        }, () => {
            console.log("the new state: ", this.state);
        });
    }

     handleSubmit(e) {
         const {bio} = this.state;
         console.log('update Bio clicked');
         if (bio) { // req.body is undefuned
             axios.post("/updateBio", {
                 bio: this.state.bio
             }).then((resp) => {
                 console.log("inside bio ajax request", resp);
                 this.props.setBio(resp.data.bio) // this is wrong
                 // location.replace('/'); // this is wrong
                 // how to hide this module when save changes (handleSubmit) is clicked?
            });
     } else {
         this.setState({error: true, message: "Are you sure you want to leave your bio empty?"});
     }
 }

    render() {
        return (
            <div className="updateBio">
                <h1>Update bio</h1>
                <input name="bio" onChange={this.handleChange}/>
                <button type="submit" onClick={this.handleSubmit}>Save Changes</button>
                {this.state.error && <div className="error"><p>{this.state.message}</p></div>}
            </div>
        )
    }
}
