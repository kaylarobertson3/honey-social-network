import React, { Component } from 'react';
import UpdateProfilePic from './updateProfilePic';

export default class ProfilePic extends Component {
    constructor(props) {
     super(props);
     this.state = {
         showUploader: false,
         imgUrl: '',
         first: '',
         last: ''
     }
 }

    render() {
        return (
            <div >
              <img className="profImg" onClick={this.props.showUploader}  src={this.props.imgUrl} alt={this.props.first}/>
              { this.state.showUploader && <UpdateProfilePic /> }
            </div>
        )
    }
}
