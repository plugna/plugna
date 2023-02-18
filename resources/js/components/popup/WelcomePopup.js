import Popup from "./Popup";

function WelcomePopup(props){
    return (
        <Popup title="PLUGNA - INTRODUCTORY VIDEO" name={"welcome"}  {...props}>
            <h3>Thanks for installing Plugna!</h3>
            <p> Please take a moment to watch this 3 min long introductory video and learn how to use Plugna to manage WordPress plugins.
                    <br/><i>(you can always access this guide later, by clicking on button "Settings")</i>
                    <br />
                    <div className={'yt-video'}>
                        <iframe width="1034" height="582" src="https://www.youtube.com/embed/KklEdMEFGEE"
                                title="Mastering WordPress Plugin Management with Plugna" frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen></iframe>
                    </div>

            </p>
        </Popup>
    );
};

export default WelcomePopup;