import './notification.scss'

type notifyProps = {
    text: string,
    time?: number
    show: boolean
    Close: () => void
}

export default function Notification({text, time, show, Close}:notifyProps){
    
    setTimeout(() => {
        Close()
    }, time? time : 5000);

    return(
        <div id="notification" className={`${show ? 'show' : ''}`}>
            <h3>Notificação</h3>
            <p>{text}</p>
        </div>
    )
}