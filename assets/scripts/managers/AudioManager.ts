import { _decorator, AudioSource, AudioClip, Component, resources } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    private static _instance: AudioManager;

    @property(AudioSource)
    bgAudio: AudioSource = null!;

    @property(AudioSource)
    sfxAudio: AudioSource = null!;

    private _isMusicOn = true;
    private _isSoundOn = true;

    static get instance() {
        return this._instance;
    }

    onLoad() {
        AudioManager._instance = this;
        this.loadSettings();


    }


    private loadSettings() {
        const music = localStorage.getItem('musicOn');
        const sound = localStorage.getItem('soundOn');
        this._isMusicOn = music !== 'false';
        this._isSoundOn = sound !== 'false';

        this.updateMusicState();
    }

    private updateMusicState() {
        if (!this.bgAudio) return;
        this.bgAudio.volume = this._isMusicOn ? 0.2 : 0;
        if (this._isMusicOn && !this.bgAudio.playing) {
            this.bgAudio.play();
        } else if (!this._isMusicOn && this.bgAudio.playing) {
            this.bgAudio.stop();
        }
    }

    playSound(effectPath: string) {
        if (!this._isSoundOn) return;
        resources.load(`audio/${effectPath}`, AudioClip, (err, clip) => {
            if (!err && this.sfxAudio) {
                this.sfxAudio.playOneShot(clip);
            }
        });
    }

    toggleMusic() {
        this._isMusicOn = !this._isMusicOn;
        localStorage.setItem('musicOn', String(this._isMusicOn));
        this.updateMusicState();
    }

    toggleSound() {
        this._isSoundOn = !this._isSoundOn;
        localStorage.setItem('soundOn', String(this._isSoundOn));
    }

    get isMusicOn() {
        return this._isMusicOn;
    }

    get isSoundOn() {
        return this._isSoundOn;
    }
}


