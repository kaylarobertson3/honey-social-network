import React, { Component } from 'react';
import axios from 'axios';
import ProfilePic from './profilePic';


export default class UpdateProfilePic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    // put all form fields and key value pairs into state, i think
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.files[0]
        })
    }

    handleSubmit(e) {
        const {file} = this.state;
        var formData = new FormData();
        if (file) {
            formData.append('file', file);
            axios.post('/updateProfilePic', formData).then((resp) => {
                console.log("setting new image with: ", resp.data.imgUrl);
                this.props.setImage(resp.data.imgUrl)
                this.setState({message: resp.data.message})
                console.log(resp.data.message, "was photo submited?");
            }).catch((err) => {
                console.log("error in updating profile pic", err);
                this.setState({error:true, message: 'file too large'});
            })
        } else {
            this.setState({error: true, message: "no file attached"})
            console.log("no file attached");
        }
    }


    render() {
        return (
            <div>
                 <div className="updateProfilePic animated fadeInDown">
                     <div className="updateProfilePicWrapper">
                    <h1>Update profile picture</h1>
                    <input type="file" name="file" onChange={this.handleChange} />
                    <button type = "submit" onClick={this.handleSubmit}>Upload</button>
                    {this.state.error && <div className="error"><p>{this.state.message}</p></div>}
                </div>
               </div>
             </div>

        )
    }
}
