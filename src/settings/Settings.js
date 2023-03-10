import './Settings.css'
import ReactSlider from 'react-slider';
import SettingsContext from './SettingsContext';
import BackButton from '../buttons/BackButton';
import { useContext } from 'react';


function Settings() {
    const SettingsInfo = useContext(SettingsContext);


    return(
        <div class="settings-container">
            <label>Work: {SettingsInfo.workMinutes}:00</label>
            <ReactSlider
                className={'slider'}
                thumbClassName={'thumb'}
                trackClassName={'track'}
                value={SettingsInfo.workMinutes}
                onChange={newValue => SettingsInfo.setWorkMinutes(newValue)}
                min={1}
                max={90}
            />
            <label>Break: {SettingsInfo.breakMinutes}:00</label>
            <ReactSlider
                className={'slider'}
                thumbClassName={'thumb'}
                trackClassName={'track'}
                value={SettingsInfo.breakMinutes}
                onChange={newValue => SettingsInfo.setBreakMinutes(newValue)}
                min={1}
                max={30}
            />
            <div class="buttons">
                <BackButton onClick={() => SettingsInfo.setShowSettings(false)} />
            </div>
            <div class="about">
                Simple pomodoro timer. <br></br>
                When there's a break you have to drink a beer. <br></br>
                Cheers 🍺 <br></br>
                Image: <a href="https://www.vecteezy.com/vector-art/8831618-beer-day-background-two-hands-holding-glass-and-toast">vecteezy</a>
            </div>
        </div>
    )
}

export default Settings