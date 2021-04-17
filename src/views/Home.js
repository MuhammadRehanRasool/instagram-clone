import './../css/Home.css';
import Navbar from './../components/Navbar';
import Post from './../components/Post';
import {useEffect, useState} from 'react';
import Modal from '@material-ui/core/Modal';
import SendIcon from '@material-ui/icons/Send';
import {db, auth} from "./../js/firebase.js";
function Home() {
	const [posts, setPosts] = new useState([]);
	useEffect(() => {
		db.collection('posts')
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
				console.log(authUser);
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

	const [wannaLogin, setWannaLogin] = new useState(false);

  return (
    <div className="Home">
	<Modal
	open={!user}
	aria-labelledby="simple-modal-title"
	aria-describedby="simple-modal-description"
	className="Modal__Custom"
	>
		<div>
			<img id="simple-modal-title" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram Logo"/>
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
						<button type="submit" className={(!!Email && !!Password && Email.includes("@"))?"":"disable"} onClick={onLogIn}>Log in</button>
					):(
						<button type="submit" className={(!!Username && !!Email && !!Password && Email.includes("@"))?"":"disable"} onClick={onSignUp}>Sign up</button>
					)
				}
				<div className="orDivider">
					<div class="line"></div><div class="text">or</div><div class="line"></div>
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
					<div className="actionButton">
						<button type="submit" onClick={() => { auth.signOut() }}>Logout</button>
					</div>
			):""
		}
      	<div className="postWrapper">
      		<Post by="rehan.sathio" location="Karachi, Pakistan" caption={`deniz kenarı tek şifadır ✨`} profilePic="https://instagram.fkhi16-1.fna.fbcdn.net/v/t51.2885-19/s150x150/164408250_369115637483490_8067562922456666063_n.jpg?tp=1&_nc_ht=instagram.fkhi16-1.fna.fbcdn.net&_nc_ohc=JO6h6qEabzMAX8aK_AC&edm=ABfd0MgBAAAA&ccb=7-4&oh=e8dee5770c40f477d7cc5da0d67d9398&oe=60A1CA17&_nc_sid=7bff83" image="https://instagram.fkhi16-1.fna.fbcdn.net/v/t51.2885-15/e35/134771242_2699555540356635_4290071383274139042_n.jpg?tp=1&_nc_ht=instagram.fkhi16-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=MWjE59ztyDMAX_9CpVE&edm=AP_V10EBAAAA&ccb=7-4&oh=3edd5bc058ae4b25ba4f8e46a8c90dd8&oe=609FF855&_nc_sid=4f375e"/>
      		{
      			posts.map((post) => {
      				return(<Post key={post.id} by={post.data.by} location={post.data.location} caption={post.data.caption} profilePic={post.data.profilePic} image={post.data.image}/>)
      			})
      		}
      	</div>
      </div>
    </div>
  );
}

export default Home;
