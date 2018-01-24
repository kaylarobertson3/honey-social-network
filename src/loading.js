import React, {Component} from 'react';
import ReactLoading from 'react-loading';

export default class Loading extends Component {

	render() {
        return (
        <div className="loading">
			<ReactLoading type="bubbles" color="rgb(219, 159, 56)" height='100' width='100'/>
			{/* <h1> LOADING </h1> */}
		</div>
		)
	}
}
