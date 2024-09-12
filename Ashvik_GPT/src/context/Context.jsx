/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, createContext, useMemo } from "react";
import run from "../config/gimini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState('');
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]); 
    const [showResult, setShowResult] = useState(false); 
    const [loading, setLoading] = useState(false); 
    const [resultData, setResultData] = useState(""); 
    const [uploadedImage, setUploadedImage] = useState(null);
    const [recentSearches, setRecentSearches] = useState([]);

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData(prev => prev + nextWord);
        }, 75 * index);
    }
    const newChat = ()=>{
        setLoading(false);
        setShowResult(false);
    }

    const onSent = async (prompt, imageData) => {
        try {
            setResultData("");
            setLoading(true);
            setShowResult(true);
            
            console.log("onSent called with prompt:", prompt);
            console.log("Image data present:", !!imageData);

            const response = await run(prompt || input, imageData);
            
            console.log("Response received in onSent:", response);

            setRecentPrompt(prompt || input);
            setRecentSearches(prev => [(prompt || input), ...prev.slice(0, 4)]);
            
            let responseArray = response.split("**");
            let newResponse = "";

            for (let i = 0; i < responseArray.length; i++) {
                if (i === 0 || i % 2 !== 1) {
                    newResponse += responseArray[i];
                } else {
                    newResponse += "<b>" + responseArray[i] + "</b>";
                }
            }

            let newResponse2 = newResponse.split("*").join("<br/>");
            let newResponseArray = newResponse2.split(" ");
            for (let i = 0; i < newResponseArray.length; i++) {
                const nextWord = newResponseArray[i];
                delayPara(i, nextWord + " ");
            }
        } catch (error) {
            console.error("Error in onSent:", error);
            setResultData("An error occurred. Please try again later or contact support if the issue persists.");
        } finally {
            setLoading(false);
            setInput("");
        }
    }

    const ContextValue = useMemo(() => ({
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        recentSearches,
        setRecentSearches
    }), [prevPrompts, recentPrompt, showResult, loading, resultData, input, recentSearches]);

    return (
        <Context.Provider value={ContextValue}>
            {props.children}
        </Context.Provider>
    );
}

export default ContextProvider;
