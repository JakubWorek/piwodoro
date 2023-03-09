import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Timer.css'
import PauseButton from './PauseButton.js';
import PlayButton from './PlayButton.js';
import SettingsButton from './SettingsButton';
import { useContext, useState, useEffect, useRef} from 'react';
import SettingsContext from './SettingsContext';


const piwny = '#FDE456';
const green = '#4aec8c';


function Timer() {
    const SettingsInfo = useContext(SettingsContext);
    const [isPaused, setIsPaused] = useState(true);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [mode, setMode] = useState('break');

    const secondsLeftRef = useRef(secondsLeft);
    const isPausedRef = useRef(isPaused);
    const modeRef = useRef(mode);

    const notify = () => toast.success("Time for beer!");

    function switchMode(){
        const nextMode = modeRef.current === 'work' ? 'break' : 'work';
        setMode(nextMode);
        if(nextMode === 'break'){
            notify();
        }
        modeRef.current = nextMode;
        setSecondsLeft(nextMode === 'work' ? SettingsInfo.workMinutes * 60 : SettingsInfo.breakMinutes * 60); 
        secondsLeftRef.current = nextMode === 'work' ? SettingsInfo.workMinutes * 60 : SettingsInfo.breakMinutes * 60;
        
    }

    function tick(){
        secondsLeftRef.current--;
        setSecondsLeft(secondsLeftRef.current);
    }

    function initTimer() {
        setSecondsLeft(SettingsInfo.workMinutes * 60);
    }

    useEffect(() => {
        initTimer();

        const interval = setInterval(() => {
            if(isPausedRef.current){
                return;
            }
            if(secondsLeftRef.current === 0){
                return switchMode();
            }
            tick();
        }, 1000);

        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SettingsInfo]);

    const totalSeconds = mode === 'work' ? SettingsInfo.workMinutes * 60 : SettingsInfo.breakMinutes * 60;
    const percentage = Math.round(secondsLeft/totalSeconds * 100) ;
    const minutes = Math.floor(secondsLeft/60);
    let seconds = Math.floor(secondsLeft % 60);
    if(seconds < 10) seconds = '0'+seconds;

    return (
        <div class="container">
            <div>
                <ToastContainer 
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                stules={toast({
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light", 
                })}
                />
            </div>
            <div class="nametag">🍺 Piwodoro 🍺</div>
            <div class="progressbar">
                <CircularProgressbar
                value={percentage}
                text={minutes + ":" + seconds} 
                styles={buildStyles({
                    textColor:piwny,
                    pathColor:mode === 'work' ? piwny : green,
                    trailColor:'rgba(255, 255, 255,.2)',
                })}
                />
            </div>
            <div class="buttons">
                {isPaused 
                    ? <PlayButton onClick={ () => {setIsPaused(false); isPausedRef.current=false}} /> 
                    : <PauseButton onClick={ () => {setIsPaused(true); isPausedRef.current=true }} /> }
                <SettingsButton onClick={() => SettingsInfo.setShowSettings(true)} />
            </div>

        </div>
    );
}

export default Timer;