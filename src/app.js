import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router';

import ProfilePic from './profilePic';
import Navbar from './navbar';
import UpdateProfilePic from './updateProfilePic';
import Loading from './loading'

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.showUploader = this.showUploader.bind(this);
        this.setImage = this.setImage.bind(this);
        this.showBioEditor = this.showBioEditor.bind(this);
        this.setBio = this.setBio.bind(this);
    }

// when it mounts, make an ajax request to get the logged in user's data.
    componentDidMount() {
        axios.get('/user')
            .then(({data}) => {
            this.setState({
                first: data.first,
                last: data.last,
                email: data.email,
                id: data.id,
                bio: data.bio,
                imgUrl: data.imgUrl,
                loaded: true
            }, () => {
            })
        })
    }

    // functions

    showUploader() {
        this.setState({uploaderIsVisible : !this.state.uploaderIsVisible})
    }

    setImage(imgUrl) {
       this.setState({ imgUrl: imgUrl, uploaderIsVisible: false})
    }

    setBio(bio) {
      this.setState({ bio: bio, bioEditorIsVisible: false})
    }

   showBioEditor() {
         this.setState({bioEditorIsVisible : !this.state.bioEditorIsVisible})
     }


     // if there is no state, use loading component. broken
    render() {
        if(!this.state.loaded) {
            console.log("loading");
        return (
            <div>
                <Loading/>
            </div>
        )
    } else {
        const {first, last, email, imgUrl, bio} = this.state;
        const children = React.cloneElement(this.props.children, {
            first,
            last,
            email,
            imgUrl,
            bio,
            setImage: this.setImage,
            setBio: this.setBio,
            uploaderIsVisible: this.state.uploaderIsVisible,
            bioEditorIsVisible: this.state.bioEditorIsVisible,
            showUploader: this.showUploader,
            showBioEditor: this.showBioEditor
        })

        const setImage = (imgUrl) => {
         this.setState({imgUrl: imgUrl})
        }

        const setBio = (bio) => {
         this.setState({bio: bio})
        }

        return (
            <div>
                <Navbar first={first} last={last} setImage={setImage} imgUrl={imgUrl} />
                {this.state.uploaderIsVisible && <UpdateProfilePic setImage={setImage}/>}
                {children}
            </div>
          )
         }
  }
}
