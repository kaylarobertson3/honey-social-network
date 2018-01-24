import React, {Component} from 'react';
import ReactLoading from 'react-loading';

// export default class Loading extends Component {
//     render() {
//         return (
//             <div>
//                 <h1>Loading...</h1>
//             </div>
//         )
//     }
// }

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


//
// const Example = ({ type, color }) => (
// 	<ReactLoading type={type} color={color} height='667' width='375' />
// );
//
// export default Example;
