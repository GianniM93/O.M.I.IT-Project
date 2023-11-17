import MyNavbar from '../../comps/navbar/MyNav';
import { navLinks } from '../../data/myNavData';
import R7Xlogo from '../../Raito R7XMark.jpg';
import SnMlogo from '../../SnM Logo.jpg';
import './infoPage.css'

const InfoPage=()=>{
    return (
    <>
    <MyNavbar className="mb-4"  links={navLinks} />
    <div className="header-container">
    <span><img src={R7Xlogo} alt="R7Xlogo" className='avt'/></span>
    <h1 className='h1'>Benvenuti!</h1> </div>
    <p>Ciao e benvenuti in questo mio piccolo progetto, O.M.I.IT,
         un piccolo gioco di parole tra il termine O.M.I. (Opera Multimediale Interattiva) e la parola 'meet', che significa incontro. 
         L'idea è appunto quella di incontrarsi grazie a questa splendida passione comune che è il Videogioco! 
         Questa è solo una breve pagina per aggiungere due appunti personali e una menzione speciale alla persona grazie alla quale, 
         in un certo senso, sto scrivendo queste righe. Questo progetto è attualmente solo una versione 1.0 di ciò che aspira a diventare. 
         Al momento in cui scrivo, non ho ancora implementato tutte le funzioni e sezioni che avrei voluto, ma è solo l'inizio: 
         c'è tempo per crescere, migliorare e sviluppare questo e altri progetti futuri, sempre migliori. 
         Per concludere, desidero fare un ringraziamento speciale alla persona che, più di tutti, 
         ogni giorno mi trasmette la passione e la determinazione per lottare per i propri obiettivi, senza mai arrendersi. 
         Quindi, grazie er...</p>
    <span className="header-container"><img src={SnMlogo} alt="SnMlogo" className='avt'/>...Fight!</span>
    </>
    )}

export default InfoPage;