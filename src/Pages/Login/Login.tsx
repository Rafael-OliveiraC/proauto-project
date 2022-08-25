import { db } from "../../lib/firebase"
import { addDoc, collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import proautoL from '../../assets/proautoL.png'
import person from '../../lib/pessoas.json'
import cars from '../../lib/carros.json'

import './login.scss'

import Notification from "../../components/Notification/Notification";

export default function Login(){
    const [cpf, setCpf] = useState("")
    const [plate, setPlate] = useState("")
    const [modal, setModal] = useState(false)
    const [notify, setNotify] = useState('')
    const [notifyShow, setNotifyShow] = useState(false)
    const [data, setData] = useState([])

    let navigate = useNavigate();

    async function getUsers(){
        let data:any = []
        const q = query(collection(db, "users"))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            data.push(doc.data())
        });
        setData(data)
        setModal(true)
    }

    function handleChangeMask(event:any){
        const { value } = event.target
        let v = value.replace(/\D/g, "")
        v = v.replace(/(\d{3})(\d)/, "$1.$2")
        v = v.replace(/(\d{3})(\d)/, "$1.$2")
        v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        setCpf(v)
    }

    function handleChangePlate(event:any){
        const { value } = event.target
        let v = value
        v = v.replace(/([a-zA-Z]{3})(\d{1,4})/, "$1-$2").toUpperCase()
        setPlate(v)
    }

    async function loginUser(event:any){
        event.preventDefault()

        const cpf = event.target.form[0].value
        const plate = event.target.form[1].value        

        const usersQ = query(collection(db, "users"), where("cpf", "==", cpf));
        const carsQ = query(collection(db, "users_cars"), where("Placa", "==", plate));
        const usersRef = await getDocs(usersQ);

        usersRef.forEach(async (doc) => {
            const carsRef = await getDocs(carsQ);
            carsRef.forEach(async (doc2) => {
                if(await (doc2.data()).id == doc.id){
                    navigate(`/UserProfile/${doc.id}`)
                }
            });
        });
        setNotify('CPF ou Placa Invalida!')
        setNotifyShow(true)
    }

    return(
        <>
        <Modal onOpen={modal} data={data} onClose={()=>{
                setModal(false)
        }} notify={()=>{
            setModal(false)
            setNotify('Usuario Removido!')
            setNotifyShow(true)
        }}/>
        <Notification text={notify} show={notifyShow} Close={()=>{
            setNotifyShow(false)
        }}/>
        <div id="login-pg">
            <section>
                <img src={proautoL} alt="proauto"/>
                <h2>Digite os dados abaixo para prosseguir</h2>
            </section>

            <section>
                <form id="form">
                    <div className="input-group">
                        <label>CPF</label>
                        <input type="text" value={cpf} placeholder="000.000.000-00" onChange={handleChangeMask} maxLength={14} required/>
                    </div>
                    <div className="input-group">
                        <label>Placa do Veículo</label>
                        <input type="text" maxLength={8} value={plate} onChange={handleChangePlate} required/>
                    </div>
                    <button type="submit" onClick={loginUser}>Consultar</button>
                    
                </form>
            </section>

            <section>
                <GeneratePerson notify={()=>{
                    setNotify('Usuario Criado!')
                    setNotifyShow(true)
                }}/>
                <button onClick={getUsers}>Verificar usuarios existentes</button>
            </section>
        </div>
        </>
    )
}

type modalProps = {
    onOpen: boolean;
    data: any
    onClose: () => void;
    notify: () => void;
}

function Modal(props:modalProps){
    if(!props.onOpen)return <></>
    async function deleteUser(event:any){
        const th = event.target.parentElement.parentElement
        const cpf = th.childNodes[1].textContent

        const q = query(collection(db, "users"), where("cpf", "==", cpf))
        const docs = await getDocs(q);
        docs.forEach(async(docm) => {
            await deleteDoc(doc(db, "users", docm.id));

            const q = query(collection(db, "users_cars"), where("id", "==", docm.id))
            const doc2 = await getDocs(q);
            doc2.forEach(async(docm2) => {
                await deleteDoc(doc(db, "users_cars", docm2.id));
                props.notify()
            });
        });
    }

    return(
        <div id="modal" className={`${props.onOpen ? 'show' : ''}`} onClick={()=> props.onClose()}>
            <div onClick={e => e.stopPropagation()}>
                <h2>Usuarios Registrados</h2>

                <table>
                    <thead>
                        <tr>
                            <th>&nbsp;</th>
                            <th>CPF</th>
                            <th>Placa</th>
                            <th>Deletar</th>
                        </tr>
                    </thead>
                    <tbody>
                    {props.data.map((doc:any, index:number)=>{
                        return(
                            <tr key={index}>
                                <th>{index + 1}</th>
                                <td>{doc.cpf}</td>
                                <td><PlateUser cpf={doc.cpf}/></td>
                                <td><button onClick={deleteUser}>X</button></td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}


function PlateUser({cpf}:any){
    const [license, setLicense] = useState('Carregando..')

    const q = query(collection(db, "users"), where("cpf", "==", cpf))
    const querySnapshot = async ()=>{
        const doc = await getDocs(q);

        doc.forEach(async(doc) => {
            const q = query(collection(db, "users_cars"), where("id", "==", doc.id))
            const doc2 = await getDocs(q);
            doc2.forEach(async(doc) => {
                setLicense(doc.data().Placa)
            });
        });
    } 
    querySnapshot()

    return <>{license}</>
}


function GeneratePerson(props:any){
    async function gerar(){

        let randomP = Math.floor(Math.random() * 31)
        let randomC = Math.floor(Math.random() * 31)

        let userq = query(collection(db, "users"), where("cpf", "==", person[randomP]['cpf']))
        let carq = query(collection(db, "users_cars"), where("Placa", "==", cars[randomC]['Placa']))
        let queryUser = await getDocs(userq);
        let queryCar = await getDocs(carq);

        while(!queryUser.empty){
            console.log('while1')
            randomP = Math.floor(Math.random() * 31)
            userq = query(collection(db, "users"), where("cpf", "==", person[randomP]['cpf']))
            queryUser = await getDocs(userq);
        }
        while(!queryCar.empty){
            console.log('while2')
            randomC = Math.floor(Math.random() * 31)
            carq = query(collection(db, "users_cars"), where("Placa", "==", cars[randomC]['Placa']))
            queryCar = await getDocs(carq); 
        }

        try {
            const docRef = await addDoc(collection(db, "users"), person[randomP]);
            const docRef2 = await addDoc(collection(db, "users_cars"), cars[randomC]);
            const upd = doc(db, "users_cars", docRef2.id);
            await updateDoc(upd, {
                id: docRef.id
            });
                console.log("Document written, Cpf: ", person[randomP].cpf);
                console.log("Document written, License: ", cars[randomC].Placa);
                props.notify()
        } catch (e) {
                console.error("Error adding document: ", e);
        }
    }

    return <button onClick={gerar}>Criar novo usuario</button>
}

