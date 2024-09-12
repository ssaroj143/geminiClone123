import './Main.css';
import {assets} from '../../assets/assets/assets';
import { useContext, useState, useRef, useEffect } from 'react';
import { Context } from '../../context/Context';

const Main = () => {
    const {onSent, recentPrompt, showResult, loading, resultData, setInput, input} = useContext(Context);
    const [isListening, setIsListening] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [clearImage, setClearImage] = useState(false);
    const fileInputRef = useRef(null);

    const startSpeechRecognition = () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
            };
            recognition.start();
            setIsListening(true);
            recognition.onend = () => setIsListening(false);
        } else {
            alert('Speech recognition is not supported in this browser.');
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target.result.split(',')[1]);
                setInput("Describe this image");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSend = () => {
        onSent(input, selectedImage);
        setClearImage(true);
    };

    useEffect(() => {
        if (clearImage && !loading) {
            setSelectedImage(null);
            setClearImage(false);
        }
    }, [loading, clearImage]);

  return (
    <div className='main'>
        <div className="nav">
            <p>Ashvik GPT</p>
            <img src={assets.user_icon} alt="" />
        </div>
      <div className="main-container">
        {!showResult ? <>
            <div className="greet">
            <p><span>Hello, Ashvik</span></p>
            <p>How Can I Help You Today ?</p>
        </div>
        <div className="cards">
            <div className="card">
                <p>Suggest beautiful places to see on an upcoming road trip</p>
                <img src={assets.compass_icon} alt="" />
            </div>
            <div className="card">
                <p>briefly summarize concept: urban planning</p>
                <img src={assets.bulb_icon} alt="" />
            </div>
            <div className="card">
                <p>brainstrom team bonding activities for our work retreat</p>
                <img src={assets.message_icon} alt="" />
            </div>
            <div className="card">
                <p>Improve the readbility of the following code</p>
                <img src={assets.code_icon} alt="" />
            </div>
          </div>
        </>
        :<div className='result'>
            <div className="result-title">
                <img src={assets.user_icon} alt="" />
                <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
                <img src={assets.gemini_icon} alt="" />
                {loading?<div className='loader'>
                    <hr />
                    <hr />
                    <hr />
                </div>
                : <div>
                    {selectedImage && !clearImage && (
                        <img 
                            src={`data:image/jpeg;base64,${selectedImage}`} 
                            alt="Uploaded" 
                            style={{ maxWidth: '100%', maxHeight: '300px', marginBottom: '20px' }} 
                        />
                    )}
                    <p dangerouslySetInnerHTML={{__html:resultData}}></p>
                </div>}
            </div>
            </div>}
        
        
        <div className="main-bottom">
            <div className="search-box">
            <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='Enter a prompt here'/>
                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                        accept="image/*"
                    />
                    <img 
                        src={assets.gallery_icon} 
                        alt="" 
                        onClick={() => fileInputRef.current.click()}
                    />
                    {selectedImage && !clearImage && (
                        <img 
                            src={`data:image/jpeg;base64,${selectedImage}`} 
                            alt="Uploaded" 
                            style={{ maxWidth: '30px', maxHeight: '30px', marginLeft: '5px' }} 
                        />
                    )}
                    <img 
                        src={isListening ? assets.mic_icon_active : assets.mic_icon}
                        alt="" 
                        onClick={startSpeechRecognition}
                        title="Click to start voice input"
                    />
                    <img onClick={handleSend} src={assets.send_icon} alt="" />
                    
                </div>
                
            </div>
            <p className="bottom-info">Ashvik GPT may display inaccurate info, including about people,so double check its responses.Your privacy and Ashvik GPT App</p>
        </div>
      </div>
    </div>
  )
}

export default Main
