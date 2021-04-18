import './../css/Home.css';
import Navbar from './../components/Navbar';
import AddPost from './../components/AddPost';
import Post from './../components/Post';
import {useEffect, useState} from 'react';
import Modal from '@material-ui/core/Modal';
import {db, auth} from "./../js/firebase.js";
function Home() {
	const [posts, setPosts] = new useState([]);
	useEffect(() => {
		db.collection('posts')
		.orderBy('timestamp','desc')
		.onSnapshot((snapshot) => {
			setPosts(snapshot.docs.map(doc => ({id:doc.id, data:doc.data()})));
		});
	},[]);
	const [Username, setUsername] = new useState("");
	const [Email, setEmail] = new useState("");
	const [Password, setPassword] = new useState("");
	const [user, setUser] = new useState(null);
	const [error, setError] = new useState("");

	useEffect(() => {
		const unSub = auth.onAuthStateChanged((authUser) => {
			if(authUser){
				// Logged In
				setUser(authUser);
			}
			else{
				// Logged Out
				setUser(null);
			}
		});
		return ()=>{
			unSub();
		}
	},[user, Username]);
	const onSignUp = (e) => {
		e.target.classList.add("disableWhile");
		e.target.innerText = "Hold on...";
		e.preventDefault();
		if(!!Username && !!Email && !!Password && Email.includes("@")){
			auth.createUserWithEmailAndPassword(Email, Password)
			.then((authUser) => {
				setEmail("");
				setPassword("");
				setError("");
				return authUser.user.updateProfile({
					displayName:Username
				})
			})
			.catch((error) => {
				setError(error.message);
			})
		}
	}

	const onLogIn = (e) => {
		e.target.classList.add("disableWhile");
		e.target.innerText = "Hold on...";
		e.preventDefault();
		auth.signInWithEmailAndPassword(Email, Password)
		.then(() => {
			setEmail("");
			setPassword("");
			setError("");
		})
		.catch((error) => {
			setError(error.message);
		});
	}

	const [wannaLogin, setWannaLogin] = new useState(true);
	const [wannaPost, setWannaPost] = new useState(false);

	const handleAddPost = (e) => {
		e.preventDefault();
		if(wannaPost){
			setWannaPost(false);
			e.target.innerText = "+ Add Post";
			e.target.classList.remove("warning-bg");
		}
		else{
			setWannaPost(true);
			e.target.innerText = "Cancel Post";
			e.target.classList.add("warning-bg");
		}
	}

  return (
    <div className="Home">
	<Modal
	open={!user}
	aria-labelledby="simple-modal-title"
	aria-describedby="simple-modal-description"
	className="Modal__Custom"
	>
		<div>
			<h1 id="simple-modal-title" className="logoText">Instagram Clone</h1>
			<h2 id="simple-modal-subtitle">{ (wannaLogin)?"Log in":"Sign up" } to see photos and videos from your friends.</h2>
			<p id="simple-modal-description">
				{
					(!wannaLogin)?(
							<input value={Username} placeholder="Username" onChange={(e) => { setUsername(e.target.value) }} type="text"/>
					):""
				}
				<input value={Email} placeholder="Email" onChange={(e) => { setEmail(e.target.value) }} type="email"/>
				<input value={Password} placeholder="Password" onChange={(e) => { setPassword(e.target.value) }} type="password"/>
				{
					(wannaLogin)?(
						<button id="loginButton" type="submit" className={(!!Email && !!Password && Email.includes("@"))?"":"disable"} onClick={onLogIn}>Log in</button>
					):(
						<button id="signupButton" type="submit" className={(!!Username && !!Email && !!Password && Email.includes("@"))?"":"disable"} onClick={onSignUp}>Sign up</button>
					)
				}
				<div className="orDivider">
					<div className="line"></div><div className="text">or</div><div className="line"></div>
				</div>
				{
					(wannaLogin)?(
						<button onClick={() => { setWannaLogin(false) }}>Sign up</button>
					):(
						<button onClick={() => { setWannaLogin(true) }}>Log in</button>
					)
				}
			</p>
			{
				(!!error)?(
					<p className="error">{error}</p>
				):""
			}
			{
				(!wannaLogin)?(
						<p className="simple-modal-footer">By signing up, you agree to our Terms , Data Policy and Cookies Policy.</p>
				):""
			}
			<p className="simple-modal-footer">By <a href="https://github.com/MuhammadRehanRasool">@MuhammadRehanRasool</a></p>
		</div>
	</Modal>
      <Navbar/>
      <div className="contentWrapper">
		{
			(user)?(
					<>
						<div className="actionButton">
							<h1><span>Welcome</span> @{user.displayName}!</h1>
							<div className="buttonWrapper">
								<button id="AddPostButton" type="submit" onClick={handleAddPost}>+ Add Post</button>
								<button type="submit" onClick={() => { auth.signOut() }}>Logout</button>
							</div>
						</div>
						{
							(wannaPost)?(
								<AddPost setWannaPost={setWannaPost} username={user.displayName}/>
							):""
						}
					</>
			):""
		}
      	<div className="postWrapper">
      		{
      			(!!user)?(
      				posts.map((post) => {
	      				let currentUser = "";
	      				if(!!user){
	      					currentUser = user.displayName;
	      				}
	      				else{
	  						currentUser = "";
	      				}
	      				return(<Post currentUser={currentUser} key={post.id} postId={post.id} timestamp={post.data.timestamp} by={post.data.by} location={post.data.location} caption={post.data.caption} profilePic={post.data.profilePic} image={post.data.image}/>)
	      			})
      			):("")
      		}
      	</div>
      </div>
    </div>
  );
}

export default Home;
