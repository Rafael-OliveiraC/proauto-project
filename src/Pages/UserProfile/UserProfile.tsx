import { useEffect, useState } from "react"
import Notification from "../../components/Notification/Notification"

import proautoL from '../../assets/proautoL.png'

import './userprofile.scss'
import { db } from "../../lib/firebase"
import { getDocs, query, collection, where, doc, getDoc, updateDoc } from "firebase/firestore"
import { useNavigate, useParams } from "react-router-dom"

export default function UserProfile(){
    const [notify, setNotify] = useState('')
    const [notifyShow, setNotifyShow] = useState(false)
    const [painel, setPainel] = useState('user')
    const [sidemenu, setSidemenu] = useState(false)

    

    return(
        <>
            <Notification text={notify} show={notifyShow} Close={()=>{
                setNotifyShow(false)
            }}/>
            <Sidemenu onOpen={sidemenu} onClose={(nav)=>{
                setSidemenu(false)
                if(nav != null) setPainel(nav)
            }}/>
            <div id="user-pg">
                <header>
                    <img src={proautoL} alt="proauto"/>
                    <button onClick={()=>setSidemenu(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                </header>
                <main>
                    <Dashboard nav={(nav)=>{
                        if(nav != null) setPainel(nav)
                    }}/>
                    <Painel active={painel} notify={()=>{
                        setNotify('Dados Alterados com sucesso!')
                        setNotifyShow(true)
                    }}/>

                </main>
            </div>
        </>
    )
}

type dashboardProp = {
    nav: (...param:any) => void
}

function Dashboard({nav}:dashboardProp){
    let navigate = useNavigate();

    function handleClose(e:any){
        const navg = e.target.getAttribute('data-type')
        nav(navg);
    }
    return (
        <nav>
            <ul>
            <li><button type="button" data-type="user" onClick={handleClose}>Dados Pessoais</button></li>
                    <li><button type="button" data-type="car" onClick={handleClose}>Dados do Veículo</button></li>
                    <li><button onClick={()=>navigate('/')}>Sair</button></li>
            </ul>
        </nav>
    )
}

type painelProps = {
    active: string
    notify: () => void
}
function Painel({active, notify}:painelProps){
    const [cep, setCep] = useState('')
    const [user,setUser] = useState({
        nome: '',
        cpf: '',
        rg: '',
        data_nasc: '',
        idade: '',
        sexo: '',
        celular: '',
        email: '',
        pai: '',
        mae: '',
    })
    const [adress, setAdress] = useState({
        bairro: '',
        cidade: '',
        endereco: '',
        estado: '',
        numero: '',
    })
    const [car, setCar] = useState({
        Marca: '',
		Modelo: '',
		Ano: '',
		RENAVAM: '',
		Placa: '',
		Cor: ''
    })

    let params = useParams();

    useEffect(()=>{
        const docRef = doc(db, "users", `${params.id}`);
        const querySnapshot = async ()=>{
            const doc = await getDoc(docRef);
            const user = doc.data()

            setUser({
                nome: user?.nome,
                cpf: user?.cpf,
                rg: user?.rg,
                data_nasc: user?.data_nasc,
                idade: user?.idade,
                sexo: user?.sexo,
                celular: user?.celular,
                email: user?.email,
                pai: user?.pai,
                mae: user?.mae,
            })
            setAdress({
                bairro: user?.bairro,
                cidade: user?.cidade,
                endereco: user?.endereco,
                estado: user?.estado,
                numero: user?.numero,
            })
            setCep(user?.cep)

            const q = query(collection(db, "users_cars"), where("id", "==", params.id));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const carr = doc.data()

                setCar({
                    Marca: carr.Marca,
                    Modelo: carr.Modelo,
                    Ano: carr.Ano,
                    RENAVAM: carr.RENAVAM,
                    Placa: carr.Placa,
                    Cor: carr.Cor
                })
            });
        } 
        querySnapshot()
    },[])
    
    async function handleCep(event:any){
        const { value } = event.target
        let v = value.replace(/\D/g, "")
        v = v.replace(/(\d{5})(\d{1,3})/, "$1-$2")
        setCep(v)

        if(v.length == 9){
            const response = await fetch(`https://viacep.com.br/ws/${v}/json/`)
            const data = await response.json()
            
            setAdress({
                bairro: data.bairro,
                cidade: data.localidade,
                endereco: data.logradouro,
                estado: data.uf,
                numero: '',
            })
        }
    }

    async function changeCadastro(e:any){
        e.preventDefault()
        const docRef = doc(db, "users", `${params.id}`);
        console.log(adress)
        await updateDoc(docRef, {
            cep: cep,
            bairro: adress.bairro,
            cidade: adress.cidade,
            endereco: adress.endereco,
            estado: adress.estado,
            numero: adress.numero,
        });
        notify()
    }

    return (
        <div id="painel">
            <form className={`${active == 'user' ? 'show' : ''}`}>
                <section>
                    <h1>Dados da conta</h1>
                    <div>
                        <label>email</label>
                        <input value={user.email} readOnly/>
                    </div>
                    <div>
                        <label>Nome</label>
                        <input value={user.nome} readOnly/>
                    </div>
                    <div>
                        <label>CPF</label>
                        <input value={user.cpf} readOnly/>
                    </div>
                    <div>
                        <label>rg</label>
                        <input value={user.rg} readOnly/>
                    </div>
                    <div>
                        <label>data_nasc</label>
                        <input value={user.data_nasc} readOnly/>
                    </div>
                    <div>
                        <label>idade</label>
                        <input value={user.idade} readOnly/>
                    </div>
                    <div>
                        <label>sexo</label>
                        <input value={user.sexo} readOnly/>
                    </div>
                    <div>
                        <label>celular</label>
                        <input value={user.celular} readOnly/>
                    </div>
                    
                    <div>
                        <label>pai</label>
                        <input value={user.pai} readOnly/>
                    </div>
                    <div>
                        <label>mae</label>
                        <input value={user.mae} readOnly/>
                    </div>
                </section>
                <section>
                    <h1>Endereço</h1>
                    <div>
                        <label>cep</label>
                        <input value={cep} onChange={handleCep} maxLength={9} required/>
                    </div>
                    <div>
                        <label>bairro</label>
                        <input value={adress.bairro} onChange={(e)=>setAdress({...adress, bairro: e.target.value})} required/>
                    </div>
                    <div>
                        <label>cidade</label>
                        <input value={adress.cidade} onChange={(e)=>setAdress({...adress, cidade: e.target.value})} required/>
                    </div>
                    <div>
                        <label>endereco</label>
                        <input value={adress.endereco} onChange={(e)=>setAdress({...adress, endereco: e.target.value})} required/>
                    </div>
                    <div>
                        <label>estado</label>
                        <input value={adress.estado} onChange={(e)=>setAdress({...adress, estado: e.target.value})} required/>
                    </div>
                    <div>
                        <label>numero</label>
                        <input value={adress.numero} onChange={(e)=>setAdress({...adress, numero: e.target.value})} required/>
                    </div>
                </section>

                <button type="submit" onClick={changeCadastro}>ATUALIZAR CADASTRO</button>
            </form>

            <form className={`${active == 'car' ? 'show' : ''}`}>
                <section>
                    <h1>Dados do veículo</h1>
                    <div>
                        <label>marca</label>
                        <input defaultValue={car.Marca} readOnly/>
                    </div>
                    <div>
                        <label>Modelo</label>
                        <input defaultValue={car.Modelo} readOnly/>
                    </div>
                    <div>
                        <label>Ano</label>
                        <input defaultValue={car.Ano} readOnly/>
                    </div>
                    <div>
                        <label>RENAVAM</label>
                        <input defaultValue={car.RENAVAM} readOnly/>
                    </div>
                    <div>
                        <label>Placa</label>
                        <input defaultValue={car.Placa} readOnly/>
                    </div>
                    <div>
                        <label>Cor</label>
                        <input defaultValue={car.Cor} readOnly/>
                    </div>
                </section>
            </form>
        </div>
    )
}

type sidemenuProps = {
    onOpen: boolean
    onClose: (...params:any) => void
}

function Sidemenu({onOpen, onClose}:sidemenuProps){
    if(!onOpen)return <></>;
    let navigate = useNavigate();
    const body = (document.querySelector('body') as HTMLBodyElement);
    body.style.overflow = 'hidden';

    function handleClose(e:any){
        const nav = e.target.getAttribute('data-type')
        body.style.overflow = 'auto';
        onClose(nav);
    }

    return (
        <div id="sidemenu" className={`${onOpen ? 'show' : ''}`} onClick={handleClose}>
            <nav onClick={e => e.stopPropagation()}>
                <button onClick={handleClose}>X</button>
                <ul>
                    <li><button type="button" data-type="user" onClick={handleClose}>Dados Pessoais</button></li>
                    <li><button type="button" data-type="car" onClick={handleClose}>Dados do Veículo</button></li>
                    <li><button onClick={()=>navigate('/')}>Sair</button></li>
                </ul>
            </nav>
        </div>
    )
}