import React, { useRef, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { RiMicAiFill } from "react-icons/ri";
import { IoArrowUp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import aiImage from "../assets/SearchAi.png";
import startSound from "../assets/start.mp3";
import "./SearchWithAi.css";

const SEARCH_API = "http://localhost:3000/api/courses/search";

const SearchWithAi = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [searchedQuery, setSearchedQuery] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const micStartAudioRef = useRef(null);

//   Speech synthesis for AI responses and feedback.
  const speak = (text) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      console.warn("Speech synthesis not supported in this browser.");
      return;
    }

    const message = String(text || "").trim();
    if (!message) return;

    // Stop previous queued speech and speak latest message.
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };
  const clearPreviousResults = () => {
    setSearchedQuery("");
    setRecommendations([]);
  };

  const handleSearch = async (rawQuery) => {
    const query = String(rawQuery || "").trim().toLowerCase();
    if (!query) {
      toast.info("Please enter something to search.");
      return;
    }

    try {
      setIsSearching(true);
      setSearchedQuery(query);

      // API call happens only when search is triggered.
      const response = await axios.get(SEARCH_API, {
        params: { q: query },
        withCredentials: true,
      });

      const fetchedCourses = response.data?.courses || [];
      setRecommendations(fetchedCourses);
      if (fetchedCourses.length > 0) {
        speak("These are the top courses I found for you.");
      } else {
        speak("Sorry, I could not find any courses matching your search. Please try a different keyword.");
      }
    } catch (error) {
      console.log("AI search API error:", error.response?.data || error.message);
      toast.error("Search API failed. Please try again.");
      setRecommendations([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    try {
      if (!micStartAudioRef.current) {
        micStartAudioRef.current = new Audio(startSound);
      }
      micStartAudioRef.current.currentTime = 0;
      micStartAudioRef.current.play().catch(() => {});
    } catch {
      // Keep mic flow working even if audio playback fails.
    }

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      if (transcript.trim()) {
        setInput(transcript);
        clearPreviousResults();
      } else {
        toast.info("No speech detected. Please try again.");
      }
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      const code = event?.error;
      if (code === "not-allowed" || code === "service-not-allowed") {
        toast.error("Microphone permission denied. Please allow mic access.");
        return;
      }
      if (code === "no-speech") {
        toast.info("No speech detected. Please speak and try again.");
        return;
      }
      if (code === "audio-capture") {
        toast.error("No microphone found. Check your mic and try again.");
        return;
      }
      if (code === "network") {
        toast.error("Network issue during voice capture. Please retry.");
        return;
      }
      toast.error("Voice search failed. Please try again.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const handleOpenAllCourses = (query) => {
    const search = String(query || "").trim();
    navigate(search ? `/all-courses?q=${encodeURIComponent(search)}` : "/all-courses");
  };

  const handleOpenCourse = (courseId) => {
    if (!courseId) return;
    navigate(`/view-courses/${courseId}`);
  };

  return (
    <div className="ai-search-page">
      <div className="ai-search-shell">
        <div className="ai-search-top">
          <button className="ai-back-btn" onClick={() => navigate(-1)} type="button">
            <FaArrowLeftLong />
            Back
          </button>

          <h1>
            <img src={aiImage} alt="AI Search" />
            Search with <span>AI</span>
          </h1>
        </div>

        <div className="ai-search-bar">
          <input
            type="text"
            placeholder="Try: React, data science, UI design, interview prep..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              clearPreviousResults();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(input);
              }
            }}
          />
          <button type="button" className="ai-search-btn" onClick={() => handleSearch(input)}>
            <span className={`ai-search-icon ${isSearching ? "loading" : ""}`}>
              {isSearching ? <span className="ai-circle-loader" /> : <IoArrowUp />}
            </span>
            {isSearching ? "Searching..." : "Search"}
          </button>
          <button type="button" className="ai-mic-btn" onClick={handleVoiceSearch}>
            <RiMicAiFill />
            {isListening ? "Listening..." : "Voice"}
          </button>
        </div>

        {searchedQuery ? (
          recommendations.length ? (
            <>
              <div className="ai-search-headline">
                <h2>AI Suggestions</h2>
                <button type="button" onClick={() => handleOpenAllCourses(searchedQuery)}>
                  View all matches
                </button>
              </div>

              <div className="ai-course-grid">
                {recommendations.map((course) => (
                  <article
                    key={course._id}
                    className="ai-course-card"
                    role="button"
                    tabIndex={0}
                    onClick={() => handleOpenCourse(course?._id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleOpenCourse(course?._id);
                      }
                    }}
                  >
                    <img src={course?.thumnail || course?.thumbnail} alt={course?.title} />
                    <div className="ai-course-content">
                      <p>{course?.category || "Course"}</p>
                      <h3>{course?.title}</h3>
                      <span>{course?.subTitle || "Structured learning path"}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCourse(course?._id);
                        }}
                      >
                        Open Course
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="ai-empty">
              <h3>No matching courses found</h3>
              <p>Try a broader keyword, for example: web development, python, UI design.</p>
            </div>
          )
        ) : (
          <div className="ai-empty">
            <h3>Ask AI what you want to learn</h3>
            <p>Type your goal and get smart course suggestions instantly.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchWithAi;
