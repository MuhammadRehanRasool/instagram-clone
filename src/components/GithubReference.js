import './../css/GithubReference.css';
import GitHubIcon from '@material-ui/icons/GitHub';
import ReactTooltip from 'react-tooltip';

function GithubReference() {
  return (
    <div className="GithubReference">
    	<ReactTooltip/>
		<div id="github_reference" data-tip="@MuhammadRehanRasool" onClick={() => {
			window.location = "https://github.com/MuhammadRehanRasool";
		}}>
			<GitHubIcon id="github_icon"/>
		</div>
    </div>
  );
}

export default GithubReference;
