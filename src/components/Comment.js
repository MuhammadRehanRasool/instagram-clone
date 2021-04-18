import './../css/Comment.css';
export default function Comment(props){
	return(
		<>
			<div className="Comment">
				<p><span className="username">{props.by}</span> { props.polishDesc(props.comment).map((word) => {
				if(word[0] === "#" || word[0] === "@"){
					return (<span><span className="hashtag">{word}</span> </span>);
				}
				return (<span>{word} </span>);
			}) }</p>
			</div>
		</>
	);
}