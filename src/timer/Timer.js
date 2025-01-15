import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Timer.css';
import PauseButton from '../buttons/PauseButton.js';
import PlayButton from '../buttons/PlayButton.js';
import SettingsButton from '../buttons/SettingsButton';
import SettingsContext from '../settings/SettingsContext';
import { useContext, useState, useEffect, useRef } from 'react';

const piwny = '#FDE456';
const green = '#4aec8c';

function Timer() {
    const SettingsInfo = useContext(SettingsContext);
    const [isPaused, setIsPaused] = useState(true);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [mode, setMode] = useState('work');
    const timerRef = useRef(null);
    const secondsLeftRef = useRef(0);

    const notify = () => toast.success("Time for beer!");

    function switchMode() {
        const nextMode = mode === 'work' ? 'break' : 'work';
        setMode(nextMode);
        const newSeconds =
            nextMode === 'work'
                ? SettingsInfo.workMinutes * 60
                : SettingsInfo.breakMinutes * 60;
        setSecondsLeft(newSeconds);
        secondsLeftRef.current = newSeconds;

        if (nextMode === 'break') {
            notify();
        }
    }

    useEffect(() => {
        const initialTime = SettingsInfo.workMinutes * 60;
        setSecondsLeft(initialTime);
        secondsLeftRef.current = initialTime;
    }, [SettingsInfo]);

    useEffect(() => {
        function tick() {
            if (secondsLeftRef.current <= 0) {
                clearInterval(timerRef.current);
                timerRef.current = null;
                switchMode();
                return;
            }
            secondsLeftRef.current -= 1;
            setSecondsLeft(secondsLeftRef.current);
        }

        if (!isPaused) {
            if (!timerRef.current) {
                timerRef.current = setInterval(tick, 1000);
            }
        } else {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        return () => clearInterval(timerRef.current);
        //eslint-disable-next-line
    }, [isPaused]);

    useEffect(() => {
        if (!isPaused && !timerRef.current) {
            timerRef.current = setInterval(() => {
                setSecondsLeft((prev) => {
                    if (prev <= 0) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                        switchMode();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        //eslint-disable-next-line
    }, [mode, isPaused]);

    const totalSeconds = mode === 'work' ? SettingsInfo.workMinutes * 60 : SettingsInfo.breakMinutes * 60;
    const percentage = Math.round((secondsLeft / totalSeconds) * 100);
    const minutes = Math.floor(secondsLeft / 60);
    let seconds = Math.floor(secondsLeft % 60);
    if (seconds < 10) seconds = '0' + seconds;

    return (
        <div className="container">
            <div>
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </div>
            <div className="nametag">🍺 Piwodoro 🍺</div>
            <div className="progressbar">
                <CircularProgressbar
                    value={percentage}
                    text={`${minutes}:${seconds}`}
                    styles={buildStyles({
                        textColor: piwny,
                        pathColor: mode === 'work' ? piwny : green,
                        trailColor: 'rgba(255, 255, 255,.2)',
                    })}
                />
            </div>
            <div className="buttons">
                {isPaused ? (
                    <PlayButton onClick={() => setIsPaused(false)} />
                ) : (
                    <PauseButton onClick={() => setIsPaused(true)} />
                )}
                <SettingsButton onClick={() => SettingsInfo.setShowSettings(true)} />
            </div>
        </div>
    );
}

export default Timer;