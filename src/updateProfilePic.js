import React, { Component } from 'react';
import axios from 'axios';
import ProfilePic from './profilePic';
import AvatarCropper from "react-avatar-cropper";


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
        console.log('Upload clicked');
        var formData = new FormData();
        if (file) {
            formData.append('file', file);
            axios.post('/updateProfilePic', formData).then((resp) => {
                console.log("setting new image with: ", resp.data.imgUrl);
                this.props.setImage(resp.data.imgUrl)
                //trying to hide modal after upload sucess
                //trying to auto update photo upon upload
                // location.replace('/'); // this is wrong
            })


        } else {
            this.setState({error: true, message: "no file attached"})
            console.log("no file attached");
        }
    }



    render() {
        return (
            // <div className="updateProfilePic animated fadeInLeft">
            //     <div class="icono-mail"></div>
            //     <h1>Update profile picture</h1>
            //     <input type="file" name="file" onChange={this.handleChange} />
            //     <button type = "submit" onClick={this.handleSubmit}>Upload</button>
            //     {this.state.error && <div className="error"><p>{this.state.message}</p></div>}
            // </div>
            <div>
                 <div className="updateProfilePic animated fadeInDown">
                     <div className="updateProfilePicWrapper">
                    <h1>Update profile picture</h1>
                    <input type="file" name="file" onChange={this.handleChange} />
                    <button type = "submit" onClick={this.handleSubmit}>Upload</button>
                    {this.state.error && <div className="error"><p>{this.state.message}</p></div>}
                    {/* <AvatarCropper
                     onRequestHide={this.handleRequestHide}
                     onCrop={this.handleCrop}
                     image={this.state.img}
                     width={400}
                     height={400}
                   /> */}
                </div>
               </div>
             </div>

        )
    }
}
