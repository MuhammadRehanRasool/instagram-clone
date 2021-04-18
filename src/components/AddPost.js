import './../css/AddPost.css';
import {useState} from 'react';
import {db, storage} from "./../js/firebase.js";
import firebase from 'firebase';
export default function AddPost(props){
	const [image, setImage] = new useState(null);
	const [progressBar, setProgressBar] = new useState(0);
	const [caption, setCaption] = new useState("");
	const [location, setLocation] = new useState("");
	const [error, setError] = new useState("");
	const handleUploadChange = (e) => {
		if(e.target.files[0]){
			setImage(e.target.files[0]);
			let image = document.getElementById('output-image');
			image.src = URL.createObjectURL(e.target.files[0]);
		}
	}

	const handleUpload = (e) => {
		const uploadTask = storage.ref(`images/${image.name}`).put(image);
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				// progress bar
				let progress__ = Math.round(
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				);
				setProgressBar(progress__);
			},
			(error) => {
				setError(error.message);
			},
			() => {
				// complete function
				storage
				.ref("images")
				.child(image.name)
				.getDownloadURL()
				.then(url => {
					// post image into db
					db.collection("posts").add({
						timestamp:firebase.firestore.FieldValue.serverTimestamp(),
						caption:caption,
						image:url,
						by:props.username,
						location:location,
						profilePic:""
					});
					setProgressBar(0);
					setCaption("");
					setLocation("");
					setImage(null);
					let image = document.getElementById('output-image');
					image.src = "https://lh3.googleusercontent.com/proxy/cvncEsPLflt3jbDLh5D2Jd1Mzq5DGt9xVhq4qhg8pKXfmQAm7wvGVNJXf17sVzxz-tP8YEC2-UVDx_Wr3TnA53SteWlwAGE";
					props.setWannaPost(false);
					document.getElementById("AddPostButton").innerText = "+ Add Post";
					document.getElementById("AddPostButton").classList.remove("warning-bg");
				});
			}
		);
	}
	return(
		<>
			<div className="AddPost">
				<span>+ Add Post</span>
				{
					(!!error)?(
						<p>{error}</p>
					):""
				}
				<div className="inputWrapper">
					<input value={caption} placeholder="Caption" onChange={(e) => { setCaption(e.target.value) }} type="text"/>
					<input value={location} placeholder="Location" onChange={(e) => { setLocation(e.target.value) }} type="text"/>
					<input id="file-upload" placeholder="Attach Image" onChange={handleUploadChange} type="file"/>
					{
						(!!image)?(
								<progress value={progressBar} max="100"/>
						):""
					}
					<label htmlFor="file-upload" class="custom-file-upload">
					    <img id="output-image" src="https://lh3.googleusercontent.com/proxy/cvncEsPLflt3jbDLh5D2Jd1Mzq5DGt9xVhq4qhg8pKXfmQAm7wvGVNJXf17sVzxz-tP8YEC2-UVDx_Wr3TnA53SteWlwAGE" alt="Upload"/>
					    <p>Change Image</p>
					</label>
					<button onClick={handleUpload}>Post</button>
				</div>
			</div>
		</>
	);
}